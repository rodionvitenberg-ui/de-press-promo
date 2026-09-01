/**
 * Device capabilities — replacement of the legacy Detectizr/Modernizr pair.
 * Semantics kept compatible with how `main.js` consumed them:
 *   - Detectizr.device.type → desktop | tablet | mobile (boot flags, scene data)
 *   - Modernizr.touchevents → coarse-pointer detection (mouse parallax, cases hover)
 *   - WebAssembly probe → Draco decoding capability (3D on/off)
 */

export type DeviceType = "desktop" | "tablet" | "mobile";

export type Capabilities = {
  deviceType: DeviceType;
  orientation: "portrait" | "landscape";
  reducedMotion: boolean;
  /** Coarse pointer / touch events (Modernizr.touchevents equivalent). */
  touch: boolean;
  /** WebAssembly available (Draco decoder requirement). */
  wasm: boolean;
};

const MOBILE_UA =
  /iPhone|iPod|Android.+Mobile|Windows Phone|IEMobile|Opera Mini|BlackBerry|webOS|Opera Mobi/i;
const TABLET_UA = /iPad|Tablet|PlayBook|Silk|Kindle/i;

function detectDeviceType(): DeviceType {
  if (typeof navigator === "undefined") return "desktop";
  const ua = navigator.userAgent;
  if (MOBILE_UA.test(ua)) return "mobile";
  if (TABLET_UA.test(ua)) return "tablet";
  // Android tablet: Android without the "Mobile" token.
  if (/Android/i.test(ua)) return "tablet";
  // iPadOS 13+ masquerades as Macintosh with multi-touch.
  if (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1) return "tablet";
  return "desktop";
}

function detectOrientation(): "portrait" | "landscape" {
  if (typeof window === "undefined" || !window.matchMedia) return "landscape";
  return window.matchMedia("(orientation: portrait)").matches
    ? "portrait"
    : "landscape";
}

function detectTouch(): boolean {
  if (typeof window === "undefined") return false;
  const coarse =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(pointer: coarse)").matches;
  return coarse || "ontouchstart" in window;
}

/** Legacy boot WASM probe (kept byte-compatible with the legacy bundle). */
function supportsWasm(): boolean {
  try {
    if (
      typeof WebAssembly === "object" &&
      typeof WebAssembly.instantiate === "function"
    ) {
      const wasmModule = new WebAssembly.Module(
        Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00),
      );
      if (wasmModule instanceof WebAssembly.Module) {
        return (
          new WebAssembly.Instance(wasmModule) instanceof WebAssembly.Instance
        );
      }
    }
  } catch {
    /* no wasm */
  }
  return false;
}

export function detectCapabilities(): Capabilities {
  return {
    deviceType: detectDeviceType(),
    orientation: detectOrientation(),
    reducedMotion:
      typeof window !== "undefined" &&
      !!window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    touch: detectTouch(),
    wasm: supportsWasm(),
  };
}

/** Legacy boot flags (html classes + window globals consumed by CSS/runtime). */
export function applyDeviceFlags(caps: Capabilities): void {
  if (typeof window === "undefined") return;
  window.disable_scene = false;
  window.disable_motion = false;

  // Modernizr replacement: 400+ CSS rules are gated on these html classes
  // (e.g. .no-touchevents .home-cases-scenes positioning).
  document.documentElement.classList.add(
    caps.touch ? "touchevents" : "no-touchevents",
  );

  // Feature detects mirrored from the legacy html class set
  // ("backgroundcliptext objectfit object-fit"). main.css gates image
  // rendering on .object-fit / .no-object-fit
  // (.object-fit .home-cases-picture img{object-fit:cover}).
  const objectFit = "objectFit" in document.documentElement.style;
  const backgroundClipText =
    typeof CSS !== "undefined" &&
    !!CSS.supports &&
    (CSS.supports("-webkit-background-clip", "text") ||
      CSS.supports("background-clip", "text"));
  if (objectFit) {
    document.documentElement.classList.add("objectfit", "object-fit");
  } else {
    document.documentElement.classList.add("no-objectfit", "no-object-fit");
  }
  document.documentElement.classList.add(
    backgroundClipText ? "backgroundcliptext" : "no-backgroundcliptext",
  );

  if (caps.deviceType === "mobile") {
    document.documentElement.classList.add("disable-scene");
    window.disable_scene = true;
  }
  if (caps.deviceType === "tablet" || caps.deviceType === "mobile") {
    document.documentElement.classList.add("disable-motion");
    window.disable_motion = true;
  }
}

/** Legacy reduced-motion path: everything visible, no scene. */
export function fallbackWithoutScene(): void {
  document.body.classList.remove("lock-scroll");
  document.querySelectorAll(".js-in-view").forEach((el) => {
    el.classList.add("in-view");
  });
}
