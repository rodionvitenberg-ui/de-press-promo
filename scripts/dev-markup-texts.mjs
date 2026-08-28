// Dev helper: list visible text nodes (line numbers) of legacy markups.
import fs from "node:fs";

const names = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ["home", "studio", "careers", "values", "contact"];

for (const f of names) {
  const src = fs.readFileSync(
    new URL(`../components/legacy/markups/${f}.ts`, import.meta.url),
    "utf8",
  );
  const m = src.match(/export const MARKUP = `([\s\S]*?)`;\s*$/);
  if (!m) {
    console.log(`== ${f}: NO MARKUP`);
    continue;
  }
  console.log(`===== ${f.toUpperCase()} =====`);
  let inSvg = false;
  const lines = m[1].split("\n");
  lines.forEach((l, i) => {
    if (/<svg/.test(l)) inSvg = true;
    const skip = inSvg;
    if (/<\/svg>/.test(l)) inSvg = false;
    if (skip) return;
    const t = l
      .replace(/<script[\s\S]*?<\/script>/g, "")
      .replace(/<[^>]*>/g, "")
      .replace(/&amp;/g, "&")
      .trim();
    if (t && t.length > 1 && !/^\{/.test(t)) {
      console.log(String(i + 1).padStart(4) + " | " + t);
    }
  });
}
