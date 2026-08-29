/**
 * Event bus of the DogGL runtime — port of the legacy `globals/emitter` +
 * `globals/mediator` pair (dog.js modules 27/30).
 *
 * The frame loop is driven by `main.js`: it calls `DogGL.update()` once per
 * animation frame and the mediator translates that into the `update` /
 * `postupdate` events every subsystem subscribes to. Subscription order is
 * preserved (Set) and mirrors the legacy boot order:
 * camera → world render → dog mixer → camera behaviour.
 */
export class Emitter {
  private updateListeners = new Set<(delta: number) => void>();
  private postUpdateListeners = new Set<(delta: number) => void>();
  private resizeListeners = new Set<(width: number, height: number) => void>();

  onUpdate(listener: (delta: number) => void): void {
    this.updateListeners.add(listener);
  }

  onPostUpdate(listener: (delta: number) => void): void {
    this.postUpdateListeners.add(listener);
  }

  onResize(listener: (width: number, height: number) => void): void {
    this.resizeListeners.add(listener);
  }

  emitUpdate(delta: number): void {
    for (const listener of this.updateListeners) listener(delta);
  }

  emitPostUpdate(delta: number): void {
    for (const listener of this.postUpdateListeners) listener(delta);
  }

  emitResize(width: number, height: number): void {
    for (const listener of this.resizeListeners) listener(width, height);
  }
}

/** Shared runtime bus (legacy `globals/emitter`). */
export const emitter = new Emitter();
