import {
  finalizeMarkup,
  makeTranslator,
  type Locale,
  type Translator,
} from "./core";

import de from "./dictionaries/de.json";
import en from "./dictionaries/en.json";
import es from "./dictionaries/es.json";
import ja from "./dictionaries/ja.json";
import ko from "./dictionaries/ko.json";
import pl from "./dictionaries/pl.json";
import pt from "./dictionaries/pt.json";
import ru from "./dictionaries/ru.json";
import uk from "./dictionaries/uk.json";
import zh from "./dictionaries/zh.json";

/**
 * Dictionaries are gettext-style: keys are the exact normalized source
 * (Russian) strings. ru.json holds only intentional overrides (fx display
 * titles); every other string renders byte-identically for the default
 * locale. Missing keys fall back to the source string.
 */
const DICTIONARIES: Record<Locale, Record<string, string>> = {
  en,
  de,
  es,
  pl,
  pt,
  ru,
  uk,
  zh,
  ja,
  ko,
};

export function getTranslator(locale: Locale): Translator {
  return makeTranslator(DICTIONARIES[locale]);
}

export { DEFAULT_LOCALE, LOCALES, isLocale, localePath } from "./core";
export type { Locale } from "./core";

/** Finalize a legacy markup snapshot for the given locale. */
export function finalizeLegacyMarkup(options: {
  markup: string;
  locale: Locale;
  path: string;
}): string {
  return finalizeMarkup({
    markup: options.markup,
    t: getTranslator(options.locale),
    locale: options.locale,
    path: options.path,
  });
}
