import type { ReactNode } from "react";

/**
 * Legacy runtime shell.
 * main.css is linked (not imported) so url(../assets/...) keeps working.
 */
export default function LegacyLayout({ children }: { children: ReactNode }) {
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
      {children}
    </>
  );
}
