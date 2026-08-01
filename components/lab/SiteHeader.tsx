"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useState } from "react";

export type NavItem = {
  href: string;
  label: string;
};

const DEFAULT_NAV: NavItem[] = [
  { href: "/lab/", label: "Lab" },
  { href: "/lab/playground/tokens/", label: "Tokens" },
  { href: "/lab/playground/appear/", label: "Appear" },
  { href: "/lab/playground/type/", label: "Type" },
  { href: "/lab/playground/chrome/", label: "Chrome" },
  { href: "/", label: "Legacy home" },
];

type SiteHeaderProps = {
  /** Wordmark text (not Dogstudio logo asset) */
  brand?: string;
  nav?: NavItem[];
  /** Extra class on outer header */
  className?: string;
};

/**
 * React port of site-header + fullscreen menu pattern (no WebGL dog).
 * Study: study/scss/partials/common/_header.scss, _menu.scss
 */
export default function SiteHeader({
  brand = "Study Lab",
  nav = DEFAULT_NAV,
  className = "",
}: SiteHeaderProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((v) => !v), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  return (
    <>
      <header className={`lab-chrome-header ${className}`.trim()}>
        <Link href="/lab/" className="lab-chrome-brand">
          {brand}
        </Link>
        <div className="lab-chrome-header-actions">
          <Link href="/" className="lab-chrome-meta-link">
            Legacy
          </Link>
          <button
            type="button"
            className="lab-chrome-menu-btn"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={toggle}
          >
            <span className="lab-chrome-menu-btn-label">
              {open ? "Close" : "Menu"}
            </span>
            <span className="lab-chrome-menu-btn-bars" aria-hidden>
              <i />
              <i />
            </span>
          </button>
        </div>
      </header>

      <div
        className={`lab-chrome-menu-back ${open ? "is-open" : ""}`}
        aria-hidden
        onClick={close}
      />

      <div
        id={panelId}
        className={`lab-chrome-menu ${open ? "is-open" : ""}`}
        role="dialog"
        aria-modal={open}
        aria-label="Navigation"
        hidden={!open}
      >
        <div className="lab-chrome-menu-inner">
          <p className="lab-chrome-menu-kicker">Navigate</p>
          <ul className="lab-chrome-menu-list">
            {nav.map((item, i) => (
              <li
                key={item.href}
                style={{ transitionDelay: open ? `${80 + i * 50}ms` : "0ms" }}
              >
                <Link href={item.href} onClick={close}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="lab-chrome-menu-foot">
            React menu — no Highway / dog.js. Pattern only.
          </p>
        </div>
      </div>
    </>
  );
}
