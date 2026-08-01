"use client";

import { useCallback, useEffect, useId, useState } from "react";

type ShowreelModalProps = {
  /** Vimeo id — original home showreel; needs network */
  vimeoId?: string;
  posterSrc?: string;
  label?: string;
};

/**
 * Open/close showreel overlay — Plyr/Vimeo pattern without the full main.js stack.
 * Study: .js-showreel, .js-plyr on legacy home.
 */
export default function ShowreelModal({
  vimeoId = "836218697",
  posterSrc = "/app/themes/portfolio-2018/static/assets/images/shared/cover.jpg",
  label = "Watch showreel",
}: ShowreelModalProps) {
  const [open, setOpen] = useState(false);
  const titleId = useId();

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  return (
    <div className="lab-showreel">
      <button
        type="button"
        className="lab-showreel-trigger"
        onClick={() => setOpen(true)}
      >
        <span className="lab-showreel-trigger-visual">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={posterSrc} alt="" />
          <span className="lab-showreel-play" aria-hidden>
            ▶
          </span>
        </span>
        <span className="lab-showreel-trigger-label">{label}</span>
      </button>

      {open ? (
        <div
          className="lab-showreel-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          <button
            type="button"
            className="lab-showreel-backdrop"
            aria-label="Close showreel"
            onClick={close}
          />
          <div className="lab-showreel-panel">
            <div className="lab-showreel-panel-bar">
              <h2 id={titleId}>Showreel</h2>
              <button type="button" onClick={close} className="lab-showreel-close">
                Close
              </button>
            </div>
            <div className="lab-showreel-frame">
              <iframe
                title="Showreel"
                src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1`}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            </div>
            <p className="lab-showreel-note">
              Needs network (Vimeo). Poster is local. Original: Plyr + data-plyr-*.
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
