/**
 * Write human-readable copies of dog.js / main.js into study/js/
 * Runtime files in public/ stay minified.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const STATIC = path.join(ROOT, "public/app/themes/portfolio-2018/static/js");
const OUT = path.join(ROOT, "study/js");

async function beautifyWithNode(src, dest) {
  // Lightweight indent without external dep if prettier/js-beautify missing
  const code = await fs.readFile(src, "utf8");
  // Prefer npx js-beautify when available
  try {
    execFileSync(
      "npx",
      ["--yes", "js-beautify", "-f", src, "-o", dest, "-s", "2", "-w", "120"],
      { stdio: "inherit", cwd: ROOT },
    );
    return;
  } catch {
    /* fallback */
  }
  // Fallback: just copy (still searchable) with a note
  await fs.writeFile(
    dest,
    `/* beautify failed — raw copy for study */\n${code}`,
    "utf8",
  );
}

async function main() {
  await fs.mkdir(OUT, { recursive: true });
  for (const name of ["main.js", "dog.js"]) {
    const src = path.join(STATIC, name);
    const dest = path.join(OUT, name.replace(".js", ".beautified.js"));
    console.log(`Beautifying ${name}…`);
    await beautifyWithNode(src, dest);
    const st = await fs.stat(dest);
    console.log(`  → ${dest} (${(st.size / 1024).toFixed(0)} KB)`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
