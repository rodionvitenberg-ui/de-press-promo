/**
 * Spline interpolators used by the camera behaviour — verbatim ports of the
 * legacy `utils/custom-cubic-spline` (legacy bundle module 49) and
 * `utils/monotone-cubic-spline` (legacy bundle module 52). The camera curves are
 * built from the 7 pose arrays of each state (CAM_Y, DEPTH, V_ROTATION,
 * H_ROTATION, X_OFFSET, Y_OFFSET, MOUSE_INFLUENCE).
 */

export type Spline = (x: number) => number;

/**
 * Custom cubic spline: solves for the second derivatives of an interpolating
 * cubic with the legacy boundary conditions, then evaluates per segment.
 * Used for the DEPTH curve.
 */
export function customCubicSpline(xs: number[], ys: number[]): Spline {
  const points = xs.length;
  if (points === 0) return () => 0;
  if (points === 1) {
    const value = ys[0];
    return () => value;
  }

  const rows = points; // unknowns: second derivative per point
  const rhsColumn = rows; // augmented-matrix column index of the RHS
  // Augmented matrix (rows x (rows + 1)).
  const a: number[][] = Array.from({ length: rows }, () =>
    new Array<number>(rows + 1).fill(0),
  );

  for (let i = 1; i < rows - 1; i++) {
    const hPrev = xs[i] - xs[i - 1];
    const hNext = xs[i + 1] - xs[i];
    a[i][i - 1] = 1 / hPrev;
    a[i][i] = 2 * (1 / hPrev + 1 / hNext);
    a[i][i + 1] = 1 / hNext;
    a[i][rhsColumn] =
      3 *
      ((ys[i] - ys[i - 1]) / (hPrev * hPrev) +
        (ys[i + 1] - ys[i]) / (hNext * hNext));
  }
  a[0][0] = 2 / (xs[1] - xs[0]);
  a[0][1] = 1 / (xs[1] - xs[0]);
  a[0][rhsColumn] = (3 * (ys[1] - ys[0])) / ((xs[1] - xs[0]) * (xs[1] - xs[0]));
  const last = rows - 1;
  const hLast = xs[last] - xs[last - 1];
  a[last][last - 1] = 1 / hLast;
  a[last][last] = 2 / hLast;
  a[last][rhsColumn] = (3 * (ys[last] - ys[last - 1])) / (hLast * hLast);

  // Gaussian elimination with partial pivoting (in place, as in the legacy).
  for (let col = 0; col < rows; col++) {
    let pivotRow = col;
    let pivotValue = Number.NEGATIVE_INFINITY;
    for (let row = col; row < rows; row++) {
      if (a[row][col] > pivotValue) {
        pivotRow = row;
        pivotValue = a[row][col];
      }
    }
    const tmp = a[col];
    a[col] = a[pivotRow];
    a[pivotRow] = tmp;
    for (let row = col + 1; row < rows; row++) {
      for (let k = col + 1; k <= rhsColumn; k++) {
        a[row][k] -= a[col][k] * (a[row][col] / a[col][col]);
      }
      a[row][col] = 0;
    }
  }

  const secondDerivatives = new Array<number>(rows).fill(0);
  for (let row = rows - 1; row >= 0; row--) {
    const value = a[row][rhsColumn] / a[row][row];
    secondDerivatives[row] = value;
    for (let p = row - 1; p >= 0; p--) {
      a[p][rhsColumn] -= a[p][row] * value;
      a[p][row] = 0;
    }
  }

  return (x: number) => {
    // Clamp into the knot range (the caller clamps progress to 0..1; this
    // only guards against floating-point overshoot producing NaN).
    const t = Math.min(Math.max(x, xs[0]), xs[last]);
    let r = 1;
    while (r < last && xs[r] < t) r++;
    const h = xs[r] - xs[r - 1];
    const p = (t - xs[r - 1]) / h;
    const o = secondDerivatives[r - 1] * h - (ys[r] - ys[r - 1]);
    const s = -secondDerivatives[r] * h + (ys[r] - ys[r - 1]);
    return (
      (1 - p) * ys[r - 1] +
      p * ys[r] +
      p * (1 - p) * (o * (1 - p) + s * p)
    );
  };
}

/**
 * Monotone cubic (Fritsch–Carlson) spline — used for CAM_Y, V_ROTATION,
 * H_ROTATION, X_OFFSET, Y_OFFSET and MOUSE_INFLUENCE.
 */
export function monotoneCubicSpline(xs: number[], ys: number[]): Spline {
  const n = xs.length;
  if (n === 0) return () => 0;
  if (n === 1) {
    const value = +ys[0];
    return () => value;
  }

  // Sort points by x.
  const order = xs.map((_, index) => index);
  order.sort((a, b) => (xs[a] < xs[b] ? -1 : 1));
  const t: number[] = [];
  const y: number[] = [];
  for (let i = 0; i < n; i++) {
    t.push(+xs[order[i]]);
    y.push(+ys[order[i]]);
  }

  const dys: number[] = [];
  const dxs: number[] = [];
  const ms: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    const dx = t[i + 1] - t[i];
    const dy = y[i + 1] - y[i];
    dxs.push(dx);
    dys.push(dy);
    ms.push(dy / dx);
  }

  // First-derivative estimates per knot.
  const c1s = [ms[0]];
  for (let i = 0; i < dxs.length - 1; i++) {
    const m = ms[i];
    const mNext = ms[i + 1];
    if (m * mNext <= 0) {
      c1s.push(0);
    } else {
      const dx = dxs[i];
      const dxNext = dxs[i + 1];
      const common = dx + dxNext;
      c1s.push(
        (3 * common) / ((common + dxNext) / m + (common + dx) / mNext),
      );
    }
  }
  c1s.push(ms[ms.length - 1]);

  // Quadratic/cubic coefficients per segment.
  const c2s: number[] = [];
  const c3s: number[] = [];
  for (let i = 0; i < c1s.length - 1; i++) {
    const c1 = c1s[i];
    const m = ms[i];
    const invDx = 1 / dxs[i];
    const common = c1 + c1s[i + 1] - m - m;
    c2s.push((m - c1 - common) * invDx);
    c3s.push(common * invDx * invDx);
  }

  return (x: number) => {
    const last = t.length - 1;
    if (x === t[last]) return y[last];
    // Binary search for the segment.
    let low = 0;
    let high = c3s.length - 1;
    let mid = 0;
    while (low <= high) {
      mid = Math.floor(0.5 * (low + high));
      const value = t[mid];
      if (value < x) low = mid + 1;
      else if (value > x) high = mid - 1;
      else return y[mid];
    }
    const i = Math.max(0, high);
    const diff = x - t[i];
    const diffSq = diff * diff;
    return y[i] + c1s[i] * diff + c2s[i] * diffSq + c3s[i] * diff * diffSq;
  };
}
