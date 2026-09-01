import type { ReactNode } from "react";
import BootPage from "@/components/legacy/BootPage";
import {
  FX_PHRASES,
  fxBlock,
  languageSwitcherHTML,
  localePath,
} from "@/i18n/core";
import { DEFAULT_LOCALE, type Locale, type Translator } from "@/i18n/core";
import { getTranslator } from "@/i18n";

/**
 * JSX page renderer (originalization Phase 2) — replaces createLegacyPage.
 * A page module provides constants + a Content component; the DOM it renders
 * must be 1:1 with the legacy markup snapshot (verified by scripts/html-diff.mjs
 * against the captured baseline). The legacy boot (BootPage) keeps working on
 * top of this JSX until the own runtime lands.
 */

export type PageContentProps = {
  t: Translator;
  locale: Locale;
  /** Bare route of the page, e.g. "/" — for the footer language switcher. */
  path: string;
  /**
   * Localize a bare internal route ("/about/" → "/en/about/") — the JSX
   * equivalent of localizeHrefs in the markup pipeline. External URLs pass
   * through untouched.
   */
  href: (bare: string) => string;
};

export type PageModule = {
  BODY_CLASS: string;
  DATA_THEME: string;
  DATA_PAGE: string;
  PAGE_TITLE: string;
  Content(props: PageContentProps): ReactNode;
};

export type PageOptions = {
  /** Bare route of the page, e.g. "/" — for the footer language switcher. */
  path: string;
  /** Defaults to the site default locale (ru, served at bare paths). */
  locale?: Locale;
};

/** Render one page module + locale → page JSX. */
export function renderPage(mod: PageModule, options: PageOptions): ReactNode {
  const locale = options.locale ?? DEFAULT_LOCALE;
  return (
    <BootPage
      bodyClass={mod.BODY_CLASS}
      dataTheme={mod.DATA_THEME}
      dataPage={mod.DATA_PAGE}
      htmlLang={locale}
    >
      <mod.Content
        t={getTranslator(locale)}
        locale={locale}
        path={options.path}
        href={(bare) => localePath(locale, bare)}
      />
    </BootPage>
  );
}

/** Factory for static default-locale routes (`export default …`). */
export function createPage(mod: PageModule, options: PageOptions) {
  const node = renderPage(mod, options);
  return function Page() {
    return node;
  };
}

/**
 * fx headline block — reuses i18n/core.fxBlock, the exact generator the markup
 * pipeline used, so the letter/word DOM is byte-identical (modulo whitespace).
 */
export function Fx({
  name,
  className,
  t,
}: {
  name: keyof typeof FX_PHRASES;
  className: string;
  t: Translator;
}) {
  return (
    <p
      className={className}
      dangerouslySetInnerHTML={{ __html: fxBlock(t(FX_PHRASES[name])) }}
    />
  );
}

/**
 * Footer language switcher — reuses i18n/core.languageSwitcherHTML (the exact
 * items markup the snapshot pipeline emitted, including caret svg + hrefs).
 */
export function LangSwitcher({
  locale,
  path,
}: {
  locale: Locale;
  path: string;
}) {
  const inner =
    languageSwitcherHTML(locale, path).match(/<ul>\n([\s\S]*)\n\s*<\/ul>/)?.[1] ??
    "";
  return <ul dangerouslySetInnerHTML={{ __html: inner }} />;
}

/**
 * Translate a raw template text node like localizeMarkup did: the trimmed core
 * goes through the dictionary, single-space edges are preserved for positions
 * where the template had them (inline-adjacent — see scripts/html-diff.mjs).
 */
export function tx(t: Translator, raw: string): string {
  const core = raw.replace(/[ \t\n\r\f]+/g, " ").trim();
  if (!core) return raw;
  const lead = /^[ \t\n\r\f]/.test(raw) ? " " : "";
  const tail = /[ \t\n\r\f]$/.test(raw) ? " " : "";
  return `${lead}${t(core)}${tail}`;
}