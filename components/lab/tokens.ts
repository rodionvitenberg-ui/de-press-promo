/**
 * Design tokens inspired by study/scss/utils/_variables.scss
 * Study-only palette — do not ship Dogstudio brand as your own.
 */

export const colors = {
  white: "#ffffff",
  black: "#000000",
  body: "#131419",
  text: "#131419",
  red: "#ff4940",
  orange: "#e43333",
  grey: "#dbdff4",
  greyAlt: "#f6f6f6",
  blue: "#363c5c",
  blueLighter: "#dbdff4",
  blueLight: "#9194a8",
  blueDark: "#131419",
  blueInteract: "#29a6dc",
  blueA: "#bbc2e5",
  blueB: "#b6c1fa",
  blueC: "#626782",
  blueD: "#717694",
  blueE: "#646d9e",
  blueF: "#a0a8dc",
  blueG: "#0e101a",
  bodyValues: "#fb483f",
  bodyCareers: "#eef1f3",
  textLight: "rgba(160, 168, 220, 0.7)",
  fadedText: "rgba(219, 223, 244, 0.4)",
} as const;

/** Sample case-theme accents from $themes in variables.scss */
export const caseThemes = {
  tomorrowland: { ui: "#c1c5d7", scene: "#14161f" }, // vault-like sample
  pioneer: { ui: "#66e8ba", scene: "#160218" },
  ginetta: { ui: "#ff0069", scene: "#3e3e3e" },
  orw: { ui: "#857551", scene: "#680000" },
  navyPier: { ui: "#29a6dc", scene: "#0a1628" },
  cryptTv: { ui: "#ff2131", scene: "#131313" },
} as const;

export const typeRoles = {
  baseSizePx: 14,
  lineHeightBody: 2.1,
  display: {
    family: "serif",
    sizes: { h2: 50, h3: 30 },
  },
  ui: {
    family: "sans",
    sizes: { body: 14, meta: 13, small: 12 },
  },
} as const;

export const fonts = {
  /** Self-hosted originals under public theme (study). Lab uses fallbacks by default. */
  heebo: "Heebo, system-ui, sans-serif",
  gilroy: "Gilroy, system-ui, sans-serif",
  sectra: '"GT Sectra Display", Georgia, "Times New Roman", serif',
  labSans: "var(--lab-font)",
  labSerif: "var(--lab-serif)",
} as const;
