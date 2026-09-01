/**
 * Easing curves used by the legacy TweenMax intro (GSAP Quad/Quart easeOut).
 */

/** GSAP Quad.easeOut: t => 1 - (1 - t)^2. */
export function easeOutQuad(t: number): number {
  return 1 - (1 - t) * (1 - t);
}

/** GSAP Cubic.easeOut: t => 1 - (1 - t)^3. */
export function easeOutCubic(t: number): number {
  const v = 1 - t;
  return 1 - v * v * v;
}

/** GSAP Quart.easeOut: t => 1 - (1 - t)^4. */
export function easeOutQuart(t: number): number {
  const v = 1 - t;
  return 1 - v * v * v * v;
}

export type TweenHandle = { cancel: () => void };

/**
 * Minimal RAF tween of `obj.value` from → to (legacy TweenMax.fromTo on a
 * plain `{ value }` holder with onUpdate/onComplete callbacks).
 */
export function tween(
  obj: { value: number },
  durationMs: number,
  from: number,
  to: number,
  ease: (t: number) => number,
  onUpdate: () => void,
  onComplete?: () => void,
): TweenHandle {
  let raf = 0;
  const start = performance.now();
  const step = () => {
    const t = Math.min((performance.now() - start) / durationMs, 1);
    obj.value = from + (to - from) * ease(t);
    onUpdate();
    if (t < 1) {
      raf = requestAnimationFrame(step);
    } else {
      onComplete?.();
    }
  };
  raf = requestAnimationFrame(step);
  return {
    cancel: () => cancelAnimationFrame(raf),
  };
}
