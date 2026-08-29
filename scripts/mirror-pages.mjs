/**
 * Mirror dogstudio.co pages into public/ + generated markup modules.
 * Study-only local clone — not for redistribution.
 *
 * Pages: home (/), about, careers, values, contact
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const MARKUP_DIR = path.join(ROOT, "components/legacy/markups");
const ORIGIN = "https://dogstudio.co";
const THEME = "/app/themes/portfolio-2018";
const UA =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

/** @type {{ slug: string, path: string, moduleName: string }[]} */
const PAGES = [
  { slug: "home", path: "/", moduleName: "home" },
  { slug: "studio", path: "/studio/", moduleName: "about" },
  { slug: "careers", path: "/careers/", moduleName: "careers" },
  { slug: "values", path: "/values/", moduleName: "values" },
  { slug: "contact", path: "/contact/", moduleName: "contact" },
];

const KNOWN_ASSETS = [
  `${THEME}/static/js/main.js`,
  `${THEME}/static/js/dog.js`,
  `${THEME}/static/js/detectizr.js`,
  `${THEME}/static/js/modernizr.js`,
  `${THEME}/static/css/main.css`,
  `${THEME}/static/css/main.css.map`,
  // ⚠️ ФАЗА 0: dog.glb / dog.drc.glb / matcap-*.jpg НАМЕРЕННО УБРАНЫ из KNOWN_ASSETS,
  // чтобы `npm run mirror` не перезаписывал кастомизированную модель и атлас подсветки.
  // Они заменяются контентом de-press.co (см. README, Фаза 3).
  `${THEME}/static/assets/dog/images/dog/final/dog_normals.jpg`,
  `${THEME}/static/assets/dog/images/dog/final/ASTC/dog_diffuse.dds`,
  `${THEME}/static/assets/dog/images/dog/final/ASTC/dog_specular.dds`,
  `${THEME}/static/assets/dog/images/dog/final/ASTC/branches_diffuse.dds`,
  `${THEME}/static/assets/dog/images/dog/final/ASTC/branches_normals.dds`,
  `${THEME}/static/assets/dog/images/dog/final/PVRTC/dog_diffuse.pvr`,
  `${THEME}/static/assets/dog/images/dog/final/PVRTC/dog_specular.pvr`,
  `${THEME}/static/assets/dog/images/dog/final/PVRTC/branches_diffuse.pvr`,
  `${THEME}/static/assets/dog/images/dog/final/PVRTC/branches_normals.pvr`,
  `${THEME}/static/assets/dog/images/dog/final/dog_diffuse.jpg`,
  `${THEME}/static/assets/dog/images/dog/final/dog_specular.jpg`,
  `${THEME}/static/assets/dog/images/dog/final/branches_diffuse.jpg`,
  `${THEME}/static/assets/dog/images/dog/final/branches_normals.jpg`,
  `${THEME}/static/assets/dog/draco/draco_decoder.js`,
  `${THEME}/static/assets/dog/draco/draco_wasm_wrapper.js`,
  `${THEME}/static/assets/dog/draco/draco_decoder.wasm`,
  `${THEME}/static/assets/audios/ambience.mp3`,
  `${THEME}/static/assets/spritesheet.svg`,
  `${THEME}/static/assets/images/favicon.png`,
  `${THEME}/static/assets/images/shared/cover.jpg`,
  `${THEME}/static/assets/images/shared/share-facebook.jpg`,
  `${THEME}/static/assets/images/shared/share-twitter.jpg`,
  `${THEME}/static/assets/images/loader/dog.png`,
  `${THEME}/static/assets/images/loader/shadow.png`,
  `${THEME}/static/assets/images/home/dog.png`,
  `${THEME}/static/assets/images/menu/dog.png`,
  `${THEME}/static/assets/images/menu/baseline.png`,
  `${THEME}/static/assets/images/about/dog.png`,
  `${THEME}/static/assets/images/about/grid.png`,
  `${THEME}/static/assets/images/careers/dog.png`,
  `${THEME}/static/assets/images/values/dog.png`,
  `${THEME}/static/assets/images/noise.png`,
  `${THEME}/static/assets/images/decorations/dots.png`,
];

async function fetchText(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`GET ${url} → ${res.status}`);
  return res.text();
}

async function download(urlPath, destAbs) {
  const url = urlPath.startsWith("http") ? urlPath : `${ORIGIN}${urlPath}`;
  const cleanUrl = url.split("#")[0];
  await fs.mkdir(path.dirname(destAbs), { recursive: true });
  try {
    await fs.access(destAbs);
    const st = await fs.stat(destAbs);
    if (st.size > 0) {
      return { url: cleanUrl, path: destAbs, skipped: true, bytes: st.size };
    }
  } catch {
    /* download */
  }
  const res = await fetch(cleanUrl, { headers: { "User-Agent": UA } });
  if (!res.ok) {
    return { url: cleanUrl, path: destAbs, error: res.status, bytes: 0 };
  }
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(destAbs, buf);
  return { url: cleanUrl, path: destAbs, bytes: buf.length };
}

function toLocalPath(urlOrPath) {
  let u = urlOrPath.trim();
  if (!u || u.startsWith("data:") || u.startsWith("mailto:") || u.startsWith("#")) {
    return null;
  }
  if (u.startsWith("//")) u = `https:${u}`;
  if (u.startsWith(ORIGIN)) u = u.slice(ORIGIN.length);
  if (u.startsWith("https://") || u.startsWith("http://")) return null;
  u = u.split("?")[0].split("#")[0];
  if (!u.startsWith("/")) return null;
  if (
    u.startsWith("/app/themes/") ||
    u.startsWith("/app/plugins/") ||
    u.startsWith("/cms/wp-includes/")
  ) {
    return u;
  }
  return null;
}

function collectFromHtml(html) {
  const found = new Set();
  const attrRe =
    /(?:src|href|data-src|poster|data-poster)=["']([^"']+)["']/gi;
  let m;
  while ((m = attrRe.exec(html))) {
    const p = toLocalPath(m[1]);
    if (p) found.add(p);
  }
  const srcsetRe = /(?:srcset|data-srcset)=["']([^"']+)["']/gi;
  while ((m = srcsetRe.exec(html))) {
    for (const part of m[1].split(",")) {
      const token = part.trim().split(/\s+/)[0];
      const p = toLocalPath(token);
      if (p) found.add(p);
    }
  }
  return found;
}

function collectFromCss(css, cssUrlPath) {
  const found = new Set();
  const baseDir = path.posix.dirname(cssUrlPath);
  const re = /url\(\s*(['"]?)([^)'"]+)\1\s*\)/gi;
  let m;
  while ((m = re.exec(css))) {
    let ref = m[2].trim();
    if (ref.startsWith("data:")) continue;
    ref = ref.split("?")[0].split("#")[0];
    let abs;
    if (ref.startsWith("/")) abs = ref;
    else if (ref.startsWith("http")) {
      const p = toLocalPath(ref);
      if (p) found.add(p);
      continue;
    } else {
      abs = path.posix.normalize(path.posix.join(baseDir, ref));
    }
    const p = toLocalPath(abs);
    if (p) found.add(p);
  }
  return found;
}

function rewriteHtml(html) {
  let out = html;
  out = out.replaceAll(ORIGIN, "");
  out = out.replaceAll("https://dogstudio.co", "");
  // strip tracking / WP noise
  out = out.replace(
    /<!-- Google Tag Manager -->[\s\S]*?<!-- End Google Tag Manager -->/g,
    "",
  );
  out = out.replace(
    /<!-- Google Tag Manager \(noscript\) -->[\s\S]*?<!-- End Google Tag Manager \(noscript\) -->/g,
    "",
  );
  out = out.replace(
    /<!-- Browser Update -->[\s\S]*?<script>[\s\S]*?browser-update[\s\S]*?<\/script>/gi,
    "",
  );
  out = out.replace(/<script[^>]*wp-embed[^>]*>[\s\S]*?<\/script>/gi, "");
  out = out.replace(
    /<script type="text\/javascript">\(function\(\) \{\s*var expirationDate[\s\S]*?<\/script>/g,
    "",
  );
  out = out.replace(/<link[^>]*mailchimp-for-wp[^>]*>/gi, "");
  out = out.replace(
    /theme_link:\s*['"][^'"]*['"]/,
    "theme_link: '/app/themes/portfolio-2018'",
  );
  // locale / unused routes stay as paths; mx locale → home
  out = out.replace(/href="\/mx\/?"/g, 'href="/"');
  return out;
}

function extractBodyMeta(html) {
  const bodyOpen = html.match(/<body([^>]*)>/i);
  const attrs = bodyOpen?.[1] ?? "";
  const classMatch = attrs.match(/class=["']([^"']*)["']/i);
  const themeMatch = attrs.match(/data-theme=["']([^"']*)["']/i);
  const pageMatch = attrs.match(/data-page=["']([^"']*)["']/i);
  const titleMatch = html.match(/<title>([^<]*)<\/title>/i);

  const bodyInner = html.match(/<body[^>]*>([\s\S]*)<\/body>/i)?.[1] ?? "";
  let markup = bodyInner.replace(/<script\b[\s\S]*?<\/script>/gi, "");
  markup = markup.replace(/<noscript>[\s\S]*?<\/noscript>/gi, "");
  markup = markup.trim();

  return {
    bodyClass:
      classMatch?.[1] ??
      "page lock-scroll",
    dataTheme: themeMatch?.[1] ?? "home",
    dataPage: pageMatch?.[1] ?? "home",
    title: titleMatch?.[1]?.trim() ?? "Dogstudio",
    markup,
  };
}

function escapeForTemplateLiteral(s) {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\$\{/g, "\\${");
}

function writeMarkupModule(moduleName, meta) {
  return `/**
 * Auto-generated by scripts/mirror-pages.mjs — dogstudio.co page snapshot.
 * Study-only. Do not redistribute as your own product.
 */
export const BODY_CLASS = ${JSON.stringify(meta.bodyClass)};
export const DATA_THEME = ${JSON.stringify(meta.dataTheme)};
export const DATA_PAGE = ${JSON.stringify(meta.dataPage)};
export const PAGE_TITLE = ${JSON.stringify(meta.title)};
export const MARKUP = \`${escapeForTemplateLiteral(meta.markup)}\`;
`;
}

/**
 * CLI:
 *   node scripts/mirror-pages.mjs
 *   node scripts/mirror-pages.mjs --assets-only
 *   node scripts/mirror-pages.mjs --pages=home,studio
 *   node scripts/mirror-pages.mjs --pages=careers --assets-only
 *   node scripts/mirror-pages.mjs --help
 */
function parseArgs(argv) {
  const opts = {
    assetsOnly: false,
    pages: null, // null = all
    help: false,
  };
  for (const arg of argv) {
    if (arg === "--help" || arg === "-h") opts.help = true;
    else if (arg === "--assets-only") opts.assetsOnly = true;
    else if (arg.startsWith("--pages=")) {
      const raw = arg.slice("--pages=".length).trim();
      opts.pages = raw
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);
    } else if (arg.startsWith("--")) {
      console.warn(`Unknown flag: ${arg}`);
    }
  }
  return opts;
}

function printHelp() {
  console.log(`Usage: node scripts/mirror-pages.mjs [options]

Options:
  --assets-only     Download assets only; do NOT rewrite markups/*.ts
  --pages=a,b,c     Only these page slugs: ${PAGES.map((p) => p.moduleName).join(", ")}
  --help            Show this help

Examples:
  npm run mirror
  npm run mirror -- --assets-only
  npm run mirror -- --pages=home,studio
  npm run mirror -- --pages=careers --assets-only
`);
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) {
    printHelp();
    return;
  }

  let selected = PAGES;
  if (opts.pages) {
    const unknown = opts.pages.filter(
      (n) => !PAGES.some((p) => p.moduleName === n || p.slug === n),
    );
    if (unknown.length) {
      console.error(
        `Unknown page(s): ${unknown.join(", ")}. Valid: ${PAGES.map((p) => p.moduleName).join(", ")}`,
      );
      process.exit(1);
    }
    selected = PAGES.filter(
      (p) => opts.pages.includes(p.moduleName) || opts.pages.includes(p.slug),
    );
  }

  console.log(
    `Mirror mode: pages=[${selected.map((p) => p.moduleName).join(", ")}] assetsOnly=${opts.assetsOnly}`,
  );

  const allPaths = new Set(KNOWN_ASSETS);

  // CSS once
  const cssPath = `${THEME}/static/css/main.css`;
  console.log("Fetching CSS…");
  const cssText = await fetchText(`${ORIGIN}${cssPath}`);
  for (const p of collectFromCss(cssText, cssPath)) allPaths.add(p);

  const pageMetas = {};

  for (const page of selected) {
    const url = `${ORIGIN}${page.path}`;
    console.log(`\nFetching ${page.slug}: ${url}`);
    let html = await fetchText(url);
    html = rewriteHtml(html);
    for (const p of collectFromHtml(html)) allPaths.add(p);
    pageMetas[page.moduleName] = extractBodyMeta(html);

    const snapDir = path.join(ROOT, "scripts/out");
    await fs.mkdir(snapDir, { recursive: true });
    await fs.writeFile(path.join(snapDir, `${page.moduleName}.html`), html, "utf8");
    await fs.writeFile(
      path.join(snapDir, `${page.moduleName}-body.html`),
      pageMetas[page.moduleName].markup,
      "utf8",
    );
  }

  const list = [...allPaths].sort();
  console.log(`\nDownloading ${list.length} assets…`);
  const results = [];
  const queue = [...list];
  async function worker() {
    while (queue.length) {
      const p = queue.shift();
      if (!p) break;
      const dest = path.join(PUBLIC, p.replace(/^\//, ""));
      const r = await download(p, dest);
      results.push(r);
      const status = r.error
        ? `ERR ${r.error}`
        : r.skipped
          ? "skip"
          : `${(r.bytes / 1024).toFixed(1)} KB`;
      console.log(`  ${status.padStart(12)}  ${p}`);
    }
  }
  await Promise.all(Array.from({ length: 8 }, () => worker()));

  // ensure CSS written
  const cssDest = path.join(PUBLIC, cssPath.replace(/^\//, ""));
  await fs.mkdir(path.dirname(cssDest), { recursive: true });
  await fs.writeFile(cssDest, cssText);

  const failed = results.filter((r) => r.error);
  console.log(`\nOK: ${results.length - failed.length}, failed: ${failed.length}`);
  for (const f of failed) console.log(`  ${f.error} ${f.url}`);

  if (opts.assetsOnly) {
    console.log("\n--assets-only: skipping markup rewrite.");
  } else {
    await fs.mkdir(MARKUP_DIR, { recursive: true });
    for (const page of selected) {
      const meta = pageMetas[page.moduleName];
      const outTs = path.join(MARKUP_DIR, `${page.moduleName}.ts`);
      await fs.writeFile(outTs, writeMarkupModule(page.moduleName, meta), "utf8");
      console.log(
        `Wrote ${outTs} (${meta.markup.length} chars, theme=${meta.dataTheme})`,
      );
    }
  }

  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
