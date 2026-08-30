#!/usr/bin/env node
/**
 * i18n inventory extractor for the legacy markup snapshots.
 *
 * Parses the MARKUP template literals in components/legacy/markups/*.ts and
 * extracts every localizable string:
 *   - text nodes (">...<")  — with fx-blocks reconstructed into phrases
 *   - localizable attributes: title / alt / placeholder / data-after
 *
 * Usage:
 *   node scripts/i18n-extract.mjs                # print inventory
 *   node scripts/i18n-extract.mjs --fx           # only fx phrases
 */
import { readFile } from "node:fs/promises";
import path from "node:path";

const MARKUPS_DIR = "components/legacy/markups";
const FILES = ["home", "about", "values", "contact"];

function markupSource(ts) {
  const m = ts.match(/export const MARKUP = `([\s\S]*)`;/);
  if (!m) throw new Error("MARKUP template not found");
  return m[1];
}

/** Reconstruct fx phrases: <br> → lines, fx-word segments → words. */
function extractFx(html) {
  const phrases = [];
  const blockRe = /<([a-z0-9]+) class="[^"]*fx-parent[^"]*">([\s\S]*?)<\/\1>/g;
  let block;
  while ((block = blockRe.exec(html))) {
    const lines = block[2].split(/<br\s*\/?>/);
    const lineWords = lines.map((line) =>
      line
        .split('<span class="fx-word">')
        .slice(1) // segment before the first fx-word open holds no letters
        .map((seg) => {
          let word = "";
          const letterRe = /<span class="fx-letter[^"]*">([^<]*)<\/span>/g;
          let l;
          while ((l = letterRe.exec(seg))) word += l[1];
          return word;
        })
        .filter(Boolean)
        .join(" "),
    );
    phrases.push(lineWords.join("\n"));
  }
  return phrases;
}


/** Text nodes outside fx blocks. */
function extractTextNodes(html) {
  const out = [];
  const re = />([^<>]+)</g;
  let m;
  while ((m = re.exec(html))) {
    const s = m[1].replace(/\s+/g, " ").trim();
    if (s) out.push(s);
  }
  return out;
}

function extractAttrs(html) {
  const out = [];
  const re = /\b(title|alt|placeholder|data-after)="([^"]*)"/g;
  let m;
  while ((m = re.exec(html))) {
    const s = m[2].replace(/\s+/g, " ").trim();
    if (s) out.push([m[1], s]);
  }
  return out;
}

const onlyFx = process.argv.includes("--fx");

for (const name of FILES) {
  const file = path.join(MARKUPS_DIR, `${name}.ts`);
  const html = markupSource(await readFile(file, "utf8"));
  const fx = extractFx(html);
  console.log(`\n=== ${name} ===`);
  console.log("-- fx phrases --");
  for (const p of fx) console.log(JSON.stringify(p));
  if (!onlyFx) {
    const stripped = html.replace(
      /<([a-z0-9]+) class="[^"]*fx-parent[^"]*">[\s\S]*?<\/\1>/g,
      "",
    );
    const nodes = [...new Set(extractTextNodes(stripped))];
    const attrs = extractAttrs(stripped);
    console.log("-- text nodes --");
    for (const s of nodes) console.log(JSON.stringify(s));
    console.log("-- attrs --");
    for (const [a, s] of attrs) console.log(`${a}: ${JSON.stringify(s)}`);
  }
}
