/**
 * i18n core — zero-dependency (no relative imports) so it runs both inside
 * Next server components and under `node --experimental-strip-types`
 * (scripts/i18n-check.mjs).
 *
 * Approach: gettext-style dictionaries keyed by the exact source (Russian)
 * string. Legacy markup snapshots stay untouched; text nodes and localizable
 * attributes are mapped through the dictionary at render time. Missing keys
 * fall back to the source string, so a translation gap can never break layout.
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
/** Named fx display titles: placeholder name → source phrase. */
export const FX_PHRASES: Record<string, string> = {
  "home-hero": "Don't cry\nalone",
  "home-about":
    "We're crafting\nemotional\nexperiences aimed\nat improving\nresults",
  "about-intro": "We're just making Good Shit like it's 1996",
  "about-clients": "Selected clients",
  "about-swagger": "Our Swagger,\nHo we're sorry. Awards, right ?",
  "values-culture": "Because company culture is more than a ping pong table",
  "values-tgif": "No.\nIt is not your tgif happy hour either...",
  "values-hiring": "We’re constantly hiring new talent",
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

/** Rewrite bare internal routes so menu/footer links stay inside the locale. */
const INTERNAL_HREFS = ["/", "/about/", "/values/", "/contact/", "/safety/"];

function localizeHrefs(html: string, locale: Locale): string {
  if (locale === DEFAULT_LOCALE) return html;
  return html.replace(/\bhref="(\/[^"]*)"/g, (match, href: string) =>
    INTERNAL_HREFS.includes(href)
      ? `href="${localePath(locale, href)}"`
      : match,
  );
}

const LOCALIZABLE_ATTRS = "title|alt|placeholder|data-after";

/**
 * Map text nodes and localizable attribute values through the dictionary.
 * Only exact (trimmed) matches are replaced; everything else passes through,
 * so the default locale and untranslated strings render byte-identically.
 */
export function localizeMarkup(html: string, t: Translator): string {
  // Text nodes: ">core<" with the original surrounding whitespace preserved.
  html = html.replace(/>([^<>]+)</g, (match, inner: string) => {
    const core = inner.replace(/\s+/g, " ").trim();
    if (!core) return match;
    const translated = t(core);
    if (translated === core) return match;
    const lead = inner.slice(0, inner.length - inner.trimStart().length);
    const tail = inner.slice(inner.trimEnd().length);
    return `>${lead}${translated}${tail}<`;
  });

  // Attribute values (never URLs: title / alt / placeholder / data-after).
  html = html.replace(
    new RegExp(`\\b(${LOCALIZABLE_ATTRS})="([^"]*)"`, "g"),
    (match, attr: string, value: string) => {
      const core = value.replace(/\s+/g, " ").trim();
      if (!core) return match;
      const translated = t(core);
      if (translated === core) return match;
      return `${attr}="${translated}"`;
    },
  );

  return html;
}

/**
 * The contact page hides a JSON array of rotating sentences in
 * div.js-sentences (legacy main.js reads it). Translate each item and
 * re-serialize; compact output is fine for the JS consumer.
 */
export function localizeSentences(html: string, t: Translator): string {
  return html.replace(
    /(<div class="js-sentences[^"]*">)([\s\S]*?)(<\/div>)/g,
    (match, open: string, inner: string, close: string) => {
      try {
        const items = JSON.parse(inner) as unknown;
        if (!Array.isArray(items)) return match;
        const translated = items.map((item) =>
          typeof item === "string" ? t(item) : item,
        );
        return `${open}${JSON.stringify(translated)}${close}`;
      } catch {
        return match;
      }
    },
  );
}

export type FinalizeOptions = {
  markup: string;
  t: Translator;
  locale: Locale;
  /** Bare route of the page, e.g. "/" or "/about/" — for the switcher links. */
  path: string;
};

/**
 * Full pipeline for a legacy markup snapshot:
 * dictionary mapping → rotating sentences → fx blocks → language switcher
 * → internal hrefs.
 */
export function finalizeMarkup({
  markup,
  t,
  locale,
  path,
}: FinalizeOptions): string {
  let html = localizeMarkup(markup, t);
  html = localizeSentences(html, t);
  html = html.replace(/<!--DP:FX:([a-z0-9-]+)-->/g, (match, name: string) => {
    const phrase = FX_PHRASES[name];
    return phrase ? fxBlock(t(phrase)) : match;
  });
  // Hrefs first: the switcher ships final hrefs and must not be rewritten.
  html = localizeHrefs(html, locale);
  html = html.replace("<!--DP:LANGS-->", languageSwitcherHTML(locale, path));
  return html;
}

