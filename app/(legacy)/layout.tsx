import type { ReactNode } from "react";

/**
 * Legacy Dogstudio runtime shell.
 * main.css is linked (not imported) so url(../assets/...) keeps working.
 */
export default function LegacyLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <link
        rel="stylesheet"
        href="/app/themes/portfolio-2018/static/css/main.css"
      />
      <link
        rel="stylesheet"
        href="/app/themes/portfolio-2018/static/css/depress.css"
      />
      {children}
    </>
  );
}
