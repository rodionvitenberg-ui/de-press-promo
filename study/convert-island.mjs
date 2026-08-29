/**
 * One-off conversion of the source island model into the runtime asset:
 *  - strips materials/textures (the matcap pipeline replaces them),
 *  - renames mesh nodes to the `rock_*` convention used by the GL module,
 *  - prints world-space bboxes for both the legacy dog (auto-fit target,
 *    scale 20 + offset (0.2, -0.5, 0.15) applied) and the stripped island.
 *
 * Usage: node study/convert-island.mjs
 * Follow-up steps (gltf-transform CLI): weld → simplify → compress (Draco).
 */
import { NodeIO } from "@gltf-transform/core";
import path from "node:path";

// Minimal mat4 (column-major) helpers — enough for bbox transforms, keeps the
// script dependency-free beyond @gltf-transform/core.
function mul(out, a, b) {
  const r = new Array(16).fill(0);
  for (let c = 0; c < 4; c++)
    for (let rw = 0; rw < 4; rw++)
      for (let k = 0; k < 4; k++) r[c * 4 + rw] += a[k * 4 + rw] * b[c * 4 + k];
  for (let i = 0; i < 16; i++) out[i] = r[i];
  return out;
}
function transformPoint(m, v) {
  return [
    m[0] * v[0] + m[4] * v[1] + m[8] * v[2] + m[12],
    m[1] * v[0] + m[5] * v[1] + m[9] * v[2] + m[13],
    m[2] * v[0] + m[6] * v[1] + m[10] * v[2] + m[14],
  ];
}


const ROOT = path.dirname(new URL(import.meta.url, "file://").pathname);
const PROJECT = path.resolve(ROOT, "..");
const ISLAND_SRC = path.join(ROOT, "floating island 3d model_Clone1.glb");
const ISLAND_OUT = path.join(ROOT, "island.stripped.glb");
const DOG_GLB = path.join(
  PROJECT,
  "public/app/themes/portfolio-2018/static/assets/dog/models/dog.glb",
);
const DOG_MODEL_OPTIONS = { scale: 20, offsetX: 0.2, offsetY: -0.5, offsetZ: 0.15 };

const io = new NodeIO();

/** World-space bbox of a document, applying node transforms to POSITION min/max. */
async function sceneBBox(file) {
  const doc = await io.read(file);
  const min = [Infinity, Infinity, Infinity];
  const max = [-Infinity, -Infinity, -Infinity];

  const visit = (node, parentMatrix) => {
    const matrix = mul(new Array(16).fill(0), parentMatrix, node.getWorldMatrix());

    const mesh = node.getMesh();
    if (mesh) {
      for (const prim of mesh.listPrimitives()) {
        const pos = prim.getAttribute("POSITION");
        if (!pos) continue;
        const lo = [Infinity, Infinity, Infinity];
        const hi = [-Infinity, -Infinity, -Infinity];
        const arr = pos.getArray();
        const stride = pos.getElementSize();
        for (let i = 0; i < pos.getCount(); i++) {
          for (let a = 0; a < 3; a++) {
            const v = arr[i * stride + a];
            lo[a] = Math.min(lo[a], v);
            hi[a] = Math.max(hi[a], v);
          }
        }
        const corners = [
          [lo[0], lo[1], lo[2]], [hi[0], lo[1], lo[2]],
          [lo[0], hi[1], lo[2]], [hi[0], hi[1], lo[2]],
          [lo[0], lo[1], hi[2]], [hi[0], lo[1], hi[2]],
          [lo[0], hi[1], hi[2]], [hi[0], hi[1], hi[2]],
        ];
        for (const c of corners) {
          const w = transformPoint(matrix, c);
          for (let a = 0; a < 3; a++) {
            min[a] = Math.min(min[a], w[a]);
            max[a] = Math.max(max[a], w[a]);
          }
        }
      }
    }
    for (const child of node.listChildren()) visit(child, matrix);
  };

  for (const scene of doc.getRoot().listScenes()) {
    for (const node of scene.listChildren()) visit(node, [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]);
  }
  return { doc, min, max };
}

function report(label, min, max, transform) {
  const lo = [...min];
  const hi = [...max];
  if (transform) {
    const { scale, offset } = transform;
    for (let a = 0; a < 3; a++) {
      lo[a] = lo[a] * scale + offset[a] * scale;
      hi[a] = hi[a] * scale + offset[a] * scale;
    }
  }
  const size = hi.map((v, a) => v - lo[a]);
  const center = size.map((s, a) => lo[a] + s / 2);
  console.log(label, {
    min: lo.map((v) => +v.toFixed(3)),
    max: hi.map((v) => +v.toFixed(3)),
    size: size.map((v) => +v.toFixed(3)),
    center: center.map((v) => +v.toFixed(3)),
  });
  return { size, center };
}

// 1. Dog bbox in world space (the auto-fit target volume).
const dog = await sceneBBox(DOG_GLB);
const fit = report(
  "dog world bbox:",
  dog.min,
  dog.max,
  { scale: DOG_MODEL_OPTIONS.scale, offset: [DOG_MODEL_OPTIONS.offsetX, DOG_MODEL_OPTIONS.offsetY, DOG_MODEL_OPTIONS.offsetZ] },
);
console.log(
  "FIT = { size: [%s, %s, %s], center: [%s, %s, %s] }",
  ...fit.size.map((v) => Math.ceil(v * 100) / 100),
  ...fit.center.map((v) => Math.ceil(v * 100) / 100),
);

// 2. Island: strip materials/textures, rename nodes, report raw bbox.
const island = await sceneBBox(ISLAND_SRC);
report("island raw bbox:", island.min, island.max);

const root = island.doc.getRoot();
for (const material of root.listMaterials()) material.dispose();
for (const texture of root.listTextures()) texture.dispose();
let renamed = 0;
for (const scene of root.listScenes()) {
  const visit = (node) => {
    if (node.getMesh()) node.setName(`rock_island${renamed ? "_" + renamed : ""}`), renamed++;
    for (const child of node.listChildren()) visit(child);
  };
  for (const node of scene.listChildren()) visit(node);
}
console.log("mesh nodes renamed:", renamed);
await io.write(ISLAND_OUT, island.doc);
console.log("written:", ISLAND_OUT);
