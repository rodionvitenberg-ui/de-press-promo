/** Legacy `utils/lerp` — linear interpolation. */
export function lerp(a: number, b: number, amount: number): number {
  return a + (b - a) * amount;
}
