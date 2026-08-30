import type { Island } from "./island";

/**
 * Registry for the island singleton. The legacy bundle used a module-level
 * singleton (`modules/island`); here world3d registers its instance and the
 * camera behaviour looks it up.
 */
let island: Island | null = null;

export function registerIsland(instance: Island): void {
  island = instance;
}

export function getIsland(): Island {
  if (!island) throw new Error("SceneGL: island is not initialized yet");
  return island;
}
