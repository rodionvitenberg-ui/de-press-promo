"use client";

import { useCallback, useRef, useState } from "react";

export type SliderSlide = {
  src: string;
  src2x?: string;
  caption: string;
  alt?: string;
};

type ImageSliderProps = {
  slides: SliderSlide[];
};

/**
 * Horizontal drag/scroll image strip — React stand-in for careers tiny-slider.
 * Study: study/scss/partials/careers/_image-slider.scss
 */
export default function ImageSlider({ slides }: ImageSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ active: boolean; startX: number; scroll: number }>({
    active: false,
    startX: 0,
    scroll: 0,
  });
  const [dragging, setDragging] = useState(false);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    const el = trackRef.current;
    if (!el) return;
    drag.current = {
      active: true,
      startX: e.clientX,
      scroll: el.scrollLeft,
    };
    setDragging(true);
    el.setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!drag.current.active || !trackRef.current) return;
    const dx = e.clientX - drag.current.startX;
    trackRef.current.scrollLeft = drag.current.scroll - dx;
  }, []);

  const endDrag = useCallback((e: React.PointerEvent) => {
    if (!drag.current.active) return;
    drag.current.active = false;
    setDragging(false);
    try {
      trackRef.current?.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
  }, []);

  return (
    <div
      className={`lab-slider ${dragging ? "is-dragging" : ""}`}
      aria-label="Image carousel"
    >
      <div
        ref={trackRef}
        className="lab-slider-track"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {slides.map((slide, i) => (
          <figure key={slide.src} className="lab-slider-slide">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={slide.src}
              srcSet={
                slide.src2x ? `${slide.src} 1x, ${slide.src2x} 2x` : undefined
              }
              alt={slide.alt ?? slide.caption}
              draggable={false}
            />
            <figcaption>
              <span className="lab-slider-index">
                {String(i + 1).padStart(2, "0")}
              </span>
              {slide.caption}
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="lab-slider-hint">Drag or scroll horizontally</p>
    </div>
  );
}
