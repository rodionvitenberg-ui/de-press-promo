"use client";

import { useMemo, useState } from "react";
import { caseThemes } from "./tokens";

export type ThemeKey = keyof typeof caseThemes | "default";

const THEME_LIST: { key: ThemeKey; label: string }[] = [
  { key: "default", label: "Default" },
  { key: "tomorrowland", label: "Tomorrowland" },
  { key: "pioneer", label: "Pioneer" },
  { key: "ginetta", label: "Ginetta" },
  { key: "orw", label: "ORW" },
  { key: "navyPier", label: "Navy Pier" },
  { key: "cryptTv", label: "Crypt TV" },
];

/**
 * body[data-theme] analogue: CSS variables swap on hover/click of project titles.
 * Study: home cases data-theme + data-matcap on legacy home.
 */
export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<ThemeKey>("default");
  const [locked, setLocked] = useState(false);

  const style = useMemo(() => {
    if (theme === "default") {
      return {
        ["--theme-ui" as string]: "#e8ff47",
        ["--theme-scene" as string]: "#0c0c0c",
        ["--theme-fg" as string]: "#f2f0eb",
        ["--theme-muted" as string]: "#9a958c",
      };
    }
    const t = caseThemes[theme];
    return {
      ["--theme-ui" as string]: t.ui,
      ["--theme-scene" as string]: t.scene,
      ["--theme-fg" as string]: "#f2f0eb",
      ["--theme-muted" as string]: "rgba(242,240,235,0.65)",
    };
  }, [theme]);

  return (
    <div className="lab-theme" style={style} data-theme={theme}>
      <div className="lab-theme-stage">
        <p className="lab-theme-kicker">Featured projects</p>
        <h2 className="lab-theme-headline">
          Hover a title — scene + accent shift
        </h2>
        <p className="lab-theme-copy">
          Legacy home sets <code>body[data-theme]</code> and{" "}
          <code>Dog.GL.setMatcap(a,b)</code>. Here we only swap CSS variables
          (2D stand-in for matcap mood).
        </p>
        <ul className="lab-theme-list">
          {THEME_LIST.filter((t) => t.key !== "default").map((item) => (
            <li key={item.key}>
              <button
                type="button"
                className={theme === item.key ? "is-active" : ""}
                onMouseEnter={() => {
                  if (!locked) setTheme(item.key);
                }}
                onMouseLeave={() => {
                  if (!locked) setTheme("default");
                }}
                onClick={() => {
                  setTheme(item.key);
                  setLocked(true);
                }}
              >
                <span className="lab-theme-year">2018 — Today</span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
        <div className="lab-theme-actions">
          <button
            type="button"
            className="lab-theme-reset"
            onClick={() => {
              setLocked(false);
              setTheme("default");
            }}
          >
            Reset (leave list)
          </button>
          <span className="lab-theme-current">
            Active: <strong>{theme}</strong>
            {locked ? " · locked" : " · hover"}
          </span>
        </div>
      </div>
      <div className="lab-theme-swatch" aria-hidden>
        <div className="lab-theme-swatch-ui" />
        <div className="lab-theme-swatch-scene" />
      </div>
    </div>
  );
}
