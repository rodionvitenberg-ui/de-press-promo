"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, OrbitControls, useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";

const MODEL = "/app/themes/portfolio-2018/static/assets/dog/models/dog.glb";
const MATCAP =
  "/app/themes/portfolio-2018/static/assets/dog/images/dog/final/matcap-combined-resized.jpg";

export type DogSceneProps = {
  matcapIndex?: number;
  /** 0..1 scrub of idle spin / pose proxy */
  progress?: number;
  autoRotate?: boolean;
  className?: string;
};

function DogModel({
  matcapIndex,
  progress,
}: {
  matcapIndex: number;
  progress: number;
}) {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MODEL);
  const matcapMap = useTexture(MATCAP);

  const clone = useMemo(() => {
    const root = scene.clone(true);
    matcapMap.colorSpace = THREE.SRGBColorSpace;
    matcapMap.wrapS = matcapMap.wrapT = THREE.ClampToEdgeWrapping;
    // Full atlas as matcap (original blends cells in custom shader; we tint by index)
    root.traverse((obj) => {
      if (!(obj as THREE.Mesh).isMesh) return;
      const mesh = obj as THREE.Mesh;
      const mat = new THREE.MeshMatcapMaterial({
        matcap: matcapMap,
        flatShading: false,
      });
      const h = (matcapIndex * 0.07) % 1;
      mat.color.setHSL(h, 0.18 + (matcapIndex % 5) * 0.04, 0.82);
      mesh.material = mat;
    });
    return root;
  }, [scene, matcapMap, matcapIndex]);

  useFrame((_, dt) => {
    if (!group.current) return;
    // progress scrub: yaw + slight bob (proxy for setAnimationProgress)
    const targetY = progress * Math.PI * 2;
    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      targetY,
      4,
      dt,
    );
    group.current.position.y = Math.sin(progress * Math.PI * 2) * 0.08;
  });

  return (
    <group ref={group} scale={1.15} position={[0, -0.35, 0]}>
      <Center>
        <primitive object={clone} />
      </Center>
    </group>
  );
}

function FallbackBox() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#444" />
    </mesh>
  );
}

/**
 * R3F study scene: load dog.glb + matcap atlas, scrub progress, swap matcap index.
 * Not a 1:1 DogGL port — educational stand-in for setMatcap / setAnimationProgress.
 */
export default function DogScene({
  matcapIndex = 0,
  progress = 0,
  autoRotate = true,
  className = "",
}: DogSceneProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className={`lab-dog-canvas lab-dog-canvas--loading ${className}`} />;
  }

  return (
    <div className={`lab-dog-canvas ${className}`}>
      <Canvas
        camera={{ position: [0, 0.4, 3.2], fov: 35 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["#0a0a0c"]} />
        <ambientLight intensity={0.35} />
        <directionalLight position={[4, 6, 2]} intensity={1.1} />
        <directionalLight position={[-3, 2, -2]} intensity={0.35} />
        <Suspense fallback={<FallbackBox />}>
          <DogModel matcapIndex={matcapIndex} progress={progress} />
        </Suspense>
        <OrbitControls
          enablePan={false}
          minDistance={1.8}
          maxDistance={5}
          autoRotate={autoRotate}
          autoRotateSpeed={0.6}
        />
      </Canvas>
    </div>
  );
}

useGLTF.preload(MODEL);
