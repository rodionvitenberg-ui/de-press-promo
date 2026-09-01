import type { Capabilities } from "./capabilities";
import type { SceneDataJson } from "./types";

/** Device → scene data file (legacy `Island.getDatas`, same fallback logic). */
const DEVICE_DATA_FILES: Record<string, string> = {
  desktop: "desktop.json",
  "tablet-portrait": "tablet-portrait.json",
  "tablet-landscape": "tablet-landscape.json",
};

/**
 * Loads the scene data for the current device. Returns `null` for mobile
 * (scene disabled — camera/spline data not needed), mirroring the legacy
 * boot where mobile never constructs the island.
 */
export async function loadSceneData(
  caps: Capabilities,
): Promise<SceneDataJson | null> {
  let key: string | null = null;
  if (caps.deviceType === "desktop") key = "desktop";
  else if (caps.deviceType === "tablet") {
    key = caps.orientation === "portrait" ? "tablet-portrait" : "tablet-landscape";
  }
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
