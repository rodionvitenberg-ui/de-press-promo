"use client";

import { useEffect, useRef } from "react";

const THEME = "/app/themes/portfolio-2018";
const JS = `${THEME}/static/js`;

export type DogstudioPageProps = {
  bodyClass: string;
  dataTheme: string;
  dataPage: string;
  markup: string;
};

declare global {
  interface Window {
    Dogstudio?: { theme_link: string };
    disable_dog?: boolean;
    disable_motion?: boolean;
    Detectizr?: {
      device: { type: string };
    };
    DogGL?: unknown;
  }
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[data-dogstudio-src="${src}"]`,
    );
    if (existing) {
      if (existing.dataset.loaded === "1") resolve();
      else existing.addEventListener("load", () => resolve(), { once: true });
      return;
    }
    const el = document.createElement("script");
    el.src = src;
    el.async = false;
    el.dataset.dogstudioSrc = src;
    el.onload = () => {
      el.dataset.loaded = "1";
      resolve();
    };
    el.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(el);
  });
}

function supportsWasm(): boolean {
  try {
    if (
      typeof WebAssembly === "object" &&
      typeof WebAssembly.instantiate === "function"
    ) {
      const module = new WebAssembly.Module(
        Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00),
      );
      if (module instanceof WebAssembly.Module) {
        return new WebAssembly.Instance(module) instanceof WebAssembly.Instance;
      }
    }
  } catch {
    /* no wasm */
  }
  return false;
}

function applyDeviceFlags() {
  window.disable_dog = false;
  window.disable_motion = false;

  const type = window.Detectizr?.device?.type;
  if (type === "mobile") {
    document.documentElement.classList.add("disable-dog");
    window.disable_dog = true;
  }
  if (type === "tablet" || type === "mobile") {
    document.documentElement.classList.add("disable-motion");
    window.disable_motion = true;
  }
}

function fallbackWithoutDog() {
  document.body.classList.remove("lock-scroll");
  document.querySelector(".site-loader")?.classList.add("is-hidden");
  document.querySelectorAll(".js-in-view").forEach((el) => {
    el.classList.add("in-view");
  });
}

/**
 * Host for an original Dogstudio page runtime.
 * Injects markup once and boots detectizr → dog.js → main.js.
 * React does not re-render this tree after mount.
 */
export default function DogstudioPage({
  bodyClass,
  dataTheme,
  dataPage,
  markup,
}: DogstudioPageProps) {
  const booted = useRef(false);

  useEffect(() => {
    if (booted.current) return;
    booted.current = true;

    const prevClass = document.body.className;
    const prevTheme = document.body.getAttribute("data-theme");
    const prevPage = document.body.getAttribute("data-page");

    document.body.className = bodyClass;
    document.body.setAttribute("data-theme", dataTheme);
    document.body.setAttribute("data-page", dataPage);

    window.Dogstudio = { theme_link: THEME };

    let cancelled = false;

    (async () => {
      try {
        await loadScript(`${JS}/detectizr.js`);
        await loadScript(`${JS}/modernizr.js`);
        if (cancelled) return;

        applyDeviceFlags();

        const wasm = supportsWasm();
        if (!wasm) {
          console.warn("WebAssembly not supported — dog disabled");
          fallbackWithoutDog();
          return;
        }

        if (!window.disable_dog) {
          await loadScript(`${JS}/dog.js`);
          if (cancelled) return;
        }

        await loadScript(`${JS}/main.js`);
      } catch (err) {
        console.error("Dogstudio boot failed:", err);
        fallbackWithoutDog();
      }
    })();

    return () => {
      cancelled = true;
      document.body.className = prevClass;
      if (prevTheme) document.body.setAttribute("data-theme", prevTheme);
      else document.body.removeAttribute("data-theme");
      if (prevPage) document.body.setAttribute("data-page", prevPage);
      else document.body.removeAttribute("data-page");
    };
  }, [bodyClass, dataTheme, dataPage]);

  return (
    <div
      className="dogstudio-page-root"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}
