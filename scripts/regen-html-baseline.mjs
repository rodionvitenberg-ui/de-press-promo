import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import {
  finalizeMarkup,
  makeTranslator,
  LOCALES,
  DEFAULT_LOCALE,
} from "/home/rodion/Project/promo-depress/i18n/core.ts";
import { normalize } from "/home/rodion/Project/promo-depress/scripts/html-diff.mjs";
import * as homeMarkup from "/home/rodion/Project/promo-depress/components/legacy/markups/home.ts";
import * as aboutMarkup from "/home/rodion/Project/promo-depress/components/legacy/markups/about.ts";
import * as valuesMarkup from "/home/rodion/Project/promo-depress/components/legacy/markups/values.ts";

import * as contactMarkup from "/home/rodion/Project/promo-depress/components/legacy/markups/contact.ts";

// Regenerate the html-diff baseline (scripts/out/html-baseline, gitignored).
// Converted pages (home, about, values, contact) are synthesized from their legacy
// markup snapshots through the i18n pipeline — the live server no longer
// renders them the legacy way. Layout body prefix/suffix (nodes around
// .boot-page-root) is taken from a live page so the synthetic body matches
// the real DOM. Still-legacy pages are captured from the live server.
const ROOT = "/home/rodion/Project/promo-depress";
const BASE = join(ROOT, "scripts", "out", "html-baseline");
const BASE_URL = process.env.BASE_URL ?? "http://localhost:3111";

const MARKUP_PAGES = [
  ["home", homeMarkup, "/"],
  ["about", aboutMarkup, "/about/"],
  ["values", valuesMarkup, "/values/"],
];
const LIVE_PAGES = [["contact", "/contact/"], ["safety", "/safety/"]];

mkdirSync(BASE, { recursive: true });

const dict = (locale) =>
  JSON.parse(readFileSync(join(ROOT, "i18n", "dictionaries", `${locale}.json`), "utf8"));

// Layout body prefix/suffix around .boot-page-root, taken from a live page
// so the synthetic markup-based baseline matches the real DOM.
const live = await (await fetch(`${BASE_URL}/values/`)).text();
const bodyHtml = (live.match(/<body[^>]*>([\s\S]*)<\/body>/) ?? [])[1] ?? live;
const OPEN = '<div class="boot-page-root">';
const pIdx = bodyHtml.indexOf(OPEN);
const PREFIX = bodyHtml.slice(0, pIdx + OPEN.length);
const SUFFIX = bodyHtml.slice(bodyHtml.lastIndexOf("</div>") + 6);

for (const locale of LOCALES) {
  const t = makeTranslator(dict(locale));
  for (const [name, mod, path] of MARKUP_PAGES) {
    const html = finalizeMarkup({ markup: mod.MARKUP, t, locale, path });
    const body = `${PREFIX}${html}</div>${SUFFIX}`;
    writeFileSync(join(BASE, `${locale}--${name}.html`), `${normalize(body)}\n`);
    console.log("regen (markup):", `${locale}--${name}`);
  }
  for (const [name, path] of LIVE_PAGES) {
    const url = `${BASE_URL}${locale === DEFAULT_LOCALE ? "" : `/${locale}`}${path}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${res.status} ${url}`);
    writeFileSync(join(BASE, `${locale}--${name}.html`), `${normalize(await res.text())}\n`);
    console.log("regen (live):", `${locale}--${name}`);
  }
}
console.log("REGEN DONE 50");

