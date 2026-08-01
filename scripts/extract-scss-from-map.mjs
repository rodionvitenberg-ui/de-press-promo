/**
 * Extract original SCSS sources from main.css.map into study/scss/
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const MAP = path.join(
  ROOT,
  "public/app/themes/portfolio-2018/static/css/main.css.map",
);
const OUT = path.join(ROOT, "study/scss");

async function main() {
  const raw = await fs.readFile(MAP, "utf8");
  const map = JSON.parse(raw);
  const sources = map.sources || [];
  const contents = map.sourcesContent || [];

  await fs.rm(OUT, { recursive: true, force: true });
  await fs.mkdir(OUT, { recursive: true });

  let written = 0;
  for (let i = 0; i < sources.length; i++) {
    const src = sources[i];
    const content = contents[i];
    if (content == null) continue;

    // Normalize path: strip leading ../ and node_modules noise into folders
    let rel = src.replace(/\\/g, "/");
    if (rel.startsWith("webpack://")) rel = rel.replace(/^webpack:\/\//, "");
    rel = rel.replace(/^(\.\.\/)+/, "");
    rel = rel.replace(/^\/+/, "");
    if (!rel) rel = `source-${i}.scss`;

    const dest = path.join(OUT, rel);
    await fs.mkdir(path.dirname(dest), { recursive: true });
    await fs.writeFile(dest, content, "utf8");
    written++;
  }

  console.log(`Extracted ${written} sources → ${OUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
