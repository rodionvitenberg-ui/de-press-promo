import * as THREE from "three";
import { C } from "./constants";
import { emitter } from "./emitter";

/**
 * Renderer / scene / camera rig — ports of the legacy `globals/renderer`,
 * `globals/scene` and `modules/camera` singletons (dog.js modules 31/33/36).
 * The legacy bundle built them at import time against a container resolved
 * later; here they are created once, when the facade is constructed and the
 * container is known.
 */
export type Stage = {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  cameraPivot: THREE.Object3D;
};

let stage: Stage | null = null;

export function createStage(container: HTMLElement): Stage {
  if (stage) return stage;

  const canvas = document.createElement("canvas");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: false,
    alpha: true,
    preserveDrawingBuffer: false,
    precision: "highp",
    powerPreference: "high-performance",
    depth: true,
    stencil: false,
  });
  renderer.setPixelRatio(C.DPI);
  renderer.setClearColor(0, 0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(canvas);

  const scene = new THREE.Scene();
  // The legacy bundle exposes the scene globally.
  (window as unknown as { scene?: THREE.Scene }).scene = scene;

  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    1,
    50,
  );
  camera.position.set(0, 0, -1);

  const cameraPivot = new THREE.Object3D();
  cameraPivot.position.set(0, 0, 10);
  cameraPivot.add(camera);
  scene.add(cameraPivot);

  // The camera looks at the scene origin every frame (legacy camera.update).
  emitter.onUpdate(() => {
    camera.lookAt(scene.position);
  });
  emitter.onResize((width, height) => {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  });

  stage = { renderer, scene, camera, cameraPivot };
  return stage;
}

export function getStage(): Stage {
  if (!stage) throw new Error("SceneGL: stage is not created yet");
  return stage;
}
