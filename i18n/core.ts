/**
 * i18n core — zero-dependency (no relative imports) so it runs both inside
 * Next server components and under `node --experimental-strip-types`
 * (scripts/i18n-check.mjs).
 *
 * Approach: dictionaries keyed by stable dot-keys (home.hero.title, cases.*,
 * …) shared by all 10 locales; each dictionary is complete (ru included).
 * Missing keys fall back to the key itself, so a translation gap is loud
 * in review but never breaks layout worse than that.
 */

export const LOCALES = [
  "en",
  "de",
  "es",
  "pl",
  "pt",
  "ru",
  "uk",
  "zh",
  "ja",
  "ko",
] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "ru";

/** Endonyms — the switcher always shows a language in its own words. */
export const NATIVE_NAMES: Record<Locale, string> = {
  ru: "Русский",
  en: "English",
  de: "Deutsch",
  es: "Español",
  pl: "Polski",
  pt: "Português",
  uk: "Українська",
  zh: "中文",
  ja: "日本語",
  ko: "한국어",
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** Default locale lives at the bare path; the rest under /{locale}/… */
export function localePath(locale: Locale, path: string): string {
  return locale === DEFAULT_LOCALE ? path : `/${locale}${path}`;
}

export type Translator = (source: string) => string;

export function makeTranslator(dict: Record<string, string>): Translator {
  return (source) => dict[source] ?? source;
}

/**
 * CSS ships per-letter transition delays only up to `.fx-letter--49`
 * (original markup never exceeded it). Longer translations wrap the index so
 * the reveal wave keeps cascading instead of snapping to 0s delay.
 */
const FX_MAX_INDEX = 49;

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Rebuild a `.fx-parent` letter animation block from a phrase.
 * Lines are separated by "\n", words inside a line by single spaces.
 * Emits the exact DOM shape of the original snapshots:
 * fx-word (inline-flex) > fx-letter spans, <br> between lines.
 */
export function fxBlock(phrase: string): string {
  const lines = phrase
    .split("\n")
    .map((line) => line.split(" ").filter(Boolean))
    .filter((words) => words.length > 0);

  let index = 0;
  const html = lines
    .map((words) =>
      words
        .map((word) => {
          const letters = [...word]
            .map((letter) => {
              index += 1;
              const n = ((index - 1) % FX_MAX_INDEX) + 1;
              return `                                  <span class="fx-letter fx-letter--${n}">${escapeHtml(letter)}</span>`;
            })
            .join("\n");
          return `                      <span class="fx-word">\n${letters}\n                  </span>`;
        })
        .join("\n\n"),
    )
    .join("<br>\n");
  return html;
}
/** Named fx display titles: placeholder name → dictionary key. */
export const FX_PHRASES: Record<string, string> = {
  "home-hero": "fx.homeHero",
  "home-about":
    "fx.homeAbout",
  "about-intro": "fx.aboutIntro",
  "about-swagger": "fx.aboutSwagger",
  "values-culture": "fx.valuesCulture",
  "values-tgif": "fx.valuesTgif",
  "values-hiring": "fx.valuesHiring",
};

const CARET_SVG = `<span class="svg svg-caret-right">
  \t<svg width="5" height="9">
    \t<use xlink:href="/static/assets/spritesheet.svg#caret-right"></use> 
  \t</svg>
  </span>`;

/** Footer language switcher: one entry per locale, active first. */
export function languageSwitcherHTML(current: Locale, path: string): string {
  const items = LOCALES.map((locale) => {
    const active = locale === current;
    const href = localePath(locale, path);
    return `              <li${active ? ' class="is-active"' : ""}>
                  <a href="${href}" title="${NATIVE_NAMES[locale]}" data-router-disabled>
                    ${active ? `${CARET_SVG}\n                    ` : ""}${NATIVE_NAMES[locale]}

                                      </a>
                </li>`;
  });
  return `\n                                <ul>\n${items.join("\n")}\n                          </ul>\n                  `;
}


