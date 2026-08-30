import * as THREE from "three";
import { C } from "./constants";
import { getStage } from "./stage";

/**
 * Supersampling pass — port of the legacy `postprocessing/ssaa` (legacy bundle
 * module 45). Renders the scene once per jitter offset into a sample target
 * and accumulates the results onto the screen with additive blending.
 */

const JITTER_VECTORS: Array<Array<[number, number]>> = [
  [[0, 0]],
  [
    [4, 4],
    [-4, -4],
  ],
  [
    [-2, -6],
    [6, -2],
    [-6, 2],
    [2, 6],
  ],
  [
    [1, -3],
    [-1, 3],
    [5, 1],
    [-3, -5],
    [-5, 5],
    [-7, -1],
    [3, 7],
    [7, -7],
  ],
  [
    [1, 1],
    [-1, -3],
    [-3, 2],
    [4, -1],
    [-5, -2],
    [2, 5],
    [5, 3],
    [3, -5],
    [-2, 6],
    [0, -7],
    [-4, -6],
    [-6, 4],
    [-8, 0],
    [7, -4],
    [6, 7],
    [-7, -8],
  ],
  [
    [-4, -7],
    [-7, -5],
    [-3, -5],
    [-5, -4],
    [-1, -4],
    [-2, -2],
    [-6, -1],
    [-4, 0],
    [-7, 1],
    [-1, 2],
    [-6, 3],
    [-3, 3],
    [-7, 6],
    [-3, 6],
    [-5, 7],
    [-1, 7],
    [5, -7],
    [1, -6],
    [6, -5],
    [4, -4],
    [2, -3],
    [7, -2],
    [1, -1],
    [4, -1],
    [2, 1],
    [6, 2],
    [0, 4],
    [4, 4],
    [2, 5],
    [7, 5],
    [5, 6],
    [3, 7],
  ],
];

const SSAAvs = /* glsl */ `

varying vec2 vUv;

void main() {

	vUv = uv;
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

}
`;

const SSAAfs = /* glsl */ `

uniform float opacity;

uniform sampler2D tDiffuse;
varying vec2 vUv;

void main() {

	vec4 texel = texture2D( tDiffuse, vUv );
	gl_FragColor = opacity * texel;

}
`;

export class SSAAPass {
  /** Legacy `unbiased` flag: distributes weights to sum to exactly 1. */
  private readonly unbiased = true;

  private sampleRenderTarget = new THREE.WebGLRenderTarget(1, 1, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    wrapS: THREE.ClampToEdgeWrapping,
    wrapT: THREE.ClampToEdgeWrapping,
    format: THREE.RGBAFormat,
  });

  private copyUniforms = {
    tDiffuse: { value: null as THREE.Texture | null },
    opacity: { value: 1 },
  };

  private copyMaterial = new THREE.ShaderMaterial({
    uniforms: this.copyUniforms,
    vertexShader: SSAAvs,
    fragmentShader: SSAAfs,
    premultipliedAlpha: true,
    transparent: true,
    blending: THREE.AdditiveBlending,
  });

  private camera2 = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  private scene2 = new THREE.Scene();
  private quad2: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;

  private width = 1;
  private height = 1;

  constructor() {
    this.sampleRenderTarget.texture.name = "SSAARenderPass.sample";
    this.quad2 = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.copyMaterial);
    this.quad2.frustumCulled = false;
    this.scene2.add(this.quad2);
  }

  setSize(width: number, height: number): void {
    this.sampleRenderTarget.setSize(width, height);
    this.width = width;
    this.height = height;
  }

  render(): void {
    const { renderer, scene, camera } = getStage();
    const jitter = JITTER_VECTORS[Math.max(0, Math.min(C.SSAA_QUALITY, 5))];
    const previousAutoClear = renderer.autoClear;
    renderer.autoClear = false;

    const clearColor = renderer.getClearColor(new THREE.Color()).getHex();
    const clearAlpha = renderer.getClearAlpha();
    const baseOpacity = 1 / jitter.length;
    this.copyUniforms.tDiffuse.value = this.sampleRenderTarget.texture;

    for (let i = 0; i < jitter.length; i++) {
      const [jitterX, jitterY] = jitter[i];
      camera.setViewOffset(
        this.width,
        this.height,
        0.0625 * jitterX,
        0.0625 * jitterY,
        this.width,
        this.height,
      );
      let opacity = baseOpacity;
      if (this.unbiased) {
        opacity += (1 / 32) * ((i + 0.5) / jitter.length - 0.5);
      }
      this.copyUniforms.opacity.value = opacity;

      // Scene → sample target (forced clear).
      renderer.setRenderTarget(this.sampleRenderTarget);
      renderer.setClearColor(clearColor, clearAlpha);
      renderer.clear();
      renderer.render(scene, camera);
      // Accumulation starts from a fully transparent buffer.
      if (i === 0) renderer.setClearColor(0, 0);

      // Copy quad → screen (clear only on the first pass).
      renderer.setRenderTarget(null);
      if (i === 0) renderer.clear();
      renderer.render(this.scene2, this.camera2);
    }

    camera.clearViewOffset();
    renderer.autoClear = previousAutoClear;
  }
}
