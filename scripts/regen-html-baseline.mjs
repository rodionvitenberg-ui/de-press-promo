#!/usr/bin/env node
/**
 * regen-html-baseline — capture the normalized SSR body of every page × 10
 * locales from the live server (BASE_URL, default http://localhost:3111) into
 * scripts/out/html-baseline (gitignored) for scripts/i18n-check.mjs.
 *
 * The synthesized-baseline era ended in A3: the html-diff guard
 * ("SSR == legacy snapshot") retired — regressions are caught by the reference
 * screenshots (reference/screenshots/) now. This script stays as the live
 * snapshot provider for i18n-check; re-run it whenever SSR changes.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { LOCALES, DEFAULT_LOCALE } from "../i18n/core.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const BASE = join(ROOT, "scripts", "out", "html-baseline");
const BASE_URL = process.env.BASE_URL ?? "http://localhost:3111";

const PAGES = [
  { name: "home", path: "/" },
  { name: "about", path: "/about/" },
  { name: "values", path: "/values/" },
  { name: "contact", path: "/contact/" },
  { name: "safety", path: "/safety/" },
  { name: "privacy", path: "/privacy/" },
];

mkdirSync(BASE, { recursive: true });

// ---------------------------------------------------------------------------
// Normalization (moved verbatim from the retired scripts/html-diff.mjs —
// i18n-check parses the same per-line quoted-token format)
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
      // Canonicalize `attr=""` / `attr=''` to a bare attribute — HTML treats
      // them as the same attribute value (""), React always serializes the
      // ="…" form (the template had data-sentences='').
      let s = seg.replace(/=['"]{2}/g, "");
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

for (const locale of LOCALES) {
  for (const page of PAGES) {
    const url = `${BASE_URL}${locale === DEFAULT_LOCALE ? "" : `/${locale}`}${page.path}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${res.status} ${url}`);
    writeFileSync(
      join(BASE, `${locale}--${page.name}.html`),
      `${normalize(await res.text())}\n`,
    );
    console.log("regen (live):", `${locale}--${page.name}`);
  }
}
console.log(`REGEN DONE ${LOCALES.length * PAGES.length}`);

