"use client";

import { useEffect, useRef } from "react";

const THEME = "/app/themes/portfolio-2018";
const JS = `${THEME}/static/js`;

export type DogstudioPageProps = {
  bodyClass: string;
  dataTheme: string;
  dataPage: string;
  markup: string;
  /** Sync <html lang> with the active locale (root layout ships "ru"). */
  htmlLang?: string;
};

export type DogKeypoint = {
  value: number;
  element: string;
  offset?: number;
  visible?: boolean;
};

export type DogState = {
  POSES_COUNT: number;
  CAM_Y: number[];
  DEPTH: number[];
  H_ROTATION: number[];
  V_ROTATION: number[];
  X_OFFSET: number[];
  Y_OFFSET: number[];
  MOUSE_INFLUENCE: number[];
  KEYPOINTS?: DogKeypoint[];
};

export type DogMatcap = {
  normalScale: number;
  diffuseWeight: number;
  specularWeight: number;
};

export type DogDataJson = {
  MATCAP_PER_ROW: number;
  STATES: Record<string, DogState>;
  MATCAPS: DogMatcap[];
};

export type DogGLOptions = {
  data: unknown;
};

export type DogGLConstructor = new (options: DogGLOptions) => unknown;

declare global {
  interface Window {
    Dogstudio?: { theme_link: string };
    disable_dog?: boolean;
    disable_motion?: boolean;
    Detectizr?: {
      device: { type: string; orientation?: string };
    };
    DogGL?: DogGLConstructor;
  }
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[data-dogstudio-src="${src}"]`,
    );
    if (existing) {
      if (existing.dataset.loaded === "1") resolve();
      else existing.addEventListener("load", () => resolve(), { once: true });
      return;
    }
    const el = document.createElement("script");
    el.src = src;
    el.async = false;
    el.dataset.dogstudioSrc = src;
    el.onload = () => {
      el.dataset.loaded = "1";
      resolve();
    };
    el.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(el);
  });
}

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

function applyDeviceFlags() {
  window.disable_dog = false;
  window.disable_motion = false;

  const type = window.Detectizr?.device?.type;
  if (type === "mobile") {
    document.documentElement.classList.add("disable-dog");
    window.disable_dog = true;
  }
  if (type === "tablet" || type === "mobile") {
    document.documentElement.classList.add("disable-motion");
    window.disable_motion = true;
  }
}

function fallbackWithoutDog() {
  document.body.classList.remove("lock-scroll");
  document.querySelectorAll(".js-in-view").forEach((el) => {
    el.classList.add("in-view");
  });
}

const DEVICE_DATA_FILES = {
  desktop: "desktop.json",
  "tablet-portrait": "tablet-portrait.json",
  "tablet-landscape": "tablet-landscape.json",
} as const;

type DeviceDataKey = keyof typeof DEVICE_DATA_FILES;

async function loadDogDataForDevice(): Promise<DogDataJson | null> {
  const type = window.Detectizr?.device?.type;
  const orientation = window.Detectizr?.device?.orientation;

  let key: DeviceDataKey | null = null;
  if (type === "desktop") key = "desktop";
  else if (type === "tablet") {
    key = orientation === "portrait" ? "tablet-portrait" : "tablet-landscape";
  }

  // mobile → disable_dog; camera/spline data not needed
  if (!key) return null;

  const file = DEVICE_DATA_FILES[key];
  const res = await fetch(`/data/dog/${file}`);
  if (!res.ok) throw new Error(`GET /data/dog/${file} → ${res.status}`);
  const json = (await res.json()) as DogDataJson;
  if (
    !json ||
    typeof json !== "object" ||
    typeof json.MATCAP_PER_ROW !== "number" ||
    !json.STATES ||
    !Array.isArray(json.MATCAPS)
  ) {
    throw new Error(`Invalid dog data: ${file}`);
  }
  return json;
}

/**
 * Phase 1: inject extracted data-*.json into DogGL without editing bundles.
 * main.js calls `new window.DogGL({ data })`; we swap the constructor so the
 * same data ships from public/data/dog/*.json instead of webpack modules.
 */
function patchDogGLWithData(data: DogDataJson) {
  const Original = window.DogGL;
  if (typeof Original !== "function") return;

  window.DogGL = new Proxy(Original, {
    construct(
      Target: DogGLConstructor,
      args: unknown[],
      newTarget: DogGLConstructor,
    ): object {
      const [options] = args as [DogGLOptions?];
      return Reflect.construct(
        Target,
        [{ ...(options ?? {}), data }],
        newTarget,
      ) as object;
    },
  }) as DogGLConstructor;

  console.debug("[phase1] DogGL data overridden from public/data/dog/*.json");
}

/**
 * Host for an original Dogstudio page runtime.
 * Injects markup once and boots detectizr → own DogGL module → main.js.
 * React does not re-render this tree after mount.
 */
export default function DogstudioPage({
  bodyClass,
  dataTheme,
  dataPage,
  markup,
  htmlLang,
}: DogstudioPageProps) {
  const booted = useRef(false);

  useEffect(() => {
    if (booted.current) return;
    booted.current = true;

    if (htmlLang) {
      document.documentElement.lang = htmlLang;
    }

    const prevClass = document.body.className;
    const prevTheme = document.body.getAttribute("data-theme");
    const prevPage = document.body.getAttribute("data-page");

    document.body.className = bodyClass;
    document.body.setAttribute("data-theme", dataTheme);
    document.body.setAttribute("data-page", dataPage);

    window.Dogstudio = { theme_link: THEME };

    let cancelled = false;

    (async () => {
      try {
        await loadScript(`${JS}/detectizr.js`);
        await loadScript(`${JS}/modernizr.js`);
        if (cancelled) return;

        applyDeviceFlags();

        const wasm = supportsWasm();
        if (!wasm) {
          console.warn("WebAssembly not supported — dog disabled");
          fallbackWithoutDog();
          return;
        }

        if (!window.disable_dog) {
          // Phase 1: fetch data-*.json in parallel with the GL boot, then
          // intercept `new window.DogGL({ data })` in main.js.
          const dataPromise = loadDogDataForDevice().catch((err) => {
            console.warn(
              "[phase1] dog data unavailable — using bundle data:",
              err,
            );
            return null;
          });
          // Phase 2: own GL module replaces the legacy dog.js bundle.
          const doggl = await import("./doggl");
          doggl.installDogGL();
          if (cancelled) return;
          const dogData = await dataPromise;
          if (dogData) patchDogGLWithData(dogData);
        }

        await loadScript(`${JS}/main.js`);
      } catch (err) {
        console.error("Dogstudio boot failed:", err);
        fallbackWithoutDog();
      }
    })();

    return () => {
      cancelled = true;
      document.body.className = prevClass;
      if (prevTheme) document.body.setAttribute("data-theme", prevTheme);
      else document.body.removeAttribute("data-theme");
      if (prevPage) document.body.setAttribute("data-page", prevPage);
      else document.body.removeAttribute("data-page");
    };
  }, [bodyClass, dataTheme, dataPage, htmlLang]);

  return (
    <div
      className="dogstudio-page-root"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}
