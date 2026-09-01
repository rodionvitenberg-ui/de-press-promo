import { applyDeviceFlags, detectCapabilities, fallbackWithoutScene } from "./capabilities";
import type { Island } from "./island";
import { Island as IslandClass } from "./island";
import { initCases } from "./cases";
import { initCookie } from "./cookie";
import { initHeader } from "./header";
import { initLoader } from "./loader";
import { initMenu } from "./menu";
import { initReveals } from "./reveals";
import { loadSceneData } from "./scene-data";
import { initTableExpand } from "./table-expand";
import { initTyped } from "./typed";
import { PAGE_STATES, type PageSlug } from "./types";
import type { IslandProfile } from "./island";

/** Per-page matcap (legacy page modules set these literally). */
const PAGE_MATCAPS: Record<PageSlug, [number, number]> = {
  home: [1, 0],
  about: [3, 3],
  values: [2, 2],
  contact: [4, 4],
  privacy: [3, 3],
};

/** Legacy `utils/mq` xl breakpoint (ruler--1190). */
const XL_MIN = 1190;

/** Legacy Default: `InView.reset()` delay after the loader `completed`. */
const IN_VIEW_DELAY_MS = 500;

export type BootOptions = {
  /** Page slug from `data-page` (legacy `data-router-view`). */
  dataPage: string;
};

export type RuntimeHandle = { destroy: () => void };

/**
 * Own runtime boot — replacement of the legacy `main.js` boot, in the legacy
 * order: capabilities → DOM modules → Loader.show → Loader.load (ring + island
 * assets) → Loader.loaded → `completed` (island show/intro or plain unlock) →
 * InView.reset (+500ms) → Loader.hide.
 */
export async function bootRuntime(options: BootOptions): Promise<RuntimeHandle> {
  const caps = detectCapabilities();
  applyDeviceFlags(caps);

  const cleanups: (() => void)[] = [];
  // Object holder: the island is created inside the glLoad closure — a plain
  // `let` would defeat TS control-flow analysis at the `completed` branch.
  const islandRef: { current: Island | null } = { current: null };
  let raf = 0;

  const destroy = () => {
    if (raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
    for (const fn of cleanups.reverse()) {
      try {
        fn();
      } catch {
        /* best-effort teardown */
      }
    }
    cleanups.length = 0;
    islandRef.current?.destroy();
    islandRef.current = null;
  };

  const sceneEl = document.querySelector<HTMLElement>(".scene-root");
  const innerEl = document.querySelector<HTMLElement>(".scene-root-inner");
  const slug = (
    options.dataPage in PAGE_STATES ? options.dataPage : "home"
  ) as PageSlug;

  const loader = initLoader({
    // Legacy `Loader.load`: `: true` (instant) when the scene is disabled.
    glLoad: (async () => {
      if (!caps.wasm || window.disable_scene) return;
      const data = await loadSceneData(caps).catch(() => null);
      if (!data || !sceneEl || !innerEl) return; // → 2D fallback on completed
      const isl = new IslandClass({
        data,
        reduced: caps.deviceType === "tablet",
        container: innerEl,
        scene: sceneEl,
        touch: caps.touch,
      });

      const profile: IslandProfile = {
        state: PAGE_STATES[slug],
        matcap: PAGE_MATCAPS[slug],
      };
      if (slug === "home" && window.innerWidth >= XL_MIN) {
        profile.initialMatcap = [19, 19];
        profile.initialProgress = 0.16;
      }
      isl.setProfile(profile);
      islandRef.current = isl;

      try {
        await isl.load();
      } catch (err) {
        console.warn("island load failed — 2D fallback:", err);
        islandRef.current = null;
      }
    })(),
    onIslandLoaded: () => islandRef.current?.loaded(),
  });
  cleanups.push(loader.destroy);

  // DOM modules — legacy `initModules` boots them before the loader chain.
  // The island arrives later (the own runtime has no singleton), so the menu
  // holds an accessor; a null island (mobile) skips scene calls.
  const menu = initMenu(() => islandRef.current);
  cleanups.push(menu.destroy);
  cleanups.push(initHeader(menu.isOpen));
  cleanups.push(initCookie());

  if (slug === "about") cleanups.push(initTableExpand(islandRef.current));
  if (slug === "contact") cleanups.push(initTyped());

  await loader.completed;

  // Legacy `Default.onLoaderCompleted`: island show/intro/resize (its
  // onComplete removes `lock-scroll`), or the plain unlock without a scene.
  const isl = islandRef.current;
  if (isl) {
    isl.show();
    isl.init();
    isl.onResize();

    const step = () => {
      islandRef.current?.update();
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    // Cases hover drives the island matcap — xl desktop only (legacy guard),
    // possible only after the scroll unlocks, i.e. after `completed`.
    if (slug === "home") cleanups.push(initCases(isl).destroy);
  } else {
    fallbackWithoutScene();
  }

  // Legacy Default: `InView.reset()` runs 500ms after the loader completed.
  const inViewTimer = window.setTimeout(() => {
    cleanups.push(initReveals().destroy);
  }, IN_VIEW_DELAY_MS);
  cleanups.push(() => window.clearTimeout(inViewTimer));

  return { destroy };
}

