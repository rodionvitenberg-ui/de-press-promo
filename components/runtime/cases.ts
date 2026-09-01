import { easeOutCubic, tween, type TweenHandle } from "./easing";
import type { Island } from "./island";

/**
 * Home cases — exact port of the legacy `Home` module (xl desktop only):
 * hover on a case title swaps `body[data-theme]`, tweens the island matcap
 * (1s Cubic.easeOut) and reveals the matching `.home-cases-scene`;
 * scrolling out of the cases range fakes a list leave and drives the
 * `on-top`/`is-sticky`/`on-bottom` classes of `.home-cases-scenes`;
 * `.home-background img` fades out over a 300px window at 40% page height.
 */
export type CasesHandle = { destroy: () => void };

/** Legacy `utils/mq` xl breakpoint (ruler--1190). */
const XL_MIN = 1190;

export function initCases(island: Island): CasesHandle {
  const cases = document.querySelector(".home-cases");
  const list = document.querySelector<HTMLElement>(".home-cases-list");
  const scenes = document.querySelector(".home-cases-scenes");
  const back = document.querySelector<HTMLElement>(".home-background img");
  if (!cases || !list || !scenes) return { destroy: () => {} };

  const touch =
    (typeof window.matchMedia === "function" &&
      window.matchMedia("(pointer: coarse)").matches) ||
    "ontouchstart" in window;
  if (window.innerWidth < XL_MIN || touch) return { destroy: () => {} };

  const items = Array.from(scenes.querySelectorAll(".home-cases-scene"));
  const titles = Array.from(list.querySelectorAll<HTMLAnchorElement>("a"));

  let casesMin = 0;
  let casesMax = 0;
  let currentScene: Element | null = null;
  let mouseTimeout: number | undefined;
  let matcapTween: TweenHandle | null = null;
  const matcapProgress = { value: 0 };

  const onAnimate = () => {
    matcapTween?.cancel();
    matcapTween = tween(
      matcapProgress,
      1000,
      0,
      1,
      easeOutCubic,
      () => island.GL.setMatcapProgress(matcapProgress.value),
    );
  };

  const onListLeave = () => {
    island.GL.setMatcap(1, 0);
    document.body.removeAttribute("data-theme");
    if (currentScene) {
      currentScene.classList.add("is-hidden");
      currentScene.classList.remove("has-delay");
      currentScene.classList.remove("is-visible");
    }
    currentScene = null;
    if (mouseTimeout) window.clearTimeout(mouseTimeout);
    onAnimate();
  };

  const onTitleEnter = (e: Event) => {
    let previous: Element | null = null;
    if (mouseTimeout) window.clearTimeout(mouseTimeout);
    mouseTimeout = window.setTimeout(() => {
      if (currentScene) {
        previous = currentScene;
        currentScene.classList.add("is-hidden");
        currentScene.classList.remove("has-delay");
        currentScene.classList.remove("is-visible");
      }
      const title = e.target as HTMLElement;
      const index = titles.indexOf(title as HTMLAnchorElement);
      if (index < 0) return;
      currentScene = items[index] ?? null;

      const theme = title.dataset.theme;
      const matcap = (title.dataset.matcap ?? "").split(",");
      if (matcap.length >= 2) {
        island.GL.setMatcap(Number(matcap[0]), Number(matcap[1]));
      }
      if (theme) document.body.setAttribute("data-theme", theme);

      if (currentScene) {
        currentScene.classList.add("is-visible");
        currentScene.classList.remove("has-delay");
        currentScene.classList.remove("is-hidden");
        if (previous) currentScene.classList.add("has-delay");
      }
      onAnimate();
    }, 100);
  };

  const onResize = () => {
    const box = cases.getBoundingClientRect();
    const scroll = window.pageYOffset;
    const viewport = window.innerHeight;
    casesMin = box.top + scroll;
    casesMax = box.bottom + scroll - viewport;
  };

  const onCaseScroll = () => {
    const S = window.pageYOffset;
    if ((S - casesMin) * (S - casesMax) <= 0) {
      scenes.classList.add("on-top");
      scenes.classList.add("is-sticky");
      scenes.classList.remove("on-bottom");
    } else {
      scenes.classList.remove("on-top");
      scenes.classList.remove("is-sticky");
      if (S > casesMax) scenes.classList.add("on-bottom");
    }
    if (currentScene) onListLeave();
  };

  const onBackScroll = () => {
    if (!back) return;
    const S = window.pageYOffset;
    const H = island.pageHeight - window.innerHeight;
    const B = H * 0.4;
    const L = B + 300;
    if (S >= B && S < L) {
      back.style.opacity = String(Math.max(1 - (S - B) / 300, 0));
    } else if (S >= L) {
      back.style.opacity = "0";
    } else {
      back.style.opacity = "1";
    }
  };

  const onScroll = () => {
    onCaseScroll();
    onBackScroll();
  };

  const titleHandlers = titles.map((title) => {
    const handler = (e: Event) => onTitleEnter(e);
    title.addEventListener("mouseenter", handler);
    return [title, handler] as const;
  });
  list.addEventListener("mouseleave", onListLeave);
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize);
  onResize();

  return {
    destroy() {
      if (mouseTimeout) window.clearTimeout(mouseTimeout);
      matcapTween?.cancel();
      for (const [title, handler] of titleHandlers) {
        title.removeEventListener("mouseenter", handler);
      }
      list.removeEventListener("mouseleave", onListLeave);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    },
  };
}
