"use client";

import { useEffect, useRef } from "react";

const ITEMS = [
  "Scroll-triggered fade + rise — same idea as .appear-fade-up",
  "IntersectionObserver instead of the original main.js in-view module",
  "Stagger via CSS transition-delay on siblings",
  "Keep easing close to original cubic-bezier feel",
];

/**
 * Minimal React port of Dogstudio “in-view / appear” pattern.
 * Study: study/scss/utils/_animations.scss + .js-in-view in main.beautified.js
 */
export default function AppearDemo() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const boxes = root.querySelectorAll<HTMLElement>(".appear-box");
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" },
    );

    boxes.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div ref={rootRef}>
      <p className="appear-hint">
        Scroll down. Boxes enter once — mirror of{" "}
        <code>.js-in-view</code> + <code>.appear-fade-up</code> without GSAP.
      </p>
      <div className="appear-stack" style={{ minHeight: "40vh" }}>
        {/* spacer to force scroll on short viewports */}
      </div>
      <div className="appear-stack">
        {ITEMS.map((text) => (
          <div key={text} className="appear-box">
            {text}
          </div>
        ))}
      </div>
      <div className="appear-stack" style={{ minHeight: "50vh" }} />
      <div className="appear-stack">
        <div className="appear-box">
          Another wave lower on the page — observe / unobserve pattern.
        </div>
      </div>
    </div>
  );
}
