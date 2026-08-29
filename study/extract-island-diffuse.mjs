/**
 * One-off extraction of the island's painted basecolor texture from the
 * source GLB into the runtime image folder (mirrors the legacy
 * `branches_diffuse.jpg` manifest convention). The runtime island.glb keeps
 * TEXCOORD_0, so the texture is bound directly in DogMaterial (see
 * components/legacy/doggl/dog.ts).
 *
 * Usage: node study/extract-island-diffuse.mjs
 */
import { NodeIO } from "@gltf-transform/core";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = path.dirname(new URL(import.meta.url, "file://").pathname);
const SRC = path.join(ROOT, "floating island 3d model_Clone1.glb");
const OUT_DIR = path.join(
  ROOT,
  "..",
  "public/app/themes/portfolio-2018/static/assets/dog/images/dog/final",
);

const io = new NodeIO();
const doc = await io.read(SRC);
const textures = doc.getRoot().listTextures();
const base = textures.find((t) => (t.getName() ?? "").includes("basecolor"));
if (!base) throw new Error("basecolor texture not found");

const image = base.getImage();
if (!image) throw new Error("texture has no image data");

mkdirSync(OUT_DIR, { recursive: true });
const out = path.join(OUT_DIR, "island_diffuse.jpg");
writeFileSync(out, image);
console.log("written:", out, image.byteLength, "bytes");
