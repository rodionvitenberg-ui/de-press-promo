import type { ReactNode } from "react";
import BootPage from "./BootPage";
import { finalizeLegacyMarkup } from "@/i18n";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/core";

export type LegacyMarkupModule = {
  BODY_CLASS: string;
  DATA_THEME: string;
  DATA_PAGE: string;
  MARKUP: string;
  PAGE_TITLE: string;
};

export type LegacyPageOptions = {
  /** Bare route of the page, e.g. "/" — for the footer language switcher. */
  path: string;
  /** Defaults to the site default locale (ru, served at bare paths). */
  locale?: Locale;
};

/**
 * Legacy page renderer: one markup module + locale → page JSX.
 * The markup snapshot is localized through the gettext-style dictionaries
 * (text nodes, attributes, fx display titles, language switcher).
 */
export function renderLegacyPage(
  mod: LegacyMarkupModule,
  options: LegacyPageOptions,
): ReactNode {
  const locale = options.locale ?? DEFAULT_LOCALE;
  const markup = finalizeLegacyMarkup({
    markup: mod.MARKUP,
    locale,
    path: options.path,
  });
  return (
    <BootPage
      bodyClass={mod.BODY_CLASS}
      dataTheme={mod.DATA_THEME}
      dataPage={mod.DATA_PAGE}
      markup={markup}
      htmlLang={locale}
    />
  );
}

/** Factory for static default-locale routes (`export default …`). */
export function createLegacyPage(
  mod: LegacyMarkupModule,
  options: LegacyPageOptions,
) {
  const node = renderLegacyPage(mod, options);
  return function LegacyRoutePage() {
    return node;
  };
}
