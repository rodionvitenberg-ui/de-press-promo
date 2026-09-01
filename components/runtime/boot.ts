import { applyDeviceFlags, detectCapabilities, fallbackWithoutScene } from "./capabilities";
import type { Island } from "./island";
import { Island as IslandClass } from "./island";
import { initCases } from "./cases";
import { initCookie } from "./cookie";
import { initHeader } from "./header";
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
};

/** Legacy `utils/mq` xl breakpoint (ruler--1190). */
const XL_MIN = 1190;

export type BootOptions = {
  /** Page slug from `data-page` (legacy `data-router-view`). */
  dataPage: string;
};

export type RuntimeHandle = { destroy: () => void };

/**
 * Own runtime boot — replacement of the legacy `main.js` boot:
 * capabilities → scene data → island (show + intro) → UI modules.
 */
export async function bootRuntime(options: BootOptions): Promise<RuntimeHandle> {
  const caps = detectCapabilities();
  applyDeviceFlags(caps);

  const cleanups: (() => void)[] = [];
  let island: Island | null = null;
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
    island?.destroy();
    island = null;
  };

  const sceneEl = document.querySelector<HTMLElement>(".scene-root");
  const innerEl = document.querySelector<HTMLElement>(".scene-root-inner");
  if (!caps.wasm || !sceneEl || !innerEl) {
    fallbackWithoutScene();
    return { destroy };
  }

  const data = await loadSceneData(caps);
  if (!data) {
    // Mobile: scene disabled, 2D CSS fallbacks (legacy disable_scene path).
    fallbackWithoutScene();
    return { destroy };
  }

  const slug = (
    options.dataPage in PAGE_STATES ? options.dataPage : "home"
  ) as PageSlug;

  island = new IslandClass({
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
  island.setProfile(profile);

  try {
    await island.load();
  } catch (err) {
    console.warn("island load failed — 2D fallback:", err);
    fallbackWithoutScene();
    return { destroy };
  }

  // Legacy Default.onLoaderCompleted: show + init (intro) + resize.
  island.show();
  island.init();

  const step = () => {
    island?.update();
    raf = requestAnimationFrame(step);
  };
  raf = requestAnimationFrame(step);

  cleanups.push(initReveals().destroy);
  const menu = initMenu(island);
  cleanups.push(menu.destroy);
  cleanups.push(initHeader(menu.isOpen));
  cleanups.push(initCookie());

  if (slug === "home") cleanups.push(initCases(island).destroy);
  if (slug === "about") cleanups.push(initTableExpand(island));
  if (slug === "contact") cleanups.push(initTyped());

  return { destroy };
}
