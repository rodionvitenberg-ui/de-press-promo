// Generates home hero background art proposals in the de-press palette.
// Per-pixel renderer: gaussian light blobs over a dark base with an edge
// vignette and ±1 dithering (no banding), same "aurora" technique as the
// current dogstudio art. Output sizes match the current assets 1:1, so the
// <picture> markup and CSS stay untouched.
//
// Usage: node study/generate-home-background.mjs
// Output: study/background-proposals/<variant>/background-{xxs,m,l,xl}.png
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(ROOT, 'background-proposals');

// Sizes copied from the current home background assets
const SIZES = [
  ['xxs', 450, 360],
  ['m', 815, 652],
  ['l', 1015, 812],
  ['xl', 1440, 1152],
];

// Blob positions and falloff sigmas (s) are normalized to canvas dimensions.
// Grain is not baked in: the site already overlays noise.png on top.
const VARIANTS = {
  // «Гавань» — глубокий морской, спокойный
  gavan: {
    base: '#0a0f15',
    edge: '#030509',
    vig: { cx: 0.42, cy: 0.28, rx: 0.78, ry: 0.88, k: 0.85 },
    blobs: [
      { cx: 0.74, cy: 0.16, s: 0.3, fill: '#17454e', a: 0.7 },
      { cx: 0.76, cy: 0.1, s: 0.16, fill: '#3a9494', a: 0.8 },
      { cx: 0.87, cy: 0.06, s: 0.05, fill: '#8fe0da', a: 0.25 },
      { cx: 0.16, cy: 0.14, s: 0.34, fill: '#10283c', a: 0.8 },
      { cx: 0.06, cy: 0.44, s: 0.28, fill: '#0f3340', a: 0.6 },
    ],
  },
  // «Сумерки» — холодный сине-фиолетовый, родня текущей, но своя
  sumerki: {
    base: '#0c0e17',
    edge: '#050609',
    vig: { cx: 0.42, cy: 0.28, rx: 0.78, ry: 0.88, k: 0.85 },
    blobs: [
      { cx: 0.18, cy: 0.12, s: 0.32, fill: '#2b3170', a: 0.8 },
      { cx: 0.14, cy: 0.1, s: 0.14, fill: '#4a3a8c', a: 0.7 },
      { cx: 0.3, cy: 0.16, s: 0.05, fill: '#9a8cc9', a: 0.3 },
      { cx: 0.74, cy: 0.18, s: 0.28, fill: '#14414e', a: 0.7 },
      { cx: 0.46, cy: 0.34, s: 0.22, fill: '#5c2a52', a: 0.45 },
    ],
  },
  // «Рассвет в лесу» — тусклые глухие зелёные, ночной ранний рассвет
  les: {
    base: '#0a0f0c',
    edge: '#040704',
    vig: { cx: 0.42, cy: 0.28, rx: 0.78, ry: 0.88, k: 0.85 },
    blobs: [
      { cx: 0.72, cy: 0.2, s: 0.3, fill: '#2e4436', a: 0.55 },
      { cx: 0.8, cy: 0.1, s: 0.14, fill: '#55705a', a: 0.6 },
      { cx: 0.84, cy: 0.07, s: 0.05, fill: '#9db8a0', a: 0.2 },
      { cx: 0.16, cy: 0.14, s: 0.34, fill: '#12241a', a: 0.75 },
      { cx: 0.06, cy: 0.46, s: 0.26, fill: '#0e2016', a: 0.5 },
    ],
  },
  // «Красный штиль» — тьма с глухим тёплым свечением (в акцентный красный)
  shtil: {
    base: '#0d0e12',
    edge: '#07070a',
    vig: { cx: 0.42, cy: 0.28, rx: 0.78, ry: 0.88, k: 0.85 },
    blobs: [
      { cx: 0.76, cy: 0.16, s: 0.3, fill: '#46202a', a: 0.7 },
      { cx: 0.75, cy: 0.13, s: 0.16, fill: '#8a3838', a: 0.75 },
      { cx: 0.81, cy: 0.07, s: 0.05, fill: '#e43333', a: 0.35 },
      { cx: 0.15, cy: 0.14, s: 0.34, fill: '#1b2632', a: 0.75 },
    ],
  },
};

const hexToRgb = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

const smoothstep = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

// Per-pixel renderer: gaussian blobs over a base color, edge vignette,
// plus ±1 dithering so 8-bit PNG gradients do not band.
function renderVariant(variant, W, H) {
  const base = hexToRgb(variant.base);
  const edge = hexToRgb(variant.edge);
  const blobs = variant.blobs.map((b) => ({ ...b, rgb: hexToRgb(b.fill) }));
  const { cx, cy, rx, ry, k } = variant.vig;
  const data = Buffer.alloc(W * H * 4);
  let seed = 0x2545f491;
  const rand = () => {
    seed ^= seed << 13;
    seed ^= seed >>> 17;
    seed ^= seed << 5;
    return ((seed >>> 0) / 4294967295) * 2 - 1;
  };
  let idx = 0;
  for (let y = 0; y < H; y++) {
    const ny = y / H;
    for (let x = 0; x < W; x++) {
      const nx = x / W;
      let r = base[0];
      let g = base[1];
      let b = base[2];
      for (const bl of blobs) {
        const dx = (nx - bl.cx) / bl.s;
        const dy = (ny - bl.cy) / bl.s;
        const w = bl.a * Math.exp(-0.5 * (dx * dx + dy * dy));
        if (w > 0.004) {
          r += (bl.rgb[0] - r) * w;
          g += (bl.rgb[1] - g) * w;
          b += (bl.rgb[2] - b) * w;
        }
      }
      const vx = (nx - cx) / rx;
      const vy = (ny - cy) / ry;
      const vt = k * smoothstep(0.5, 1.05, Math.sqrt(vx * vx + vy * vy));
      r = r * (1 - vt) + edge[0] * vt;
      g = g * (1 - vt) + edge[1] * vt;
      b = b * (1 - vt) + edge[2] * vt;
      // amplitude 3.5: strong enough to mask 256-colour quantization banding,
      // reads as film grain under the site's noise.png overlay
      const d = rand() * 3.5;
      data[idx++] = Math.max(0, Math.min(255, Math.round(r + d)));
      data[idx++] = Math.max(0, Math.min(255, Math.round(g + d)));
      data[idx++] = Math.max(0, Math.min(255, Math.round(b + d)));
      data[idx++] = 255;
    }
  }
  return data;
}

for (const [name, variant] of Object.entries(VARIANTS)) {
  const dir = path.join(OUT, name);
  await mkdir(dir, { recursive: true });
  for (const [tag, W, H] of SIZES) {
    const out = path.join(dir, `background-${tag}.png`);
    const raw = renderVariant(variant, W, H);
    await sharp(raw, { raw: { width: W, height: H, channels: 4 } })
      .png({ compressionLevel: 9 })
      .toFile(out);
    console.log('wrote', path.relative(process.cwd(), out));
  }
}

