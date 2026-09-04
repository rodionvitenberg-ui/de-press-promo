import {
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
 * Dictionaries are keyed by stable dot-keys shared across all 10 locales,
 * and every dictionary is complete (ru.json included — the default locale
 * resolves through its dictionary like everyone else). Missing keys fall
 * back to the key itself.
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

export {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  LOCALES,
  isLocale,
  localeFromHeader,
  localePath,
} from "./core";
export type { Locale } from "./core";

