/**
 * Phase 1 — extract SceneGL data (STATES/MATCAPS/MATCAP_PER_ROW) from the webpack
 * bundle into public/data/scene/*.json so camera curves + matcap params become JSON.
 */
import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SOURCES = [
  path.join(ROOT, "public/static/js/main.js"),
];
const OUT_DIR = path.join(ROOT, "public/data/scene");
const MODULES = [
  "desktop",
  "tablet-portrait",
  "tablet-landscape",
  "mobile-portrait",
  "mobile-landscape",
];

function unescapeJsString(s) {
  return s.replace(/\\(u[0-9a-fA-F]{4}|.)/g, (m, esc) => {
    if (esc[0] === "u") return String.fromCharCode(parseInt(esc.slice(1), 16));
    switch (esc) {
      case "n": return "\n";
      case "t": return "\t";
      case "r": return "\r";
      case "b": return "\b";
      case "f": return "\f";
      case "v": return "\v";
      case "0": return "\0";
      default: return esc;
    }
  });
}

function extractModuleCode(bundle, name) {
  const anchor = `//# sourceURL=webpack:///./src/js/scene/data-${name}.js?`;
  const anchorIdx = bundle.indexOf(anchor);
  if (anchorIdx === -1) return null;
  const evalStart = bundle.lastIndexOf('eval(', anchorIdx);
  if (evalStart === -1) return null;
  const quoteStart = bundle.indexOf('"', evalStart);
  if (quoteStart === -1 || quoteStart >= anchorIdx) return null;
  // The sourceURL anchor is the last line inside the eval string, so the
  // closing double-quote always sits directly after it.
  const evalEnd = anchorIdx + anchor.length;
  if (evalEnd <= quoteStart) return null;
  return bundle.slice(quoteStart + 1, evalEnd);
}

function extractDefaultExport(bundle) {
  // Webpack module body: __webpack_exports__[\"default\"] = ({...});
  // The module text is raw (still escaped), so the marker keeps escaped quotes.
  const marker = '[\\"default\\"] = (';
  const startIdx = bundle.indexOf(marker);
  if (startIdx === -1) return null;
  const jsonStart = startIdx + marker.length;
  let depth = 0;
  for (let i = jsonStart; i < bundle.length; i++) {
    if (bundle[i] === "{") depth++;
    else if (bundle[i] === "}") {
      depth--;
      if (depth === 0) {
        const closeParen = bundle.indexOf(")", i);
        const closeSemi = bundle.indexOf(";", i);
        if (
          closeParen === -1 ||
          closeSemi === -1 ||
          closeParen + 1 !== closeSemi
        ) {
          return null;
        }
        return unescapeJsString(bundle.slice(jsonStart, i + 1));
      }
    }
  }
  return null;
}

const STATE_ARRAYS = [
  "CAM_Y",
  "DEPTH",
  "H_ROTATION",
  "V_ROTATION",
  "X_OFFSET",
  "Y_OFFSET",
  "MOUSE_INFLUENCE",
];

/**
 * Structural validation of a scene data module. Guards against silent
 * regressions when the bundle changes (values drift, arrays truncate, …).
 */
function validateSceneData(data) {
  if (typeof data !== "object" || data === null) {
    throw new Error("not an object");
  }
  if (typeof data.MATCAP_PER_ROW !== "number" || data.MATCAP_PER_ROW <= 0) {
    throw new Error(`bad MATCAP_PER_ROW: ${data.MATCAP_PER_ROW}`);
  }
  if (!Array.isArray(data.MATCAPS) || data.MATCAPS.length === 0) {
    throw new Error(`bad MATCAPS: ${Array.isArray(data.MATCAPS) ? "empty" : typeof data.MATCAPS}`);
  }
  for (const m of data.MATCAPS) {
    if (
      typeof m !== "object" ||
      typeof m.normalScale !== "number" ||
      typeof m.diffuseWeight !== "number" ||
      typeof m.specularWeight !== "number"
    ) {
      throw new Error(`bad matcap cell: ${JSON.stringify(m)}`);
    }
  }
  const states = data.STATES;
  if (typeof states !== "object" || states === null) {
    throw new Error(`bad STATES: ${typeof states}`);
  }
  const names = Object.keys(states).sort();
  if (names.length === 0) {
    throw new Error("STATES is empty");
  }
  for (const name of names) {
    const s = states[name];
    if (typeof s !== "object" || s === null) {
      throw new Error(`state ${name}: not an object`);
    }
    const count = s.POSES_COUNT;
    if (typeof count !== "number" || count <= 0) {
      throw new Error(`state ${name}: bad POSES_COUNT ${count}`);
    }
    for (const key of STATE_ARRAYS) {
      const arr = s[key];
      if (!Array.isArray(arr) || arr.length !== count) {
        throw new Error(
          `state ${name}: ${key} length ${Array.isArray(arr) ? arr.length : typeof arr} != POSES_COUNT ${count}`,
        );
      }
      if (arr.some((v) => typeof v !== "number")) {
        throw new Error(`state ${name}: ${key} contains non-number`);
      }
    }
    if (s.KEYPOINTS !== undefined) {
      if (!Array.isArray(s.KEYPOINTS)) {
        throw new Error(`state ${name}: KEYPOINTS not an array`);
      }
      for (const kp of s.KEYPOINTS) {
        if (
          typeof kp !== "object" ||
          typeof kp.value !== "number" ||
          typeof kp.element !== "string"
        ) {
          throw new Error(`state ${name}: bad keypoint ${JSON.stringify(kp)}`);
        }
      }
    }
  }
}

async function main() {
  let bundle = null;
  for (const src of SOURCES) {
    try {
      bundle = await fs.readFile(src, "utf8");
      if (bundle.includes("src/js/scene/data-desktop.js")) break;
      bundle = null;
    } catch {
      /* next source */
    }
  }
  if (!bundle) {
    console.error("Bundle with scene data modules not found.");
    process.exit(1);
  }

  await fs.mkdir(OUT_DIR, { recursive: true });
  const results = [];

  for (const name of MODULES) {
    const code = extractModuleCode(bundle, name);
    if (!code) {
      console.error(`✗ ${name}: module not found`);
      continue;
    }
    const jsonText = extractDefaultExport(code);
    if (!jsonText) {
      console.error(`✗ ${name}: default export not found`);
      continue;
    }
    let parsed;
    try {
      // The module body is a JS object literal, not strict JSON — the tablet and
      // mobile variants use single-quoted string literals. Evaluating it in a
      // throwaway context yields the plain data object.
      parsed = vm.runInNewContext("(" + jsonText + ")");
    } catch (err) {
      console.error(`✗ ${name}: evaluate failed — ${err.message}`);
      continue;
    }

    try {
      validateSceneData(parsed);
    } catch (err) {
      console.error(`✗ ${name}: validation failed — ${err.message}`);
      continue;
    }

    const keys = Object.keys(parsed).sort().join(",");
    if (keys !== ["MATCAP_PER_ROW", "MATCAPS", "STATES"].sort().join(",")) {
      console.error(`✗ ${name}: unexpected keys ${keys}`);
      continue;
    }

    const outFile = path.join(OUT_DIR, `${name}.json`);
    await fs.writeFile(outFile, `${JSON.stringify(parsed, null, 2)}\n`, "utf8");
    results.push(`✓ ${name}: states=${Object.keys(parsed.STATES).join(", ")}`);
  }

  console.log(`\nExtracted ${results.length}/${MODULES.length} → ${OUT_DIR}`);
  for (const line of results) console.log(line);
  if (results.length < MODULES.length) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
