import type { ReactNode } from "react";

/**
 * Legacy runtime shell, shared by app/(legacy)/layout.tsx and the root
 * app/not-found.tsx (the 404 renders outside the (legacy) group, inside the
 * minimal root layout).
 *
 * main.css is linked (not imported) so url(../assets/...) keeps working.
 *
 * The page-curtain div and the inline boot-state script sit ahead of the page
 * markup: the curtain must exist and cover the screen before the first paint
 * of a navigation-entered page, and the loader cover before the first paint
 * of a direct open.
 */

/**
 * Runs inline, before the page markup parses. /safety/ is runtime-less — a
 * stored nav flag is dropped there. Otherwise a stored flag (set by the
 * leave-curtain on the previous page) marks `dp-nav-in` — the new page opens
 * already covered by the curtain; without a flag `dp-boot-load` shows the
 * loader cover from the first paint. The flag is consumed here — the runtime
 * reads only the html class (runtime/transition.ts).
 */
const BOOT_STATE_SCRIPT = `(function(){try{if(/\\/safety\\/?$/.test(location.pathname)){sessionStorage.removeItem("dp-nav");return;}if(sessionStorage.getItem("dp-nav")==="1"){sessionStorage.removeItem("dp-nav");document.documentElement.classList.add("dp-nav-in");}else{document.documentElement.classList.add("dp-boot-load");}}catch(e){}})();`;

export function LegacyShell({ children }: { children: ReactNode }) {
  return (
    <>
      <link
        rel="stylesheet"
        href="/static/css/main.css"
      />
      <link
        rel="stylesheet"
        href="/static/css/depress.css"
      />
      <div className="page-curtain" aria-hidden="true" />
      <script dangerouslySetInnerHTML={{ __html: BOOT_STATE_SCRIPT }} />
      {children}
    </>
  );
}
