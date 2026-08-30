import * as THREE from "three";
import { GLTFLoader, type GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

/**
 * Asset loader — port of the legacy `globals/ressources` loader (dog.js
 * module 35) reduced to what the dog manifest actually uses: textures and
 * glTF models (with Draco decoding and a fallback to the uncompressed
 * bundle mesh). Legacy progress plumbing was only used by the removed
 * site loader and is not ported.
 */
export type TextureOptions = {
  anisotropy: number;
  magFilter: THREE.MagnificationTextureFilter;
  minFilter: THREE.MinificationTextureFilter;
  wrapS: THREE.Wrapping;
  wrapT: THREE.Wrapping;
  generateMipmaps: boolean;
  flipY: boolean;
};

export type ModelOptions = {
  /** Legacy placement (dog): fixed scale + offsets in model units. */
  scale?: number;
  offsetX?: number;
  offsetY?: number;
  offsetZ?: number;
  /**
   * Auto-fit placement (island): uniform-scales the model so its largest
   * dimension matches the target volume's, centered on it.
   */
  fit?: { size: [number, number, number]; center: [number, number, number] };
};

export type LoadEntry =
  | {
      id: string;
      type: "texture";
      url: string;
      options: TextureOptions;
      /** Legacy flag for ASTC/PVRTC variants — the port always uses JPEG. */
      compressed?: boolean;
    }
  | { id: string; type: "gltf"; url: string; options: ModelOptions };

type ModelResource = {
  object: THREE.Group;
  animationMixer: THREE.AnimationMixer | null;
};

export class AssetLoader {
  private resources = new Map<string, unknown>();

  getResourceData(id: string): unknown {
    return this.resources.get(id);
  }

  async loadFiles(
    entries: LoadEntry[],
    options: { dracoPath: string; useDraco: boolean },
  ): Promise<void> {
    const textureLoader = new THREE.TextureLoader();

    const gltfLoader = new GLTFLoader();
    let dracoLoader: DRACOLoader | null = null;
    if (options.useDraco && options.dracoPath) {
      dracoLoader = new DRACOLoader();
      // The decoder is served from `/draco/` (three.js r185 decoder set,
      // copied to public/draco/). The legacy `dracoPath` ships a Draco 1.3
      // wrapper exposing only the pre-1.4 `DecodeBufferToMesh` API, which
      // the current DRACOLoader cannot drive (it needs `DecodeArrayTo*`).
      dracoLoader.setDecoderPath("/draco/");
      gltfLoader.setDRACOLoader(dracoLoader);
    }

    try {
      await Promise.all(
        entries.map(async (entry) => {
          if (entry.type === "texture") {
            await this.loadTexture(entry, textureLoader);
          } else {
            await this.loadModel(entry, gltfLoader);
          }
        }),
      );
    } finally {
      // Releases the decoder workers (legacy DRACOLoader.releaseDecoderModule).
      dracoLoader?.dispose();
    }
  }

  private loadTexture(
    entry: Extract<LoadEntry, { type: "texture" }>,
    loader: THREE.TextureLoader,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      loader.load(
        entry.url,
        (texture) => {
          const options = entry.options;
          texture.anisotropy = options.anisotropy;
          texture.magFilter = options.magFilter;
          texture.minFilter = options.minFilter;
          texture.wrapS = options.wrapS;
          texture.wrapT = options.wrapT;
          texture.generateMipmaps = options.generateMipmaps;
          texture.flipY = options.flipY;
          texture.needsUpdate = true;
          this.resources.set(entry.id, texture);
          resolve();
        },
        undefined,
        () => reject(new Error(`Loader: could not load texture: ${entry.url}`)),
      );
    });
  }

  private async loadModel(
    entry: Extract<LoadEntry, { type: "gltf" }>,
    loader: GLTFLoader,
  ): Promise<void> {
    let gltf: GLTF;
    try {
      gltf = await loader.loadAsync(entry.url);
    } catch (error) {
      if (!entry.url.endsWith(".drc.glb")) throw error;
      // Draco decode failed — fall back to the uncompressed bundle mesh.
      console.warn("SceneGL: Draco model failed, falling back to dog.glb", error);
      gltf = await loader.loadAsync(entry.url.replace(/\.drc\.glb$/, ".glb"));
    }

    const object = gltf.scene;
    const options = entry.options;

    let animationMixer: THREE.AnimationMixer | null = null;
    if (gltf.animations && gltf.animations.length) {
      animationMixer = new THREE.AnimationMixer(object);
      for (const clip of gltf.animations) animationMixer.clipAction(clip).play();
    }

    if (options.fit) {
      const bbox = new THREE.Box3().setFromObject(object);
      const size = bbox.getSize(new THREE.Vector3());
      const center = bbox.getCenter(new THREE.Vector3());
      const scale = Math.max(...options.fit.size) / Math.max(size.x, size.y, size.z);
      object.scale.setScalar(scale);
      object.position.set(
        options.fit.center[0] - center.x * scale,
        options.fit.center[1] - center.y * scale,
        options.fit.center[2] - center.z * scale,
      );
    } else {
      const { scale = 1, offsetX = 0, offsetY = 0, offsetZ = 0 } = options;
      object.position.set(offsetX * scale, offsetY * scale, offsetZ * scale);
      object.scale.set(scale, scale, scale);
    }

    const resource: ModelResource = { object, animationMixer };
    this.resources.set(entry.id, resource);
  }
}
