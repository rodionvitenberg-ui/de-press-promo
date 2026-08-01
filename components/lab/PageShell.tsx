import type { ReactNode } from "react";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";

type PageShellProps = {
  /** Subtle page tint (values red, careers grey, …) */
  tone?: "default" | "values" | "careers" | "contact";
  children: ReactNode;
  footerNote?: string;
};

/**
 * Shared chrome for React page shells — header/menu + main + footer.
 * Study analogue of WP page templates without dog.js / Highway.
 */
export default function PageShell({
  tone = "default",
  children,
  footerNote,
}: PageShellProps) {
  return (
    <div className={`lab-page lab-page--${tone}`}>
      <SiteHeader brand="Study Lab" />
      <main className="lab-page-main">{children}</main>
      <div className="lab-page-footer-wrap">
        <SiteFooter note={footerNote} />
      </div>
    </div>
  );
}
