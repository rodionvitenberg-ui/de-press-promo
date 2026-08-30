import * as THREE from "three";
import { C, setSSAA as applySSAA, setSSAAQuality as applySSAAQuality } from "./constants";
import { emitter } from "./emitter";
import { getStage } from "./stage";
import { AssetLoader, type LoadEntry, type TextureOptions } from "./loader";
import { Island } from "./island";
import { registerIsland } from "./island-registry";
import { StateDispatcher } from "./state-dispatcher";
import { Postprocessing } from "./postprocessing";
import type { MouseInput } from "./types";

/**
 * Scene assembly and render loop — port of the legacy `world3D.js`
 * (legacy bundle module 56). Loads the texture manifest + model, wires the island into
 * the scene and dispatches every frame to the postprocessing pipeline.
 */
export class World3D {
  private island = new Island();
  private loader = new AssetLoader();
  private stateDispatcher: StateDispatcher | null = null;
  private postprocessing: Postprocessing | null = null;

  constructor() {
    registerIsland(this.island);
    emitter.onUpdate((delta) => this.update(delta));
    emitter.onResize((width, height) => this.resize(width, height));
  }

  setState(): Promise<void> {
    this.island.desactivate();
    return new Promise((resolve) => {
      this.stateDispatcher?.setState();
      this.island.activate();
      resolve();
    });
  }

  init(): void {
    const { scene } = getStage();
    scene.add(this.island);
    this.island.init(this.loader);
    this.postprocessing = new Postprocessing();
    this.stateDispatcher = new StateDispatcher();
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
    // (island_diffuse.jpg, see island.ts).
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
    // legacy island pair. Draco/fallback follows the island naming scheme. The
    // island is fitted around the island group origin (X/Y_OFFSET splines then
    // place it per state). Fit box scaled ×1.5 per Phase 3 art direction —
    // the island reads as a ~1/2-of-hero-frame silhouette right of the title.
    const useDraco = C.USE_DRACO && Boolean(C.DRACO_PATH);
    manifest.push({
      id: "island-model",
      type: "gltf",
      url: useDraco ? `${C.MODEL_PATH}island.drc.glb` : `${C.MODEL_PATH}island.glb`,
      options: {
        fit: {
          size: [5.25, 7.5, 6],
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
    this.island.setMatcap(body, eyes);
  }

  setMatcapProgress(progress: number): void {
    this.island.setMatcapProgress(progress);
  }

  setAnimationProgress(progress: number, hard?: boolean): void {
    this.stateDispatcher?.setAnimationProgress(progress, hard);
  }

  setMouse(mouse: MouseInput): void {
    this.stateDispatcher?.setMouse(mouse);
  }

  resize(width: number, height: number): void {
    getStage().renderer.setSize(width, height);
  }
}
