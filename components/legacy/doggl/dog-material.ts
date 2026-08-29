import * as THREE from "three";

/**
 * Matcap material — port of the legacy `modules/dogmaterial` (dog.js
 * module 39). A MeshBasicMaterial whose program is patched with the original
 * matcap shader: an atlas of matcap cells (`matcapPerRow` columns), tangent-
 * space normal mapping, diffuse/specular weighting and a distance-driven
 * crossfade between two cells.
 *
 * GLSL is kept verbatim from the legacy bundle, with two adaptations for the
 * current three.js:
 *  - `varying vec2 vUv` is declared/filled by the patch itself (meshbasic no
 *    longer provides `vUv`; it only provides `vMapUv`).
 *  - In the skinned vertex suffix the normal skinning math is not repeated —
 *    `skinnormal_vertex` already skin-transforms `objectNormal`, and
 *    redeclaring it would break compilation.
 */

export type DogUniforms = {
  tMatCap: { value: THREE.Texture | null };
  specularMap: { value: THREE.Texture | null };
  normalMap: { value: THREE.Texture | null };
  firstNormalScale: { value: number };
  secondNormalScale: { value: number };
  matcapNumber: { value: number };
  matcapPerRow: { value: number };
  firstMatcapIdx: { value: number };
  secondMatcapIdx: { value: number };
  matcapTransition: { value: number };
  firstDiffuseWeight: { value: number };
  secondDiffuseWeight: { value: number };
  firstSpecularWeight: { value: number };
  secondSpecularWeight: { value: number };
  specularAttenuation: { value: number };
};

const FS_PRELUDE = /* glsl */ `
// <pre>

float when_fgt(float x, float y) {
  return max(sign(x - y), 0.0);
}


uniform float matcapTransition;
uniform float matcapNumber;
uniform float matcapPerRow;
uniform float purematcapperrow;
uniform float firstMatcapIdx;
uniform float secondMatcapIdx;
uniform sampler2D tMatCap;
varying vec3 vEye;
uniform sampler2D specularMap;
uniform sampler2D normalMap;
varying vec3 vViewPosition;
varying vec2 vUv;
uniform float firstNormalScale;
uniform float secondNormalScale;

uniform float firstDiffuseWeight;
uniform float secondDiffuseWeight;
uniform float firstSpecularWeight;
uniform float secondSpecularWeight;
uniform float specularAttenuation;

mat3 cotangent(vec3 N, vec3 p, vec2 uv) {
  // get edge vectors of the pixel triangle
  vec3 dp1 = dFdx(p);
  vec3 dp2 = dFdy(p);
  vec2 duv1 = dFdx(uv);
  vec2 duv2 = dFdy(uv);

  // solve the linear system
  vec3 dp2perp = cross(dp2, N);
  vec3 dp1perp = cross(N, dp1);
  vec3 T = dp2perp * duv1.x + dp1perp * duv2.x;
  vec3 B = dp2perp * duv1.y + dp1perp * duv2.y;

  // construct a scale-invariant frame
  float invmax = 1.0 / sqrt(max(dot(T,T), dot(B,B)));
  return mat3(T * invmax, B * invmax, N);
}

vec3 perturb(vec3 map, vec3 N, vec3 V, vec2 texcoord) {
  mat3 TBN = cotangent(N, -V, texcoord);
  return normalize(TBN * map);
}

const vec3 pos = vec3(13., 20., 13.);

float sampleTransition (vec3 normalTex) {
  float dist = ((2. - distance(pos, vViewPosition) / 4. + matcapTransition * 13.) / (6. + matcapTransition * 4.));
  dist = smoothstep(0., 1., dist);
  return clamp(dist + pow(normalTex.y, 1.2) * 25. * dist, 0., 1.);
}

vec3 sampleMatcaps (vec3 normalTex, float transition) {
  //expand into -1.0 .. 1.0 range
  vec3 normalMap = normalTex * 2.0 - 1.0;

  //apply scale and camera factor
  float normalCameraFactor = 1. - clamp((distance(cameraPosition, vViewPosition) - 12.) / 25., 0.0, 1.0) * 0.5;

  float normalscalemix = mix(firstNormalScale, secondNormalScale, transition);
  normalMap.xy *= normalscalemix * normalCameraFactor;


  //get surface normal and camera-space position
  vec3 N = normalize(vNormal);
  vec3 V = normalize(vViewPosition);

  //perturb the normal
  vec3 normal = perturb(normalMap, N, V, vUv);

  vec3 reflected = reflect(vEye, normal);

  // cannot avoid division here
  float m = 2.8284271247463 * sqrt( reflected.z + 1.0 );
  vec2 matcapUv = reflected.xy / m * 0.925 + 0.5;

  float id0Over = mix(0.5, 0.0, when_fgt(firstMatcapIdx,  matcapPerRow - 1.));
  float id1Over = mix(0.5, 0.0, when_fgt(secondMatcapIdx, matcapPerRow - 1.));

  vec2 firstMatcapUv  = vec2(fract((matcapUv.x  + firstMatcapIdx ) * matcapNumber), matcapUv.y * 0.5 + id0Over);
  vec2 secondMatcapUv = vec2(fract((matcapUv.x  + secondMatcapIdx) * matcapNumber), matcapUv.y * 0.5 + id1Over) ;

  return mix(
    texture2D(tMatCap, firstMatcapUv).rgb,
    texture2D(tMatCap, secondMatcapUv).rgb,
    transition
  );
}

vec3 sampleDiffuse () {
  return vec3(texture2D(map, vUv));
}

float sampleSpecular () {
  return vec3(texture2D(specularMap, vUv)).r;
}

// </pre>
`;

const FS_MAIN = /* glsl */ `
// <main>
// vec2 vUv = vec2(vUv.x, 1.0 - vUv.y);
highp vec3 normalTex = texture2D(normalMap, vUv).rgb;
float transition = sampleTransition(normalTex);
float diffuseWeight = mix(firstDiffuseWeight, secondDiffuseWeight, transition);
float specularWeight = mix(firstSpecularWeight, secondSpecularWeight, transition);
float specularWeighted = sampleSpecular() * specularWeight;
float specularMatCap = (1.0 - specularWeight * specularAttenuation + specularWeighted);
float specularDiffuse = 1.0 - specularWeighted;

gl_FragColor.rgb = specularMatCap * sampleMatcaps(normalTex, transition) * (1.0 - diffuseWeight * 0.075) + sampleDiffuse() * diffuseWeight * specularDiffuse;
// gl_FragColor.rgb = specularMatCap;
gl_FragColor.a = 1.;

// </main>
`;

const VS_PARS = /* glsl */ `
// <pre>

varying vec3 vEye;
varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec2 vUv;

// </pre>
`;

const VS_SUFFIX_SKINNED = /* glsl */ `
// <suffix>

transformed = ( bindMatrixInverse * skinned ).xyz;
mvPosition = modelViewMatrix * vec4( transformed, 1.0 );
vViewPosition = -mvPosition.xyz;
vEye = normalize( mvPosition ).xyz;

// objectNormal is already skin-transformed by the skinnormal_vertex chunk.
vNormal = normalize(normalMatrix * objectNormal);
vUv = uv;

// </suffix>
`;

const VS_SUFFIX_STATIC = /* glsl */ `
// <suffix>

vEye = normalize( mvPosition ).xyz;
vViewPosition = - mvPosition.xyz;
vec3 objectNormal = normal;
vNormal = normalMatrix * objectNormal;
vUv = uv;

// </suffix>
`;

/**
 * @param matcapPerRow  Cells per row in the matcap atlas.
 * @param skinned       Body material (skinned mesh).
 * @param doubleSided   Branch/leaf material.
 */
export class DogMaterial extends THREE.MeshBasicMaterial {
  readonly uniforms: DogUniforms;

  constructor(matcapPerRow: number, skinned: boolean, doubleSided: boolean) {
    super({
      visible: true,
      side: doubleSided ? THREE.DoubleSide : THREE.FrontSide,
    });

    // `USE_MAP` must stay defined: the legacy `sampleDiffuse()` references the
    // `map` uniform, which three.js only declares when a map is bound. Without
    // it the fragment shader fails to compile and nothing renders. A flat
    // black 1x1 texture keeps the program compiling until the real diffuse
    // is bound (see Dog.init).
    this.map = createNeutralDiffuseMap();

    this.uniforms = {
      tMatCap: { value: null },
      specularMap: { value: null },
      normalMap: { value: null },
      firstNormalScale: { value: 0 },
      secondNormalScale: { value: 0 },
      matcapNumber: { value: 1 / matcapPerRow },
      matcapPerRow: { value: matcapPerRow },
      firstMatcapIdx: { value: 0 },
      secondMatcapIdx: { value: 0 },
      matcapTransition: { value: 0 },
      firstDiffuseWeight: { value: 0.5 },
      secondDiffuseWeight: { value: 0.5 },
      firstSpecularWeight: { value: 0 },
      secondSpecularWeight: { value: 0 },
      specularAttenuation: { value: 0.48 },
    };
    // Legacy kept the uniforms on `material.userData.uniforms`.
    this.userData.uniforms = this.uniforms;

    this.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, this.uniforms);
      shader.fragmentShader = shader.fragmentShader
        .replace(
          "#include <clipping_planes_pars_fragment>",
          `#include <clipping_planes_pars_fragment>\n${FS_PRELUDE}`,
        )
        .replace(
          /(void\s+main\s?\(\s?\)\s?{)[\s\S]+(})\s*$/im,
          `$1\n${FS_MAIN}\n$2`,
        );
      shader.vertexShader = shader.vertexShader
        .replace(
          "#include <clipping_planes_pars_vertex>",
          `#include <clipping_planes_pars_vertex>\n${VS_PARS}`,
        )
        .replace(
          "#include <logdepthbuf_vertex>",
          `#include <logdepthbuf_vertex>\n${
            skinned ? VS_SUFFIX_SKINNED : VS_SUFFIX_STATIC
          }`,
        );
    };
  }
}

/** Flat black 1x1 diffuse: satisfies `USE_MAP` (compiles `sampleDiffuse()`) while adding no light. */
function createNeutralDiffuseMap(): THREE.DataTexture {
  const texture = new THREE.DataTexture(
    new Uint8Array([0, 0, 0, 255]),
    1,
    1,
    THREE.RGBAFormat,
  );
  texture.needsUpdate = true;
  return texture;
}
