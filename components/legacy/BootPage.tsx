"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Runtime asset root; the legacy bundle concatenated it with "/static/..." paths.
const THEME = "";

export type BootPageProps = {
  bodyClass: string;
  dataTheme: string;
  dataPage: string;
  /**
   * Raw markup snapshot (legacy template renderer). When omitted, the page
   * renders real JSX `children` inside the same root (components/pages).
   */
  markup?: string;
  children?: ReactNode;
  /** Sync <html lang> with the active locale (root layout ships "ru"). */
  htmlLang?: string;
};

/**
 * Page shell: sets the body class/theme/page, syncs <html lang> and boots the
 * own runtime (components/runtime/boot). The legacy main.js/detectizr/
 * modernizr vendor bundle is no longer loaded (plan A2). React does not
 * re-render this tree after mount; the runtime owns the DOM after boot.
 */
export default function BootPage({
  bodyClass,
  dataTheme,
  dataPage,
  markup,
  children,
  htmlLang,
}: BootPageProps) {
  const booted = useRef(false);
  const runtimeRef = useRef<{ destroy: () => void } | null>(null);

  useEffect(() => {
    if (booted.current) return;
    booted.current = true;

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
      const { bootRuntime } = await import("../runtime/boot");
      runtimeRef.current = await bootRuntime({ dataPage });
    })().catch((err) => {
      console.error("runtime boot failed:", err);
    });

    return () => {
      runtimeRef.current?.destroy();
      runtimeRef.current = null;
      document.body.className = prevClass;
      if (prevTheme) document.body.setAttribute("data-theme", prevTheme);
      else document.body.removeAttribute("data-theme");
      if (prevPage) document.body.setAttribute("data-page", prevPage);
      else document.body.removeAttribute("data-page");
    };
  }, [bodyClass, dataTheme, dataPage, htmlLang]);

  if (markup !== undefined) {
    return (
      <div
        className="boot-page-root"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: markup }}
      />
    );
  }
  return (
    <div className="boot-page-root" suppressHydrationWarning>
      {children}
    </div>
  );
}
