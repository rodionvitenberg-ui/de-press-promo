#!/usr/bin/env node
/**
 * html-diff — SSR-HTML guard for the markups → JSX migration (originalization, Phase 2).
 *
 *   node --experimental-strip-types scripts/html-diff.mjs --capture   # save baseline (BEFORE state)
 *   node --experimental-strip-types scripts/html-diff.mjs             # compare live server vs baseline
 *   node --experimental-strip-types scripts/html-diff.mjs --only=ru--home
 *
 * Compares <body> of every page × 10 locales between the captured baseline
 * (scripts/out/html-baseline/, gitignored) and the live server (BASE_URL,
 * default http://localhost:3111 — a fresh `next start` of the current code).
 *
 * Normalization (the explicit allowlist of acceptable differences):
 *   - <script> tags are stripped (Next chunk hashes/payloads differ between builds);
 *   - HTML comments are stripped (JSX cannot emit them; the only markup comment
 *     is the site-loader stub note);
 *   - whitespace-only text nodes are ignored around block tags (indentation
 *     noise) but kept as a strict `" "` token between two non-block tags —
 *     the browser renders those as a space, so JSX must reproduce them with
 *     {" "} (this is what catches glued inline elements);
 *   - non-whitespace text keeps ONE collapsed space at internal/leading/trailing
 *     whitespace runs — leading/trailing spaces of a text node are visually
 *     meaningful next to inline elements, so JSX must reproduce them explicitly
 *     ({" "}); \u00a0 (&nbsp;) is NOT touched (JS \s would eat it).
 *   - HTML entities in text (&#x27;, &quot;, &amp;, …) are decoded — React
 *     escapes some characters the template kept raw; the DOM text is the same.
 * Everything else must match exactly: tags, attributes, class lists, order.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { LOCALES, localePath } from "../i18n/core.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const BASELINE_DIR = join(ROOT, "scripts", "out", "html-baseline");
const BASE_URL = process.env.BASE_URL ?? "http://localhost:3111";

const PAGES = [
  { name: "home", path: "/" },
  { name: "about", path: "/about/" },
  { name: "values", path: "/values/" },
  { name: "contact", path: "/contact/" },
  { name: "safety", path: "/safety/" },
];

const CAPTURE = process.argv.includes("--capture");
const ONLY = process.argv.find((a) => a.startsWith("--only="))?.slice(7) ?? null;

// ---------------------------------------------------------------------------
// Normalization
// ---------------------------------------------------------------------------

/** Block-level tags: whitespace-only nodes around them never render. */
const BLOCK_TAGS = new Set([
  "div", "section", "ul", "ol", "li", "p", "h1", "h2", "h3", "h4", "h5", "h6",
  "picture", "source", "svg", "use", "circle", "path", "img", "header",
  "footer", "nav", "form", "label", "article", "aside", "main", "figure",
  "figcaption", "table", "thead", "tbody", "tr", "td", "th", "br", "hr",
  "blockquote", "video", "audio", "iframe", "canvas", "template", "style",
  "link", "meta", "button",
]);

function tagName(tag) {
  const m = tag.match(/^<\/?([a-zA-Z][a-zA-Z0-9-]*)/);
  return m ? m[1].toLowerCase() : "";
}

// Single-pass entity decode (order matters: &amp; first would re-eat the
// result of later decodes — a combined regex replaces without rescanning).
const ENTITY_RE = /&(?:amp|lt|gt|quot|#x27|apos|#x[\dA-Fa-f]+|#\d+);/g;
function decodeEntities(s) {
  return s.replace(ENTITY_RE, (m) => {
    if (m === "&amp;") return "&";
    if (m === "&lt;") return "<";
    if (m === "&gt;") return ">";
    if (m === "&quot;") return '"';
    if (m === "&#x27;" || m === "&apos;") return "'";
    const num = m.slice(3, -1);
    return String.fromCodePoint(
      parseInt(num, m[2] === "x" || m[2] === "X" ? 16 : 10),
    );
  });
}

/** Void HTML elements: serialized without a closing tag. */
const VOID_TAGS = new Set([
  "img", "source", "br", "hr", "input", "meta", "link", "wbr", "col",
  "area", "base", "embed", "track", "param",
]);

function tokenize(html) {
  const tokens = [];
  const re = /<[^>]*>|[^<]+/g;
  let t;
  while ((t = re.exec(html))) {
    const seg = t[0];
    if (seg.startsWith("<")) {
      // Canonicalize `attr=""` to a bare attribute — HTML treats them as the
      // same attribute value (""), React always serializes the ="…" form.
      let s = seg.replace(/=""/g, "");
      // React 19 passes legacy camelCase table attrs through unchanged;
      // HTML attribute names are case-insensitive → lowercase.
      s = s.replace(/cellPadding=/g, "cellpadding=").replace(/cellSpacing=/g, "cellspacing=");
      // Canonicalize self-closing forms: React emits `<img …/>` where the
      // template has `<img …>`, and both spell `<path …/>`. The DOM is the same.
      if (s.endsWith("/>")) {
        s = s.slice(0, -2) + ">";
        const name = tagName(s);
        tokens.push({ type: "tag", value: s.replace(/[ \t]+>$/, ">") });
        if (!VOID_TAGS.has(name)) {
          tokens.push({ type: "tag", value: `</${name}>` });
        }
      } else {
        tokens.push({ type: "tag", value: s.replace(/[ \t]+>$/, ">") });
      }
    } else {
      const collapsed = decodeEntities(seg.replace(/[ \t\n\r\f]+/g, " "));
      if (collapsed.trim()) {
        tokens.push({ type: "text", value: `"${collapsed}"` });
      } else {
        tokens.push({ type: "ws" });
      }
    }
  }
  return tokens;
}

function normalize(html) {
  let out = html;

  // <body>…</body> only: <head> carries Next internals (chunks, preloads).
  const body = out.match(/<body[^>]*>([\s\S]*)<\/body>/);
  if (body) out = body[1];

  // Explicit allowlist: scripts and comments are not part of the contract.
  out = out.replace(/<script[\s\S]*?<\/script>/g, "");
  out = out.replace(/<!--[\s\S]*?-->/g, "");

  // Whitespace-only text nodes between two non-block tags are rendered as a
  // space by the browser — JSX must reproduce them with {" "}, so the compare
  // is strict there. Around block tags the whitespace never renders → ignored.
  const tokens = tokenize(out);
  const parts = [];
  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i];
    if (tok.type === "ws") {
      const prev = tokens[i - 1];
      const next = tokens[i + 1];
      const prevTag = prev?.type === "tag" ? tagName(prev.value) : null;
      const nextTag = next?.type === "tag" ? tagName(next.value) : null;
      if (
        prevTag &&
        nextTag &&
        !BLOCK_TAGS.has(prevTag) &&
        !BLOCK_TAGS.has(nextTag)
      ) {
        parts.push('" "');
      }
      continue;
    }
    if (tok.type === "text") {
      // A collapsed edge space only renders next to an inline-level element;
      // against a block boundary (or document edge) the browser discards it.
      const prev = tokens[i - 1];
      const next = tokens[i + 1];
      const prevTag = prev?.type === "tag" ? tagName(prev.value) : null;
      const nextTag = next?.type === "tag" ? tagName(next.value) : null;
      let inner = tok.value.slice(1, -1);
      if (!prevTag || BLOCK_TAGS.has(prevTag)) inner = inner.replace(/^ /, "");
      if (!nextTag || BLOCK_TAGS.has(nextTag)) inner = inner.replace(/ $/, "");
      parts.push(`"${inner}"`);
      continue;
    }
    parts.push(tok.value);
  }
  return parts.join("\n");
}

// ---------------------------------------------------------------------------
// Line diff (LCS) — stdlib only
// ---------------------------------------------------------------------------

function diffLines(a, b) {
  const n = a.length;
  const m2 = b.length;
  const width = m2 + 1;
  const lcs = new Uint32Array((n + 1) * width);
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m2 - 1; j >= 0; j--) {
      lcs[i * width + j] =
        a[i] === b[j]
          ? lcs[(i + 1) * width + j + 1] + 1
          : Math.max(lcs[(i + 1) * width + j], lcs[i * width + j + 1]);
    }
  }
  const ops = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m2) {
    if (a[i] === b[j]) {
      i++;
      j++;
    } else if (lcs[(i + 1) * width + j] >= lcs[i * width + j + 1]) {
      ops.push(`- ${a[i]}`);
      i++;
    } else {
      ops.push(`+ ${b[j]}`);
      j++;
    }
  }
  while (i < n) ops.push(`- ${a[i++]}`);
  while (j < m2) ops.push(`+ ${b[j++]}`);
  return ops;
}

// ---------------------------------------------------------------------------

/** Exported for baseline regeneration tooling (scripts/out is gitignored). */
export { normalize };

async function fetchBody(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${url}`);
  return res.text();
}

async function main() {
const failures = [];
let checked = 0;

for (const locale of LOCALES) {
  for (const page of PAGES) {
    const key = `${locale}--${page.name}`;
    if (ONLY && !key.includes(ONLY)) continue;
    const url = `${BASE_URL}${localePath(locale, page.path)}`;
    const file = join(BASELINE_DIR, `${key}.html`);
    checked += 1;

    const normalized = normalize(await fetchBody(url));

    if (CAPTURE) {
      await mkdir(dirname(file), { recursive: true });
      await writeFile(file, normalized + "\n");
      console.log(`captured: ${key}`);
      continue;
    }

    let baseline;
    try {
      baseline = await readFile(file, "utf8");
    } catch {
      failures.push(`${key}: baseline missing (${file}) — run with --capture first`);
      continue;
    }

    const a = baseline.replace(/\n$/, "").split("\n");
    const b = normalized.split("\n");
    if (a.join("\n") === b.join("\n")) {
      console.log(`ok: ${key}`);
      continue;
    }
    const ops = diffLines(a, b);
    failures.push(`${key}: ${ops.length} diff line(s)`);
    console.error(`\n✗ ${key} (${url})`);
    for (const op of ops.slice(0, 40)) console.error(`  ${op}`);
    if (ops.length > 40) console.error(`  … +${ops.length - 40} more`);
  }
}

if (CAPTURE) {
  console.log(`\nhtml-diff: captured ${checked} baseline snapshot(s) → ${BASELINE_DIR}`);
} else {
  console.log(
    failures.length === 0
      ? `\nhtml-diff: OK (${checked} routes)`
      : `\nhtml-diff: ${failures.length}/${checked} route(s) differ`,
  );
  process.exit(failures.length === 0 ? 0 : 1);
}
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  main();
}
