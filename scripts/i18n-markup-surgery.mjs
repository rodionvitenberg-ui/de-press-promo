#!/usr/bin/env node
/**
 * One-shot surgery on the legacy markup snapshots for i18n + careers removal:
 *   1. fx display-title blocks → <!--DP:FX:name--> placeholders
 *      (regenerated per locale from the dictionaries at render time)
 *   2. footer language <ul> → <!--DP:LANGS--> (10 locales, generated)
 *   3. menu item linking to /careers/ → removed
 *   4. about.ts table cell referencing /careers/ → /contact/
 * Run once; idempotent for already-processed blocks.
 */
import { readFile, writeFile } from "node:fs/promises";

const FILES = {
  home: ["home-hero", "home-about"],
  about: ["about-intro", "about-swagger"],
  values: ["values-culture", "values-tgif", "values-hiring"],
  contact: [],
};

for (const [name, fxNames] of Object.entries(FILES)) {
  const file = `components/legacy/markups/${name}.ts`;
  let src = await readFile(file, "utf8");

  // 1. fx blocks → placeholders, in declared document order (single pass,
  //    so an already-replaced block is never matched again)
  {
    let fxIndex = 0;
    src = src.replace(
      /(<([a-z0-9]+) class="[^"]*fx-parent[^"]*">)[\s\S]*?(<\/\2>)/g,
      (_m, open, _tag, close) => {
        const fxName = fxNames[fxIndex];
        if (!fxName) throw new Error(`${file}: more fx blocks than names`);
        fxIndex += 1;
        return `${open}\n<!--DP:FX:${fxName}-->\n${close}`;
      },
    );
    if (fxIndex !== fxNames.length) {
      throw new Error(
        `${file}: expected ${fxNames.length} fx blocks, found ${fxIndex}`,
      );
    }
  }

  // 1b. about.ts "Selected clients" — letter-split WITHOUT fx-parent on the
  //     container; same regenerated-spans approach.
  if (name === "about") {
    src = src.replace(
      /(<p class="about-title">)[\s\S]*?(<\/p>)/,
      "$1\n<!--DP:FX:about-clients-->\n$2",
    );
  }

  // 2. footer language switcher → placeholder (keep the "Язык:" label)
  const langsRe = /(Язык:[\s\S]*?)<ul>[\s\S]*?<\/ul>/;
  if (!src.includes("<!--DP:LANGS-->")) {
    if (!langsRe.test(src)) throw new Error(`${file}: language switcher not found`);
    src = src.replace(langsRe, "$1<!--DP:LANGS-->");
  }

  // 3. menu item → /careers/
  src = src.replace(
    /\n[ \t]*<li class="site-menu-item"><a href="\/careers\/" class="">Помогать<\/a><\/li>/,
    "",
  );

  // 4. about.ts cell: careers route is gone
  if (name === "about") {
    src = src.replace("Стучитесь на /careers/", "Стучитесь на /contact/");
  }

  await writeFile(file, src);
  console.log(
    `${name}: fx=${fxNames.length} langs=${src.includes("<!--DP:LANGS-->")} careers-left=${src.includes("/careers/")}`,
  );
}
