import * as THREE from "three";
import { C } from "./constants";
import { emitter } from "./emitter";
import { getStage } from "./stage";
import { fxfs, fxvs } from "./fxaa";
import { SSAAPass } from "./ssaa";

/**
 * Fullscreen-kernel pipeline — port of the legacy `postprocessing/quad`
 * (dog.js module 44). With SSAA enabled it delegates to the supersampling
 * pass; otherwise it renders the scene into a target and applies FXAA
 * through a fullscreen triangle kernel.
 */
export class Quad {
  private kernels = new THREE.Scene();
  private camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  private fxaaMaterial: THREE.ShaderMaterial;
  private fxaaOutput: THREE.WebGLRenderTarget;
  private ssaaPass = new SSAAPass();

  constructor() {
    // Legacy fullscreen triangle (globals/triangle, module 34).
    const geometry = new THREE.BufferGeometry();
    geometry.setIndex([2, 1, 0]);
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute([-1, -1, 0, -1, 4, 0, 4, -1, 0], 3),
    );

    this.fxaaMaterial = new THREE.ShaderMaterial({
      uniforms: {
        tInput: { value: null as THREE.Texture | null },
        devicePixelRatio: { value: C.DPI },
        resolution: { value: new THREE.Vector2(1, 1) },
      },
      vertexShader: fxvs,
      fragmentShader: fxfs,
      depthTest: false,
      depthWrite: false,
      transparent: true,
    });

    const mesh = new THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>(
      geometry,
      this.fxaaMaterial,
    );
    this.kernels.add(mesh);

    this.fxaaOutput = new THREE.WebGLRenderTarget(1, 1, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      wrapS: THREE.ClampToEdgeWrapping,
      wrapT: THREE.ClampToEdgeWrapping,
      format: THREE.RGBAFormat,
    });

    emitter.onResize((width, height) => this.resize(width, height));
  }

  render(target: THREE.WebGLRenderTarget): void {
    if (C.SSAA) {
      this.ssaaPass.render();
      return;
    }
    const { renderer, scene, camera } = getStage();
    // Scene → FBO (legacy 4-argument renderer.render).
    renderer.setRenderTarget(target);
    renderer.clear();
    renderer.render(scene, camera);
    // FXAA kernel → screen (legacy renderer.renderLIGHT).
    this.fxaaMaterial.uniforms.tInput.value = target.texture;
    renderer.setRenderTarget(null);
    renderer.render(this.kernels, this.camera);
  }

  resize(width: number, height: number): void {
    const scaledWidth = Math.floor(width * C.DPI);
    const scaledHeight = Math.floor(height * C.DPI);
    this.fxaaMaterial.uniforms.resolution.value.set(scaledWidth, scaledHeight);
    this.fxaaOutput.setSize(width, height);
    this.ssaaPass.setSize(width, height);
  }
}
