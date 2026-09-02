/**
 * Shared types of the own runtime (replacement of the legacy `main.js` bundle).
 *
 * Scene data types mirror `public/data/scene/*.json` (extracted once from the
 * legacy bundle modules; the extraction script retired in A3).
 */

export type SceneKeypoint = {
  value: number;
  element: string;
  offset?: number;
  visible?: boolean;
  /** Cached anchor (computed by the runtime, see Island.refreshKeypoints). */
  top?: number;
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

/** Page slug from `data-page` / legacy `data-router-view`. */
export type PageSlug = "home" | "about" | "values" | "contact" | "privacy" | "support";

declare global {
  interface Window {
    /** Runtime asset root (legacy `window.Site.assetsRoot` — always ""). */
    Site?: { assetsRoot: string };
    disable_scene?: boolean;
    disable_motion?: boolean;
  }
}

/**
 * Page slug → island state (legacy page modules set these literally;
 * `desktop.json` has no CONTACT_STATE — the contact page reuses the legacy
 * careers pose set, the same reuse the original site did. Privacy has its
 * own PRIVACY_STATE: the about pose raised and shifted right of the title;
 * support reuses that pose).
 */
export const PAGE_STATES: Record<PageSlug, string> = {
  home: "HOME_STATE",
  about: "ABOUT_STATE",
  values: "VALUES_STATE",
  contact: "CAREERS_STATE",
  privacy: "PRIVACY_STATE",
  support: "PRIVACY_STATE",
};
