#!/usr/bin/env node
/**
 * i18n coverage check (run: node --experimental-strip-types scripts/i18n-check.mjs)
 *
 *  1. Collects every localizable source string: markup text nodes, attrs,
 *     fx phrases, js-sentences, and t("…") calls in pages/SafetyContent.
 *  2. Per locale: no unresolved placeholders, no Cyrillic left in the final
 *     HTML (non-ru), every Cyrillic source has a dictionary key.
 *  3. Reports dictionary keys that match nothing (likely typos).
 */
import { readFile } from "node:fs/promises";
import {
  LOCALES,
  DEFAULT_LOCALE,
  NATIVE_NAMES,
  makeTranslator,
  finalizeMarkup,
  FX_PHRASES,
} from "../i18n/core.ts";

const MARKUPS = { home: "/", about: "/about/", values: "/values/", contact: "/contact/" };
const CYRILLIC = /[\u0400-\u04FF]/;

function markupSource(ts) {
  return ts.match(/export const MARKUP = `([\s\S]*)`;/)[1];
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

const sources = new Set();
const rawMarkups = {};
for (const name of Object.keys(MARKUPS)) {
  const fileText = await readFile(`components/legacy/markups/${name}.ts`, "utf8");
  const html = markupSource(fileText);
  rawMarkups[name] = html;
  const pageTitle = fileText.match(/export const PAGE_TITLE = "([^"]+)"/);
  if (pageTitle) sources.add(pageTitle[1]);
  const stripped = html.replace(
    /<([a-z0-9]+) class="[^"]*fx-parent[^"]*">[\s\S]*?<\/\1>/g,
    "",
  );
  for (const s of [...textNodes(stripped), ...attrs(stripped)]) {
    // div.js-sentences holds a JSON array — items are the real source keys.
    if (s.startsWith("[") && s.endsWith("]")) {
      try {
        for (const item of JSON.parse(s)) sources.add(item);
      } catch {
        sources.add(s);
      }
      continue;
    }
    sources.add(s);
  }
  for (const key of Object.keys(FX_PHRASES)) sources.add(FX_PHRASES[key]);
  for (const f of [
    "components/legacy/SafetyContent.tsx",
    "app/(legacy)/page.tsx",
    "app/(legacy)/about/page.tsx",
    "app/(legacy)/values/page.tsx",
    "app/(legacy)/contact/page.tsx",
    "app/(legacy)/safety/page.tsx",
  ]) {
    const src = await readFile(f, "utf8");
    for (const m of src.matchAll(/\bt\(\s*"([^"]+)"/g)) sources.add(m[1]);
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
  const t = makeTranslator(dict);
  console.log(`\n== ${locale} ==`);

  // Unused / suspicious keys (likely typos → silent no-op at render).
  for (const key of Object.keys(dict)) {
    if (!sources.has(key)) console.log(`  ⚠ unused key: ${JSON.stringify(key.slice(0, 60))}`);
  }

  // Every Cyrillic source must be covered (unless locale is the default).
  if (locale !== DEFAULT_LOCALE) {
    for (const s of sources) {
      if (CYRILLIC.test(s) && !(s in dict)) {
        fail(`${locale} missing key: ${JSON.stringify(s.slice(0, 70))}`);
      }
    }
  }

  // Finalized pages: placeholders resolved, no Cyrillic leaks (non-ru).
  for (const [name, path] of Object.entries(MARKUPS)) {
    const html = finalizeMarkup({
      markup: rawMarkups[name],
      t,
      locale,
      path,
    });
    if (html.includes("<!--DP:FX:") || html.includes("<!--DP:LANGS-->")) {
      fail(`${name}: unresolved placeholder`);
    }
    if (locale === DEFAULT_LOCALE) continue;
    const leaks = [
      ...textNodes(html),
      ...attrs(html),
      ...(html.match(/class="js-sentences[^"]*">([\s\S]*?)<\/div>/) ?? []).slice(1),
    ].filter(
      (s) =>
        CYRILLIC.test(s) &&
        // switcher endonyms are intentional in every locale…
        !Object.values(NATIVE_NAMES).includes(s) &&
        // …and uk output is legitimately Cyrillic — coverage is already
        // guaranteed by the missing-key check above.
        locale !== "uk",
    );
    if (leaks.length) fail(`${name}: ${JSON.stringify(leaks.slice(0, 6))}`);
  }
}

console.log(
  failures === 0
    ? "\ni18n check: OK"
    : `\ni18n check: ${failures} failure(s)`,
);
process.exit(failures === 0 ? 0 : 1);
