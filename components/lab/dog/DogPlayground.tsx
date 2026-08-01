"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const DogScene = dynamic(() => import("./DogScene"), {
  ssr: false,
  loading: () => <div className="lab-dog-canvas lab-dog-canvas--loading" />,
});

const MATCAP_PRESETS = [
  { label: "0 / default", index: 0 },
  { label: "7 Navy-ish", index: 7 },
  { label: "8 MSI-ish", index: 8 },
  { label: "11", index: 11 },
  { label: "18 Tomorrow-ish", index: 18 },
];

/**
 * Controls for DogScene: matcap index, animation progress scrub, scroll link.
 */
export default function DogPlayground() {
  const [matcap, setMatcap] = useState(0);
  const [progress, setProgress] = useState(0.16);
  const [linkScroll, setLinkScroll] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);

  useEffect(() => {
    if (!linkScroll) return;
    const onScroll = () => {
      const max = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      const t = window.scrollY / max;
      setProgress(Math.min(1, Math.max(0, t)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [linkScroll]);

  return (
    <div className="lab-dog">
      <div className="lab-dog-stage">
        <DogScene
          matcapIndex={matcap}
          progress={progress}
          autoRotate={autoRotate && !linkScroll}
        />
      </div>

      <div className="lab-dog-controls">
        <label className="lab-dog-field">
          <span>Matcap index (setMatcap analogue)</span>
          <div className="lab-dog-presets">
            {MATCAP_PRESETS.map((p) => (
              <button
                key={p.index}
                type="button"
                className={matcap === p.index ? "is-active" : ""}
                onClick={() => setMatcap(p.index)}
              >
                {p.label}
              </button>
            ))}
          </div>
          <input
            type="range"
            min={0}
            max={24}
            value={matcap}
            onChange={(e) => setMatcap(Number(e.target.value))}
          />
        </label>

        <label className="lab-dog-field">
          <span>
            Animation progress: <strong>{progress.toFixed(2)}</strong>
          </span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={progress}
            disabled={linkScroll}
            onChange={(e) => setProgress(Number(e.target.value))}
          />
        </label>

        <label className="lab-dog-check">
          <input
            type="checkbox"
            checked={linkScroll}
            onChange={(e) => setLinkScroll(e.target.checked)}
          />
          Scrub progress with page scroll
        </label>

        <label className="lab-dog-check">
          <input
            type="checkbox"
            checked={autoRotate}
            onChange={(e) => setAutoRotate(e.target.checked)}
          />
          Auto-rotate (when not scroll-linked)
        </label>

        <p className="lab-dog-note">
          Model: <code>dog.glb</code> · textures from study mirror. Not full
          DogGL (custom shaders / Draco path / states). Orbit: drag · scroll
          zoom.
        </p>
      </div>

      {linkScroll ? (
        <div className="lab-dog-scroll-space" aria-hidden>
          <p>Scroll to scrub the dog…</p>
          <p>progress → rotation + bob</p>
          <p>Same idea as scroll-linked setAnimationProgress</p>
        </div>
      ) : null}
    </div>
  );
}
