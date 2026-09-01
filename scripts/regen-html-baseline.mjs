import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { finalizeLegacyMarkup } from "/home/rodion/Project/promo-depress/i18n/index.ts";
import { normalize } from "/home/rodion/Project/promo-depress/scripts/html-diff.mjs";
import homeMarkup from "/home/rodion/Project/promo-depress/components/legacy/markups/home.ts";
import aboutMarkup from "/home/rodion/Project/promo-depress/components/legacy/markups/about.ts";
import { LOCALES, DEFAULT_LOCALE } from "/home/rodion/Project/promo-depress/i18n/core.ts";
const BASE = "/home/rodion/Project/promo-depress/scripts/out/html-baseline";
const BASE_URL = "http://localhost:3111";
const MARKUP_PAGES = [["home", homeMarkup, "/"], ["about", aboutMarkup, "/about/"]];
const LIVE_PAGES = [["values", "/values/"], ["contact", "/contact/"], ["safety", "/safety/"]];
mkdirSync(BASE, { recursive: true });
for (const locale of LOCALES) {
  for (const [name, mod, path] of MARKUP_PAGES) {
    const html = finalizeLegacyMarkup({ markup: mod.MARKUP, locale, path });
    const body = `<div class="boot-page-root">${html}</div>`;
    writeFileSync(join(BASE, `${locale}--${name}.html`), normalize(body) + "\n");
    console.log("regen (markup):", `${locale}--${name}`);
  }
  for (const [name, path] of LIVE_PAGES) {
    const url = `${BASE_URL}${locale === DEFAULT_LOCALE ? "" : "/" + locale}${path}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${res.status} ${url}`);
    writeFileSync(join(BASE, `${locale}--${name}.html`), normalize(await res.text()) + "\n");
    console.log("regen (live):", `${locale}--${name}`);
  }
}
console.log("DONE");
