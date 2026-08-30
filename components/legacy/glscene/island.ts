import * as THREE from "three";
import { C } from "./constants";
import { emitter } from "./emitter";
import { IslandMaterial } from "./material";
import type { AssetLoader } from "./loader";

/**
 * The scene model and its material — port of the legacy `modules/island`
 * (legacy bundle module 38), carrying the floating island instead of the island.
 *
 * The island is a single static mesh (no skin weights, no eyes), so one
 * matcap material is used for every mesh. Mesh naming convention
 * (from the original island glTF, see git history): `rock_*` — island body;
 * `tree*`/`leaf*` names are reserved for foliage on future models.
 */

type ModelResource = {
  object: THREE.Group;
  animationMixer: THREE.AnimationMixer | null;
};

/**
 * Blend of the painted basecolor against the matcap shading (FS_MAIN:
 * `matcap * (1 - w*0.075) + diffuse * w`). 0.79 = the legacy island's textured
 * material weight (public/data/scene/*.json MATCAPS[].diffuseWeight) — keeps
 * the sculpted matcap read while the painted rock/foliage colors dominate.
 */
const ISLAND_DIFFUSE_WEIGHT = 0.79;

export class Island extends THREE.Object3D {
  islandMaterial!: IslandMaterial;

  animationMixer: THREE.AnimationMixer | null = null;
  currentMatCapBody = 0;
  matcapProgression = 0;

  constructor() {
    super();
    this.visible = false;
  }

  activate(): void {
    this.visible = true;
  }

  desactivate(): void {
    this.visible = false;
  }

  update(delta: number): void {
    this.animationMixer?.update(delta);
  }

  init(loader: AssetLoader): void {
    const model = loader.getResourceData("island-model") as ModelResource;

    // The island is static geometry (no skin weights), so the matcap shader
    // uses the static vertex suffix. The normal map stays a neutral 1x1
    // texture (matching the legacy island normal map average, so the transition
    // curve behaves identically); there is no specular map, so that weighted
    // term contributes nothing.
    this.islandMaterial = new IslandMaterial(C.JSON_DATA?.MATCAP_PER_ROW ?? 10, false, false);
    const matcaps = loader.getResourceData("matcaps") as THREE.Texture;
    // Both color sources decode to linear before the blend (the legacy mixed
    // gamma-space values; decode+output-encode round-trips the matcap itself
    // ~1:1, so the approved matcap look is unchanged, while the diffuse now
    // competes on equal footing instead of being crushed by the raw atlas).
    matcaps.colorSpace = THREE.SRGBColorSpace;
    this.islandMaterial.uniforms.tMatCap.value = matcaps;
    this.islandMaterial.uniforms.normalMap.value = createNeutralNormalMap();

    // Phase 3: restore the island's painted basecolor (rock + foliage baked
    // into one atlas; the runtime GLB keeps TEXCOORD_0 — extracted to
    // island_diffuse.jpg). Marked sRGB so
    // the GPU decodes it to linear before the matcap/diffuse blend. First ==
    // second weight: the diffuse does not change on case-hover matcap swaps.
    // 0.79 = the legacy textured-material weight (public/data/scene/*.json).
    const islandDiffuse = loader.getResourceData("island-diffuse") as THREE.Texture | null;
    if (islandDiffuse) {
      islandDiffuse.colorSpace = THREE.SRGBColorSpace;
      this.islandMaterial.map = islandDiffuse;
      this.islandMaterial.uniforms.firstDiffuseWeight.value = ISLAND_DIFFUSE_WEIGHT;
      this.islandMaterial.uniforms.secondDiffuseWeight.value = ISLAND_DIFFUSE_WEIGHT;
    }

    model.object.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.material = this.islandMaterial;
      mesh.frustumCulled = false;
    });

    this.animationMixer = model.animationMixer;
    this.add(model.object);
    emitter.onUpdate((delta) => this.update(delta));
  }

  setMatcapProgress(progress: number): void {
    this.islandMaterial.uniforms.matcapTransition.value = progress;
    this.matcapProgression = progress;
  }

  /** `eyes` is kept for API compatibility — the island has no eye meshes. */
  setMatcap(body: number, eyes: number): void {
    void eyes;
    this.setMatcaps(this.currentMatCapBody, body);
  }

  /** The matcap cells drive the matcap term; the diffuse blend stays fixed. */
  setMatcaps(bodyFirst: number, bodySecond: number): void {
    const island = this.islandMaterial.uniforms;
    island.firstMatcapIdx.value = bodyFirst;
    island.secondMatcapIdx.value = bodySecond;
    this.currentMatCapBody = Number.parseInt(String(bodySecond), 10);
  }
}

/** Flat tangent-space normal (128, 128, 255) — no perturbation, any scale. */
function createNeutralNormalMap(): THREE.DataTexture {
  const texture = new THREE.DataTexture(
    new Uint8Array([128, 128, 255, 255]),
    1,
    1,
    THREE.RGBAFormat,
  );
  texture.needsUpdate = true;
  return texture;
}
