import type { Metadata } from "next";
import Link from "next/link";
import LabShell from "@/components/lab/LabShell";
import DogPlayground from "@/components/lab/dog/DogPlayground";

export const metadata: Metadata = {
  title: "Dog WebGL — Lab",
};

export default function DogPlaygroundPage() {
  return (
    <LabShell
      title="Dog · R3F"
      lead="Three.js via React Three Fiber. Loads mirrored dog.glb + matcap atlas. Educational — not DogGL feature parity."
    >
      <DogPlayground />
      <section className="lab-section">
        <h2>Study pointers</h2>
        <ul className="lab-list">
          <li>
            <code>study/ARCHITECTURE.md</code> — setMatcap, setAnimationProgress
          </li>
          <li>
            <code>components/lab/dog/DogScene.tsx</code>
          </li>
          <li>
            Legacy runtime: <Link href="/">home</Link> (dog.js)
          </li>
        </ul>
      </section>
    </LabShell>
  );
}
