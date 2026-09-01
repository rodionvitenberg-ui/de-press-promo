#!/usr/bin/env node
/**
 * i18n coverage check (run: node --experimental-strip-types scripts/i18n-check.mjs)
 *
 *  1. Collects every localizable source string from the ru baseline snapshots
 *     (scripts/out/html-baseline — normalized live SSR captured by
 *     scripts/regen-html-baseline.mjs; fx-parent letter blocks are renderer
 *     output, not sources) + fx phrases, PAGE_TITLE constants and t("…")
 *     literals in the JSX page modules / routes.
 *  2. Per locale: every Cyrillic source has a dictionary key; the live SSR
 *     HTML (BASE_URL) carries no Cyrillic leaks (non-ru; switcher endonyms
 *     and the uk locale are exempt).
 *  3. Reports dictionary keys that match nothing (likely typos).
 *
 *  Baseline snapshots are gitignored — run scripts/regen-html-baseline.mjs
 *  (with the server on BASE_URL) before this check.
 */
import { readFile } from "node:fs/promises";
import {
  LOCALES,
  DEFAULT_LOCALE,
  NATIVE_NAMES,
  FX_PHRASES,
  localePath,
} from "../i18n/core.ts";

const PAGES = [
  { name: "home", path: "/" },
  { name: "about", path: "/about/" },
  { name: "values", path: "/values/" },
  { name: "contact", path: "/contact/" },
  { name: "safety", path: "/safety/" },
  { name: "privacy", path: "/privacy/" },
];
const BASE_URL = process.env.BASE_URL ?? "http://localhost:3111";
const CYRILLIC = /[\u0400-\u04FF]/;
const NATIVE_VALUES = new Set(Object.values(NATIVE_NAMES));
const T_SOURCE_FILES = [
  "components/pages/shared.tsx",
  "components/pages/home.tsx",
  "components/pages/about.tsx",
  "components/pages/values.tsx",
  "components/pages/contact.tsx",
  "components/legacy/SafetyContent.tsx",
  "components/legacy/PrivacyContent.tsx",
  "app/(legacy)/page.tsx",
  "app/(legacy)/about/page.tsx",
  "app/(legacy)/values/page.tsx",
  "app/(legacy)/contact/page.tsx",
  "app/(legacy)/safety/page.tsx",
  "app/(legacy)/privacy/page.tsx",
  "app/(legacy)/[lang]/privacy/page.tsx",
];

/** Snapshot lines → localizable strings (text tokens, attrs, js-sentences). */
function snapshotSources(lines, exclude) {
  const out = [];
  let inFxBlock = false;
  let inLetter = false;
  for (const line of lines) {
    if (inLetter) {
      if (line === "</span>") inLetter = false;
      continue;
    }
    if (inFxBlock) {
      if (line === "</p>") inFxBlock = false;
      continue;
    }
    // fx-parent blocks hold the fxBlock letter/word spans — skip them whole.
    // (about-clients renders fx inside p.about-title without fx-parent, so
    // fx-letter spans are skipped individually as well.)
    if (/class="[^"]*fx-parent/.test(line)) {
      inFxBlock = true;
      continue;
    }
    if (/class="fx-letter /.test(line)) {
      inLetter = true;
      continue;
    }
    const text = line.match(/^"(.*)"$/);
    if (text) {
      const core = text[1].replace(/\s+/g, " ").trim();
      if (!core || exclude.has(core)) continue;
      // div.js-sentences holds a JSON array — items are the real source keys.
      if (core.startsWith("[") && core.endsWith("]")) {
        try {
          for (const item of JSON.parse(core)) out.push(item);
        } catch {
          out.push(core);
        }
        continue;
      }
      out.push(core);
      continue;
    }
    for (const m of line.matchAll(
      /\b(title|alt|placeholder|data-after)="([^"]*)"/g,
    )) {
      const core = m[2].replace(/\s+/g, " ").trim();
      if (core) out.push(core);
    }
  }
  return out;
}

function textNodes(html) {
  const out = [];
  const re = />([^<>]+)</g;
  let m;
  while ((m = re.exec(html))) {
    const s = m[1].replace(/\s+/g, " ").trim();
    if (s) out.push(s);
  }
  return out;
}

function attrs(html) {
  const out = [];
  const re = /\b(title|alt|placeholder|data-after)="([^"]*)"/g;
  let m;
  while ((m = re.exec(html))) {
    const s = m[2].replace(/\s+/g, " ").trim();
    if (s) out.push(s);
  }
  return out;
}

// ---------------------------------------------------------------------------

const sources = new Set();
// ru.json holds intentional display overrides (fx titles, the menu slogan) —
// their values show up in the ru snapshots as texts but are not source keys.
const ruOverrides = new Set(
  Object.values(
    JSON.parse(await readFile("i18n/dictionaries/ru.json", "utf8")),
  ),
);
for (const page of PAGES) {
  let snapshot;
  try {
    snapshot = await readFile(`scripts/out/html-baseline/ru--${page.name}.html`, "utf8");
  } catch {
    console.error(
      `  ✗ ru--${page.name}.html missing — run scripts/regen-html-baseline.mjs first`,
    );
    process.exit(1);
  }
  for (const s of snapshotSources(snapshot.split("\n"), ruOverrides)) sources.add(s);
}

for (const key of Object.keys(FX_PHRASES)) sources.add(FX_PHRASES[key]);
for (const f of T_SOURCE_FILES) {
  const src = await readFile(f, "utf8");
  // Two patterns: an apostrophe inside "Don't cry alone" must not cut the key.
  for (const m of src.matchAll(/\bt\(\s*"([^"]+)"/g)) sources.add(m[1]);
  for (const m of src.matchAll(/\bt\(\s*'([^']+)'/g)) sources.add(m[1]);
  for (const m of src.matchAll(/export const PAGE_TITLE = "([^"]+)"/g)) {
    sources.add(m[1]);
  }
}

let failures = 0;
const fail = (msg) => {
  failures += 1;
  console.error(`  ✗ ${msg}`);
};

for (const locale of LOCALES) {
  const dict = JSON.parse(
    await readFile(`i18n/dictionaries/${locale}.json`, "utf8"),
  );
  console.log(`\n== ${locale} ==`);

  // Unused / suspicious keys (likely typos → silent no-op at render).
  for (const key of Object.keys(dict)) {
    if (!sources.has(key)) console.log(`  ⚠ unused key: ${JSON.stringify(key.slice(0, 60))}`);
  }

  // Every Cyrillic source must be covered (unless locale is the default).
  if (locale !== DEFAULT_LOCALE) {
    for (const s of sources) {
      if (CYRILLIC.test(s) && !NATIVE_VALUES.has(s) && !(s in dict)) {
        fail(`${locale} missing key: ${JSON.stringify(s.slice(0, 70))}`);
      }
    }
  }

  if (locale === DEFAULT_LOCALE) continue;

  // Live SSR: no Cyrillic leaks (switcher endonyms and uk are intentional).
  for (const page of PAGES) {
    const url = `${BASE_URL}${localePath(locale, page.path)}`;
    const res = await fetch(url);
    if (!res.ok) {
      fail(`${page.name}: ${res.status} ${url}`);
      continue;
    }
    const html = (await res.text())
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ");
    const leaks = [
      ...textNodes(html),
      ...attrs(html),
      ...(html.match(/class="js-sentences[^"]*">([\s\S]*?)<\/div>/) ?? []).slice(1),
    ].filter((s) => CYRILLIC.test(s) && !NATIVE_VALUES.has(s) && locale !== "uk");
    if (leaks.length) fail(`${page.name}: ${JSON.stringify(leaks.slice(0, 6))}`);
  }
}

console.log(
  failures === 0
    ? "\ni18n check: OK"
    : `\ni18n check: ${failures} failure(s)`,
);
process.exit(failures === 0 ? 0 : 1);
