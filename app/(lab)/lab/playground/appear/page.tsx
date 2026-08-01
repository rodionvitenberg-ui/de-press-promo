import type { Metadata } from "next";
import LabShell from "@/components/lab/LabShell";
import AppearDemo from "@/components/lab/AppearDemo";

export const metadata: Metadata = {
  title: "Appear playground — Lab",
};

export default function AppearPlaygroundPage() {
  return (
    <LabShell
      title="Appear / in-view"
      lead="Оригинал: классы .js-in-view + .appear-fade-up (+ delays). Здесь — React + IntersectionObserver."
    >
      <AppearDemo />
      <section className="lab-section">
        <h2>Study pointers</h2>
        <ul className="lab-list">
          <li>
            <code>study/scss/utils/_animations.scss</code>
          </li>
          <li>
            Search <code>js-in-view</code> / <code>in-view</code> in{" "}
            <code>study/js/main.beautified.js</code>
          </li>
          <li>
            Source: <code>components/lab/AppearDemo.tsx</code>
          </li>
        </ul>
      </section>
    </LabShell>
  );
}
