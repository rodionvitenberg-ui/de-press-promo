import { emitter } from "./emitter";
import { C } from "./constants";

/**
 * Frame ticker — port of the legacy `globals/mediator` (dog.js module 30).
 * `main.js` drives one RAF loop and calls `SceneGL.update()` from it; the
 * mediator measures the frame delta and emits `update` / `postupdate`.
 * (The legacy touch/mouse handlers were never bound and are not ported.)
 */
class Mediator {
  private now = Date.now();

  update(): void {
    const now = Date.now();
    const delta = (now - this.now) / 1000;
    this.now = now;
    emitter.emitUpdate(delta);
    emitter.emitPostUpdate(delta);
  }

  resize(): void {
    const container = C.CONTAINER;
    if (!container) return;
    emitter.emitResize(container.offsetWidth, container.offsetHeight);
  }
}

/** Shared mediator (legacy `globals/mediator`). */
export const mediator = new Mediator();
