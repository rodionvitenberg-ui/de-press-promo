import { C } from "./constants";
import { emitter } from "./emitter";
import { StatesBehaviour } from "./behaviour";
import { getIsland } from "./island-registry";
import type { MouseInput } from "./types";

/**
 * State dispatcher — port of the legacy `modules/state` (legacy bundle module
 * 40). Rebuilds the active camera behaviour whenever the current state
 * changes and forwards progress/mouse/frame events to it.
 */
export class StateDispatcher {
  private currentBehaviour: StatesBehaviour | null = null;

  constructor() {
    emitter.onUpdate((delta) => this.update(delta));
  }

  setState(): void {
    if (this.currentBehaviour) this.currentBehaviour.desactivate();
    this.currentBehaviour = null;
    this.currentBehaviour = new StatesBehaviour(C.CURRENT_STATE as string, getIsland());
    this.currentBehaviour.activate();
  }

  setAnimationProgress(progress: number, hard?: boolean): void {
    this.currentBehaviour?.setAnimationProgress(progress, hard);
  }

  setMouse(mouse: MouseInput): void {
    this.currentBehaviour?.setMouse(mouse);
  }

  update(delta: number): void {
    // The behaviour reads mouse/progress state directly; the frame delta is
    // unused by it in the legacy bundle as well.
    void delta;
    this.currentBehaviour?.update();
  }
}
