import * as THREE from "three";
import { C, setSSAA as applySSAA, setSSAAQuality as applySSAAQuality } from "./constants";
import { emitter } from "./emitter";
import { getStage } from "./stage";
import { AssetLoader, type LoadEntry, type TextureOptions } from "./loader";
import { Dog } from "./dog";
import { registerDog } from "./dog-registry";
import { DogState } from "./dog-state";
import { Postprocessing } from "./postprocessing";
import type { MouseInput } from "./types";

/**
 * Scene assembly and render loop — port of the legacy `world3D.js`
 * (dog.js module 56). Loads the texture manifest + model, wires the dog into
 * the scene and dispatches every frame to the postprocessing pipeline.
 */
export class World3D {
  private dog = new Dog();
  private loader = new AssetLoader();
  private dogState: DogState | null = null;
  private postprocessing: Postprocessing | null = null;

  constructor() {
    registerDog(this.dog);
    emitter.onUpdate((delta) => this.update(delta));
    emitter.onResize((width, height) => this.resize(width, height));
  }

  setState(): Promise<void> {
    this.dog.desactivate();
    return new Promise((resolve) => {
      this.dogState?.setState();
      this.dog.activate();
      resolve();
    });
  }

  init(): void {
    const { scene } = getStage();
    scene.add(this.dog);
    this.dog.init(this.loader);
    this.postprocessing = new Postprocessing();
    this.dogState = new DogState();
  }

  load(): Promise<void> {
    const { renderer } = getStage();
    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();

    const matcapAtlas: TextureOptions = {
      anisotropy: Math.min(2, maxAnisotropy),
      magFilter: THREE.LinearFilter,
      minFilter: THREE.LinearFilter,
      wrapS: THREE.MirroredRepeatWrapping,
      wrapT: THREE.MirroredRepeatWrapping,
      generateMipmaps: false,
      flipY: true,
    };

    const imagePath = C.IMAGE_PATH;
    // The legacy manifest also carried per-part detail maps (normals,
    // diffuse, specular) and swapped in ASTC/PVRTC variants when available.
    // The island needs only the matcap atlas plus its own painted basecolor
    // (extracted by study/extract-island-diffuse.mjs, see dog.ts).
    const islandDiffuse: TextureOptions = {
      anisotropy: Math.min(4, maxAnisotropy),
      magFilter: THREE.LinearFilter,
      minFilter: THREE.LinearMipmapLinearFilter,
      wrapS: THREE.ClampToEdgeWrapping,
      wrapT: THREE.ClampToEdgeWrapping,
      generateMipmaps: true,
      // glTF UV convention (v=0 at the top) — do not flip the image.
      flipY: false,
    };
    const manifest: LoadEntry[] = [
      {
        id: "matcaps",
        type: "texture",
        url: `${imagePath}matcap-combined-resized.jpg`,
        options: matcapAtlas,
      },
      {
        id: "island-diffuse",
        type: "texture",
        url: `${imagePath}island_diffuse.jpg`,
        options: islandDiffuse,
      },
    ];

    // The runtime model is the floating island (Phase 3), replacing the
    // legacy dog pair. Draco/fallback follows the dog naming scheme. The
    // island is fitted around the dog group origin (X/Y_OFFSET splines then
    // place it per state) and sized to ~1/3 of the hero frame — the legacy
    // dog volume (max dim 0.28 at scale 20) reads as a ~15px speck from the
    // hero camera distance (~14 units), see study/convert-island.mjs.
    const useDraco = C.USE_DRACO && Boolean(C.DRACO_PATH);
    manifest.push({
      id: "dog-model",
      type: "gltf",
      url: useDraco ? `${C.MODEL_PATH}island.drc.glb` : `${C.MODEL_PATH}island.glb`,
      options: {
        fit: {
          size: [3.5, 5, 4],
          center: [0, 0, 0],
        },
      },
    });

    return this.loader.loadFiles(manifest, {
      dracoPath: C.DRACO_PATH,
      useDraco,
    });
  }

  update(delta: number): void {
    void delta;
    if (this.postprocessing && C.DPI < 2) {
      this.postprocessing.render();
    } else {
      const { renderer, scene, camera } = getStage();
      renderer.render(scene, camera);
    }
  }

  setPixelRatio(): void {
    getStage().renderer.setPixelRatio(C.DPI);
  }

  setSSAA(value: boolean): void {
    applySSAA(value);
  }

  setSSAAQuality(quality: number): void {
    applySSAAQuality(quality);
  }

  setMatcap(body: number, eyes: number): void {
    this.dog.setMatcap(body, eyes);
  }

  setMatcapProgress(progress: number): void {
    this.dog.setMatcapProgress(progress);
  }

  setAnimationProgress(progress: number, hard?: boolean): void {
    this.dogState?.setAnimationProgress(progress, hard);
  }

  setMouse(mouse: MouseInput): void {
    this.dogState?.setMouse(mouse);
  }

  resize(width: number, height: number): void {
    getStage().renderer.setSize(width, height);
  }
}
