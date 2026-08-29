import * as THREE from "three";
import { C } from "./constants";
import { emitter } from "./emitter";
import { Quad } from "./quad";

/**
 * Postprocessing — port of the legacy `postprocessing/index.js` (dog.js
 * module 42). Owns the scene render target consumed by the fullscreen-kernel
 * pipeline.
 */
export class Postprocessing {
  private target = new THREE.WebGLRenderTarget(1, 1, {
    minFilter: THREE.LinearMipmapLinearFilter, // legacy LinearMipMapLinearFilter
    magFilter: THREE.LinearFilter, // mag filtering never samples mips
    wrapS: THREE.ClampToEdgeWrapping,
    wrapT: THREE.ClampToEdgeWrapping,
    format: THREE.RGBAFormat,
    type: THREE.UnsignedByteType,
    stencilBuffer: true,
    depthBuffer: true,
    generateMipmaps: false,
  });

  private quad = new Quad();

  constructor() {
    this.resize(window.innerWidth, window.innerHeight);
    emitter.onResize((width, height) => this.resize(width, height));
  }

  render(): void {
    this.quad.render(this.target);
  }

  resize(width: number, height: number): void {
    this.target.setSize(width * C.DPI, height * C.DPI);
  }
}
