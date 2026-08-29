import * as THREE from "three";
import { C } from "./constants";
import { emitter } from "./emitter";
import { DogMaterial } from "./dog-material";
import type { AssetLoader } from "./loader";

/**
 * The scene model and its material — port of the legacy `modules/dog`
 * (dog.js module 38), carrying the floating island instead of the dog.
 *
 * The island is a single static mesh (no skin weights, no eyes), so one
 * matcap material is used for every mesh. Mesh naming convention
 * (study/convert-island.mjs): `rock_*` — island body; `tree*`/`leaf*` names
 * are reserved for foliage on future models.
 */

type ModelResource = {
  object: THREE.Group;
  animationMixer: THREE.AnimationMixer | null;
};

export class Dog extends THREE.Object3D {
  dogMaterial!: DogMaterial;

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
    const model = loader.getResourceData("dog-model") as ModelResource;

    // The island is static geometry (no skin weights), so the matcap shader
    // uses the static vertex suffix. Detail maps are not bound: the normal
    // map is a neutral 1x1 texture (matching the legacy dog normal map
    // average, so the transition curve behaves identically); with no
    // diffuse/specular maps their weighted terms contribute nothing.
    this.dogMaterial = new DogMaterial(C.JSON_DATA?.MATCAP_PER_ROW ?? 10, false, false);
    this.dogMaterial.uniforms.tMatCap.value = loader.getResourceData("matcaps") as THREE.Texture;
    this.dogMaterial.uniforms.normalMap.value = createNeutralNormalMap();

    model.object.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.material = this.dogMaterial;
      mesh.frustumCulled = false;
    });

    this.animationMixer = model.animationMixer;
    this.add(model.object);
    emitter.onUpdate((delta) => this.update(delta));
  }

  setMatcapProgress(progress: number): void {
    this.dogMaterial.uniforms.matcapTransition.value = progress;
    this.matcapProgression = progress;
  }

  /** `eyes` is kept for API compatibility — the island has no eye meshes. */
  setMatcap(body: number, eyes: number): void {
    void eyes;
    this.setMatcaps(this.currentMatCapBody, body);
  }

  /** With detail maps unbound, only the matcap indices drive the output. */
  setMatcaps(bodyFirst: number, bodySecond: number): void {
    const dog = this.dogMaterial.uniforms;
    dog.firstMatcapIdx.value = bodyFirst;
    dog.secondMatcapIdx.value = bodySecond;
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
