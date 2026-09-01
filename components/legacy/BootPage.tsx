"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Runtime asset root; main.js concatenates it with "/static/..." paths.
const THEME = "";
const JS = `${THEME}/static/js`;

export type BootPageProps = {
  bodyClass: string;
  dataTheme: string;
  dataPage: string;
  /**
   * Raw markup snapshot (legacy template renderer). When omitted, the page
   * renders real JSX `children` inside the same root (components/pages).
   */
  markup?: string;
  children?: ReactNode;
  /** Sync <html lang> with the active locale (root layout ships "ru"). */
  htmlLang?: string;
};

export type SceneKeypoint = {
  value: number;
  element: string;
  offset?: number;
  visible?: boolean;
};

export type SceneState = {
  POSES_COUNT: number;
  CAM_Y: number[];
  DEPTH: number[];
  H_ROTATION: number[];
  V_ROTATION: number[];
  X_OFFSET: number[];
  Y_OFFSET: number[];
  MOUSE_INFLUENCE: number[];
  KEYPOINTS?: SceneKeypoint[];
};

export type SceneMatcap = {
  normalScale: number;
  diffuseWeight: number;
  specularWeight: number;
};

export type SceneDataJson = {
  MATCAP_PER_ROW: number;
  STATES: Record<string, SceneState>;
  MATCAPS: SceneMatcap[];
};

export type SceneGLOptions = {
  data: unknown;
};

export type SceneGLConstructor = new (options: SceneGLOptions) => unknown;

declare global {
  interface Window {
    Site?: { assetsRoot: string };
    disable_scene?: boolean;
    disable_motion?: boolean;
    Detectizr?: {
      device: { type: string; orientation?: string };
    };
    SceneGL?: SceneGLConstructor;
  }
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[data-boot-src="${src}"]`,
    );
    if (existing) {
      if (existing.dataset.loaded === "1") resolve();
      else existing.addEventListener("load", () => resolve(), { once: true });
      return;
    }
    const el = document.createElement("script");
    el.src = src;
    el.async = false;
    el.dataset.bootSrc = src;
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
  window.disable_scene = false;
  window.disable_motion = false;

  const type = window.Detectizr?.device?.type;
  if (type === "mobile") {
    document.documentElement.classList.add("disable-scene");
    window.disable_scene = true;
  }
  if (type === "tablet" || type === "mobile") {
    document.documentElement.classList.add("disable-motion");
    window.disable_motion = true;
  }
}

function fallbackWithoutScene() {
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

async function loadSceneDataForDevice(): Promise<SceneDataJson | null> {
  const type = window.Detectizr?.device?.type;
  const orientation = window.Detectizr?.device?.orientation;

  let key: DeviceDataKey | null = null;
  if (type === "desktop") key = "desktop";
  else if (type === "tablet") {
    key = orientation === "portrait" ? "tablet-portrait" : "tablet-landscape";
  }

  // mobile → disable_scene; camera/spline data not needed
  if (!key) return null;

  const file = DEVICE_DATA_FILES[key];
  const res = await fetch(`/data/scene/${file}`);
  if (!res.ok) throw new Error(`GET /data/scene/${file} → ${res.status}`);
  const json = (await res.json()) as SceneDataJson;
  if (
    !json ||
    typeof json !== "object" ||
    typeof json.MATCAP_PER_ROW !== "number" ||
    !json.STATES ||
    !Array.isArray(json.MATCAPS)
  ) {
    throw new Error(`Invalid scene data: ${file}`);
  }
  return json;
}

/**
 * Phase 1: inject extracted data-*.json into SceneGL without editing bundles.
 * main.js calls `new window.SceneGL({ data })`; we swap the constructor so the
 * same data ships from public/data/scene/*.json instead of webpack modules.
 */
function patchSceneGLWithData(data: SceneDataJson) {
  const Original = window.SceneGL;
  if (typeof Original !== "function") return;

  window.SceneGL = new Proxy(Original, {
    construct(
      Target: SceneGLConstructor,
      args: unknown[],
      newTarget: SceneGLConstructor,
    ): object {
      const [options] = args as [SceneGLOptions?];
      return Reflect.construct(
        Target,
        [{ ...(options ?? {}), data }],
        newTarget,
      ) as object;
    },
  }) as SceneGLConstructor;

}

/**
 * Host for the original page runtime.
 * Injects markup once and boots detectizr → own SceneGL module → main.js.
 * React does not re-render this tree after mount.
 */
export default function BootPage({
  bodyClass,
  dataTheme,
  dataPage,
  markup,
  children,
  htmlLang,
}: BootPageProps) {
  const booted = useRef(false);
  const runtimeRef = useRef<{ destroy: () => void } | null>(null);

  useEffect(() => {
    if (booted.current) return;
    booted.current = true;

    // Own runtime opt-in (lab flag): ?boot=own boots components/runtime
    // instead of the legacy main.js bundle. Default boot stays legacy.
    const useOwnRuntime =
      new URLSearchParams(window.location.search).get("boot") === "own";

    if (htmlLang) {
      document.documentElement.lang = htmlLang;
    }

    const prevClass = document.body.className;
    const prevTheme = document.body.getAttribute("data-theme");
    const prevPage = document.body.getAttribute("data-page");

    document.body.className = bodyClass;
    document.body.setAttribute("data-theme", dataTheme);
    document.body.setAttribute("data-page", dataPage);

    window.Site = { assetsRoot: THEME };

    let cancelled = false;

    (async () => {
      try {
        if (useOwnRuntime) {
          const { bootRuntime } = await import("../runtime/boot");
          runtimeRef.current = await bootRuntime({ dataPage });
          return;
        }

        await loadScript(`${JS}/detectizr.js`);
        await loadScript(`${JS}/modernizr.js`);
        if (cancelled) return;

        applyDeviceFlags();

        const wasm = supportsWasm();
        if (!wasm) {
          console.warn("WebAssembly not supported — 3D disabled");
          fallbackWithoutScene();
          return;
        }

        if (!window.disable_scene) {
          // Phase 1: fetch data-*.json in parallel with the GL boot, then
          // intercept `new window.SceneGL({ data })` in main.js.
          const dataPromise = loadSceneDataForDevice().catch((err) => {
            console.warn(
              "scene data unavailable — using bundle data:",
              err,
            );
            return null;
          });
          // Phase 2: own GL module replaces the legacy bundle.
          const glscene = await import("./glscene");
          glscene.installSceneGL();
          if (cancelled) return;
          const sceneData = await dataPromise;
          if (sceneData) patchSceneGLWithData(sceneData);
        }

        await loadScript(`${JS}/main.js`);
      } catch (err) {
        console.error("runtime boot failed:", err);
        fallbackWithoutScene();
      }
    })();

    return () => {
      cancelled = true;
      runtimeRef.current?.destroy();
      runtimeRef.current = null;
      document.body.className = prevClass;
      if (prevTheme) document.body.setAttribute("data-theme", prevTheme);
      else document.body.removeAttribute("data-theme");
      if (prevPage) document.body.setAttribute("data-page", prevPage);
      else document.body.removeAttribute("data-page");
    };
  }, [bodyClass, dataTheme, dataPage, htmlLang]);

  if (markup !== undefined) {
    return (
      <div
        className="boot-page-root"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: markup }}
      />
    );
  }
  return (
    <div className="boot-page-root" suppressHydrationWarning>
      {children}
    </div>
  );
}
