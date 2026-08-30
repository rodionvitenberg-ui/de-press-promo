import type { DogDataJson } from "../DogstudioPage";

/**
 * Options payload `main.js` passes to `new window.SceneGL({ ... })`
 * (see the decoded `src/js/dog/index.js` controller).
 */
export type SceneGLOptions = {
  data: DogDataJson;
  reduced: boolean;
  container: HTMLElement;
  imagePath: string;
  dracoPath: string;
  modelPath: string;
  assetPath?: string;
};

/**
 * WebAssembly probe shipped with the legacy bundle (`utils/testwasm.js`,
 * dog.js module 54): a tiny module with a `test` export must instantiate
 * and execute. Decides whether the Draco-compressed model is used.
 */
const WASM_PROBE_BYTES = new Uint8Array([
  0, 97, 115, 109, 1, 0, 0, 0, 1, 6, 1, 96, 1, 127, 1, 127, 3, 2, 1, 0, 5, 3,
  1, 0, 1, 7, 8, 1, 4, 116, 101, 115, 116, 0, 0, 10, 16, 1, 14, 0, 32, 0, 65,
  1, 54, 2, 0, 32, 0, 40, 2, 0, 11,
]);

function supportsWasm(): boolean {
  try {
    const wasmModule = new WebAssembly.Module(WASM_PROBE_BYTES);
    const instance = new WebAssembly.Instance(wasmModule, {});
    const test = (
      instance.exports as { test?: (value: number) => number }
    ).test;
    return test !== undefined && test(4) !== 0;
  } catch {
    return false;
  }
}

/**
 * Module-level runtime state — port of the legacy `constants.js` (dog.js
 * module 26), which used mutable ES-module exports. The same values live on
 * this object; `setData` plays the role of the legacy `SET_DATA`.
 */
export const C = {
  DPI: typeof window === "undefined" ? 1 : Math.min(window.devicePixelRatio, 2),
  SSAA: true,
  SSAA_QUALITY: 2,
  USE_DRACO: supportsWasm(),
  DATA: null as SceneGLOptions | null,
  JSON_DATA: null as DogDataJson | null,
  /** Identity map of the state names declared in `data.STATES`. */
  APP_STATES: {} as Record<string, string>,
  ASSET_PATH: "",
  IMAGE_PATH: "",
  DRACO_PATH: "",
  MODEL_PATH: "",
  CONTAINER: null as HTMLElement | null,
  CURRENT_STATE: null as string | null,
  PREVIOUS_STATE: null as string | null,
};

export function setData(options: SceneGLOptions): void {
  C.DATA = options;
  C.CONTAINER = options.container;
  C.ASSET_PATH = options.assetPath ?? "";
  C.IMAGE_PATH = options.imagePath;
  C.DRACO_PATH = options.dracoPath;
  C.MODEL_PATH = options.modelPath;
  C.JSON_DATA = options.data;
  C.APP_STATES = {};
  for (const name of Object.keys(options.data.STATES)) {
    C.APP_STATES[name] = name;
  }
}

export function getContainer(): HTMLElement | null {
  return C.CONTAINER;
}

export function setCurrentState(state: string): void {
  C.PREVIOUS_STATE = C.CURRENT_STATE;
  C.CURRENT_STATE = state;
}

export function setDpi(dpi: number): void {
  C.DPI = dpi;
}

export function setSSAA(value: boolean): void {
  C.SSAA = value;
}

export function setSSAAQuality(quality: number): void {
  C.SSAA_QUALITY = quality;
}
