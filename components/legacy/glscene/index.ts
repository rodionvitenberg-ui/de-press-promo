import { setData, type SceneGLOptions } from "./constants";
import { mediator } from "./mediator";
import { createStage } from "./stage";
import { StateManager } from "./state-manager";
import type { MouseInput } from "./types";

export { setSSAA, setSSAAQuality } from "./constants";
export { mediator } from "./mediator";
export { IslandMaterial, type IslandUniforms } from "./material";
export type { SceneGLOptions } from "./constants";

/**
 * Public SceneGL facade — 1:1 port of the legacy `window.SceneGL` class (legacy bundle
 * module 57). `main.js` instantiates it with
 * `{ data, reduced, container, imagePath, dracoPath, modelPath }` and drives
 * every subsequent call from its own RAF loop:
 *
 *   update, resize, load, setState, setMatcap, setMatcapProgress,
 *   setAnimationProgress, setMouse, setSSAA, setSSAAQuality, setPixelRatio
 */
export class SceneGL {
  private stateManager: StateManager;

  constructor(options: SceneGLOptions) {
    setData(options);
    // The legacy bundle created the renderer at import time against the
    // container resolved here (module 31 + SET_DATA ordering).
    createStage(options.container);
    this.stateManager = new StateManager();
  }

  load(): Promise<void> {
    return this.stateManager.load();
  }

  update(): void {
    mediator.update();
  }

  resize(): void {
    mediator.resize();
  }

  setState(state: string): void {
    this.stateManager.setState(state);
  }

  setMatcap(body: number, eyes: number): void {
    this.stateManager.setMatcap(body, eyes);
  }

  setMatcapProgress(progress: number): void {
    this.stateManager.setMatcapProgress(progress);
  }

  setAnimationProgress(progress: number, hard?: boolean): void {
    this.stateManager.setAnimationProgress(progress, hard);
  }

  setMouse(mouse: MouseInput): void {
    this.stateManager.setMouse(mouse);
  }

  setSSAA(value: boolean): void {
    this.stateManager.setSSAA(value);
  }

  setSSAAQuality(quality: number): void {
    this.stateManager.setSSAAQuality(quality);
  }

  setPixelRatio(dpi: number = 1): void {
    this.stateManager.setPixelRatio(dpi);
    this.resize();
  }
}

/**
 * Registers the module as `window.SceneGL`, replacing the legacy legacy bundle
 * bundle. Called by `BootPage.tsx` before `main.js` boots.
 */
export function installSceneGL(): void {
  if (typeof window === "undefined") return;
  (window as unknown as { SceneGL?: unknown }).SceneGL = SceneGL;
}
