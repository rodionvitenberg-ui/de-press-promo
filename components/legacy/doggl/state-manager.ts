import { C, setCurrentState, setDpi } from "./constants";
import { mediator } from "./mediator";
import { World3D } from "./world3d";
import type { MouseInput } from "./types";

/**
 * State manager — port of the legacy `states.js` (dog.js module 47). Owns
 * the world, resolves `load()` and forwards every facade call into it.
 */
export class StateManager {
  private world3D: World3D | null = null;

  load(): Promise<void> {
    return new Promise((resolve) => {
      const world3D = new World3D();
      this.world3D = world3D;
      world3D.load().then(() => {
        world3D.init();
        mediator.resize();
        resolve();
      });
    });
  }

  setState(state: string): void {
    if (state === C.CURRENT_STATE) return;
    setCurrentState(state);
    void this.world3D?.setState();
  }

  setSSAA(value: boolean): void {
    this.world3D?.setSSAA(value);
  }

  setSSAAQuality(quality: number): void {
    this.world3D?.setSSAAQuality(quality);
  }

  setPixelRatio(dpi: number): void {
    setDpi(dpi);
    this.world3D?.setPixelRatio();
  }

  setMouse(mouse: MouseInput): void {
    this.world3D?.setMouse(mouse);
  }

  setAnimationProgress(progress: number, hard?: boolean): void {
    this.world3D?.setAnimationProgress(progress, hard);
  }

  setMatcap(body: number, eyes: number): void {
    this.world3D?.setMatcap(body, eyes);
  }

  setMatcapProgress(progress: number): void {
    this.world3D?.setMatcapProgress(progress);
  }
}
