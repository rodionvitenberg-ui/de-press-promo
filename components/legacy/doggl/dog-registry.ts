import type { Dog } from "./dog";

/**
 * Registry for the dog singleton. The legacy bundle used a module-level
 * singleton (`modules/dog`); here world3d registers its instance and the
 * camera behaviour looks it up.
 */
let dog: Dog | null = null;

export function registerDog(instance: Dog): void {
  dog = instance;
}

export function getDog(): Dog {
  if (!dog) throw new Error("SceneGL: dog is not initialized yet");
  return dog;
}
