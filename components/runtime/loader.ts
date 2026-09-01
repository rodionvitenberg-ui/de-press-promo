import { easeOutQuad, tween, type TweenHandle } from "./easing";

/**
 * Port of the legacy common loader (views/partials/common/loader.js):
 * `.site-loader` show (`is-visible`, 1.2s) → fake ring percentage (100ms
 * ticks capped at 0.9, dashoffset = (130 − 130·p)·π) driven in parallel with
 * the island load → full-ring tween (1s, Quad.easeOut — the GSAP default
 * Power1 ease) that emits `completed` → hide (`is-hidden`). The Highway
 * `slideIn`/`slideOut` page transitions live in `runtime/transition.ts`
 * (the curtain passes over full page loads).
 */
export type LoaderHandle = {
  /** Resolves when the legacy loader emits `completed` (ring at 100%). */
  completed: Promise<void>;
  destroy(): void;
};

const SHOW_MS = 1200;
const TICK_MS = 100;
const RING_MS = 1000;
const HIDE_MS = 700;

export function initLoader(options: {
  /** Island asset load (`GL.load()`); instant when the scene is disabled. */
  glLoad: Promise<void>;
  /** Legacy `Island.loaded()` — retina SSAA config, runs at 100%. */
  onIslandLoaded: () => void;
  /**
   * Show the ring (`is-visible`) — direct page opens. A curtain-transition
   * enter keeps the ring hidden under the cover (boot passes `false`).
   */
  show?: boolean;
}): LoaderHandle {
  const root = document.querySelector<HTMLElement>(".site-loader");
  const progress =
    root?.querySelector<SVGGeometryElement>(".site-loader-percent") ?? null;

  // Legacy CSS seeded the ring empty; the same initial dashoffset is set
  // inline so the first tween starts from the empty ring even if the
  // stylesheet has not applied yet.
  if (progress && !progress.style.strokeDashoffset) {
    progress.style.strokeDashoffset = String(130 * Math.PI);
  }

  const tweens: TweenHandle[] = [];
  const timers: number[] = [];
  let interval = 0;
  let percentage = 0;
  let destroyed = false;

  /** gsap `TweenMax.to(progress, 1, { strokeDashoffset })` — inline style. */
  const ringTo = (target: number, onComplete?: () => void) => {
    if (!progress) {
      onComplete?.();
      return;
    }
    const from = Number.parseFloat(progress.style.strokeDashoffset) || 0;
    const state = { value: from };
    tweens.push(
      tween(
        state,
        RING_MS,
        from,
        target,
        easeOutQuad,
        () => {
          progress.style.strokeDashoffset = String(state.value);
        },
        onComplete,
      ),
    );
  };

  const completed = (async () => {
    // Show: `is-visible` + the fixed 1.2s intro window (skipped on a curtain
    // transition enter — the transition curtain is the cover there).
    if (options.show !== false) root?.classList.add("is-visible");
    await new Promise((resolve) =>
      timers.push(window.setTimeout(resolve, SHOW_MS)),
    );
    if (destroyed) return;

    // Load: fake ring ticks in parallel with the island assets.
    interval = window.setInterval(() => {
      percentage = Math.min(0.9, percentage + 0.1);
      ringTo((130 - 130 * percentage) * Math.PI);
    }, TICK_MS);
    await options.glLoad;
    if (destroyed) return;

    // Loaded: stop the ticks, run the legacy island retina config, complete
    // the ring and emit `completed`.
    window.clearInterval(interval);
    interval = 0;
    options.onIslandLoaded();
    await new Promise<void>((resolve) => ringTo(0, resolve));

    // Hide (the legacy chain ends here — hide is not awaited).
    root?.classList.add("is-hidden");
    root?.classList.remove("is-visible");
    timers.push(
      window.setTimeout(() => {
        /* hide window elapses */
      }, HIDE_MS),
    );
  })();

  return {
    completed,
    destroy() {
      destroyed = true;
      if (interval) window.clearInterval(interval);
      interval = 0;
      for (const t of tweens) t.cancel();
      tweens.length = 0;
      for (const t of timers) window.clearTimeout(t);
      timers.length = 0;
    },
  };
}
