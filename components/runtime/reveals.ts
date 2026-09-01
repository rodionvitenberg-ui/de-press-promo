/**
 * In-view reveals + lazy images — port of the legacy observer/lozad pair.
 * `.js-in-view` → `.in-view` (CSS drives the appear animations),
 * `.js-lazy` (+ `source[data-srcset]` in the same `<picture>`) → real URLs.
 */
export type RevealsHandle = { destroy: () => void };

function loadLazyElement(img: HTMLElement): void {
  const src = img.getAttribute("data-src");
  if (src) img.setAttribute("src", src);
  const srcset = img.getAttribute("data-srcset");
  if (srcset) img.setAttribute("srcset", srcset);
  const picture = img.closest("picture");
  if (picture) {
    picture.querySelectorAll("source[data-srcset]").forEach((source) => {
      const value = source.getAttribute("data-srcset");
      if (value) source.setAttribute("srcset", value);
    });
  }
}

export function initReveals(): RevealsHandle {
  const inView = new IntersectionObserver(
    (entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0 },
  );
  document
    .querySelectorAll(".js-in-view:not(.in-view)")
    .forEach((el) => inView.observe(el));

  const loadIfNear = (el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    const margin = 300;
    if (
      rect.top < window.innerHeight + margin &&
      rect.bottom > -margin &&
      rect.left < window.innerWidth + margin &&
      rect.right > -margin
    ) {
      loadLazyElement(el);
      return true;
    }
    return false;
  };

  const lazy = new IntersectionObserver(
    (entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        loadLazyElement(entry.target as HTMLElement);
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: "300px" },
  );
  document.querySelectorAll(".js-lazy").forEach((el) => {
    // Zero-sized lazy targets (no src yet) may never report an intersection —
    // preload everything already near the viewport, IO covers the rest.
    if (!loadIfNear(el as HTMLElement)) lazy.observe(el);
  });

  return {
    destroy() {
      inView.disconnect();
      lazy.disconnect();
    },
  };
}
