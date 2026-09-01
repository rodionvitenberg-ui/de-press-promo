"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Runtime asset root; the legacy bundle concatenated it with "/static/..." paths.
const THEME = "";

export type RuntimeBootProps = {
  bodyClass: string;
  dataTheme: string;
  dataPage: string;
  children: ReactNode;
  /** Sync <html lang> with the active locale (root layout ships "ru"). */
  htmlLang?: string;
};

/**
 * Page shell: sets the body class/theme/page, syncs <html lang> and boots the
 * own runtime (components/runtime/boot). React does not re-render this tree
 * after mount; the runtime owns the DOM after boot.
 *
 * StrictMode-safe: dev double-mount destroys the first runtime. The async boot
 * may also resolve after cleanup already ran — the `destroyed` flag destroys
 * such a late handle instead of leaking it.
 */
export default function RuntimeBoot({
  bodyClass,
  dataTheme,
  dataPage,
  children,
  htmlLang,
}: RuntimeBootProps) {
  const runtimeRef = useRef<{ destroy: () => void } | null>(null);

  useEffect(() => {
    let destroyed = false;

    if (htmlLang) {
      document.documentElement.lang = htmlLang;
    }

    const prevClass = document.body.className;
    const prevTheme = document.body.getAttribute("data-theme");
    const prevPage = document.body.getAttribute("data-page");

    document.body.className = bodyClass;
    document.body.setAttribute("data-theme", dataTheme);
    document.body.setAttribute("data-page", dataPage);

    window.Site = { assetsRoot: THEME };

    (async () => {
      const { bootRuntime } = await import("./boot");
      const handle = await bootRuntime({ dataPage });
      if (destroyed) {
        handle.destroy();
        return;
      }
      runtimeRef.current = handle;
    })().catch((err) => {
      console.error("runtime boot failed:", err);
    });

    return () => {
      destroyed = true;
      runtimeRef.current?.destroy();
      runtimeRef.current = null;
      document.body.className = prevClass;
      if (prevTheme) document.body.setAttribute("data-theme", prevTheme);
      else document.body.removeAttribute("data-theme");
      if (prevPage) document.body.setAttribute("data-page", prevPage);
      else document.body.removeAttribute("data-page");
    };
  }, [bodyClass, dataTheme, dataPage, htmlLang]);

  return (
    <div className="boot-page-root" suppressHydrationWarning>
      {children}
    </div>
  );
}
