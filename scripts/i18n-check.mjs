#!/usr/bin/env node
/**
 * i18n coverage check (run: node --experimental-strip-types scripts/i18n-check.mjs)
 *
 *  Dictionaries are keyed by stable dot-keys (home.hero.title, cases.*), and
 *  all 10 locale files are complete — ru.json included.
 *
 *  1. Collects every dictionary key in use:
 *     - t("…") literals, PAGE_TITLE constants and FX_PHRASES values from the
 *       page modules / routes (a raw Cyrillic source left in code → failure);
 *     - every text token of the ru baseline snapshots
 *       (scripts/out/html-baseline — normalized live SSR captured by
 *       scripts/regen-html-baseline.mjs) mapped back to its key through the
 *       complete ru.json (value → key). This covers data-driven keys
 *       (case cards, roadmap table cells, typed contact sentences).
 *  2. Per locale: every collected key exists; every dictionary key is used;
 *     all 10 dictionaries share the same key set; keys are dot-keys.
 *  3. Live SSR (BASE_URL): no Cyrillic leaks on non-ru locales (switcher
 *     endonyms and the uk locale are exempt).
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
  LOCALE_COOKIE,
} from "../i18n/core.ts";

const PAGES = [
  { name: "home", path: "/" },
  { name: "about", path: "/about/" },
  { name: "values", path: "/values/" },
  { name: "contact", path: "/contact/" },
  { name: "safety", path: "/safety/" },
  { name: "privacy", path: "/privacy/" },
  { name: "support", path: "/support/" },
];
const BASE_URL = process.env.BASE_URL ?? "http://localhost:3111";
const CYRILLIC = /[\u0400-\u04FF]/;
const DOT_KEY = /^[a-z][a-z0-9]*(?:\.[a-z0-9-]+)+$/i;
const NATIVE_VALUES = new Set(Object.values(NATIVE_NAMES));
const T_SOURCE_FILES = [
  "components/pages/shared.tsx",
  "components/pages/home.tsx",
  "components/pages/about.tsx",
  "components/pages/values.tsx",
  "components/pages/contact.tsx",
  "components/pages/privacy.tsx",
  "components/pages/support.tsx",
  "components/pages/not-found.tsx",
  "components/legacy/SafetyContent.tsx",
  "app/not-found.tsx",
  "app/(legacy)/[lang]/page.tsx",
  "app/(legacy)/[lang]/about/page.tsx",
  "app/(legacy)/[lang]/values/page.tsx",
  "app/(legacy)/[lang]/contact/page.tsx",
  "app/(legacy)/[lang]/safety/page.tsx",
  "app/(legacy)/[lang]/privacy/page.tsx",
  "app/(legacy)/[lang]/support/page.tsx",
];

let failures = 0;
const fail = (msg) => {
  failures += 1;
  console.error(`  ✗ ${msg}`);
};

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
      // div.js-sentences holds a JSON array — items are the rendered strings.
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

/** A t()/PAGE_TITLE/FX source: dot-keys are collected, Cyrillic is a bug. */
const sources = new Set();
function collectSource(raw, file) {
  const s = raw.replace(/\\n/g, "\n");
  if (CYRILLIC.test(s)) {
    fail(`raw Cyrillic source left in ${file}: ${JSON.stringify(s.slice(0, 60))}`);
  }
  if (DOT_KEY.test(s)) sources.add(s);
}

// ---------------------------------------------------------------------------

// ru baseline tokens → keys through the complete ru.json (value → keys;
// distinct keys may legitimately share a value, e.g. the per-case «АВТОРУ»
// labels cases.pulse.author / cases.hearers.author).
const ruDict = JSON.parse(
  await readFile("i18n/dictionaries/ru.json", "utf8"),
);
const ruValueToKeys = new Map();
for (const [key, value] of Object.entries(ruDict)) {
  const keys = ruValueToKeys.get(value) ?? new Set();
  keys.add(key);
  ruValueToKeys.set(value, keys);
}
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
  for (const s of snapshotSources(snapshot.split("\n"), new Set())) {
    for (const key of ruValueToKeys.get(s) ?? []) sources.add(key);
  }
}

for (const key of Object.values(FX_PHRASES)) collectSource(key, "i18n/core.ts");
for (const f of T_SOURCE_FILES) {
  const src = await readFile(f, "utf8");
  for (const m of src.matchAll(/\bt\(\s*"([^"]+)"/g)) collectSource(m[1], f);
  for (const m of src.matchAll(/\bt\(\s*'([^']+)'/g)) collectSource(m[1], f);
  for (const m of src.matchAll(/export const PAGE_TITLE = "([^"]+)"/g)) {
    collectSource(m[1], f);
  }
}

const dicts = {};
for (const locale of LOCALES) {
  dicts[locale] = JSON.parse(
    await readFile(`i18n/dictionaries/${locale}.json`, "utf8"),
  );
}

// All 10 dictionaries share the same key set, and every key is a dot-key.
const baseKeys = Object.keys(dicts[DEFAULT_LOCALE]);
for (const locale of LOCALES) {
  const keys = Object.keys(dicts[locale]);
  const extra = keys.filter((k) => !baseKeys.includes(k));
  const missing = baseKeys.filter((k) => !keys.includes(k));
  if (extra.length || missing.length) {
    fail(
      `${locale}: key set differs from ${DEFAULT_LOCALE} ` +
        `(+${JSON.stringify(extra.slice(0, 3))} / -${JSON.stringify(missing.slice(0, 3))})`,
    );
  }
  for (const key of keys) {
    if (!DOT_KEY.test(key)) {
      fail(`${locale}: non-dot key: ${JSON.stringify(key.slice(0, 60))}`);
    }
  }
}

for (const locale of LOCALES) {
  const dict = dicts[locale];
  console.log(`\n== ${locale} ==`);

  for (const key of sources) {
    if (!(key in dict)) fail(`${locale} missing key: ${JSON.stringify(key.slice(0, 70))}`);
  }

  // Unused / suspicious keys (likely typos → render as the raw key).
  for (const key of Object.keys(dict)) {
    if (!sources.has(key)) console.log(`  ⚠ unused key: ${JSON.stringify(key.slice(0, 60))}`);
  }

  // Live SSR: no Cyrillic leaks (ru/uk are Cyrillic-content locales by design;
  // switcher endonyms stay exempt for every locale).
  if (locale === "ru" || locale === "uk") continue;
  for (const page of PAGES) {
    // Clean public URL + the dp-locale cookie (proxy.ts picks the locale).
    const url = `${BASE_URL}${page.path}`;
    const res = await fetch(url, {
      headers: { Cookie: `${LOCALE_COOKIE}=${locale}` },
    });
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
