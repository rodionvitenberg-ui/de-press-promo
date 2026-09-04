import type { ReactNode } from "react";
import RuntimeBoot from "@/components/runtime/RuntimeBoot";
import {
  FX_PHRASES,
  fxBlock,
  languageSwitcherHTML,
} from "@/i18n/core";
import { DEFAULT_LOCALE, type Locale, type Translator } from "@/i18n/core";
import { getTranslator } from "@/i18n";

/**
 * JSX page renderer (originalization Phase 2). A page module provides
 * constants + a Content component; the DOM it renders is 1:1 with the legacy
 * markup snapshot (verified against reference screenshots once the html-diff
 * guard retired in A3). RuntimeBoot boots the own runtime on top of this JSX.
 */

export type PageContentProps = {
  t: Translator;
  locale: Locale;
  /** Bare route of the page, e.g. "/" — for the footer language switcher. */
  path: string;
  /**
   * Resolve a bare internal route ("/about/" → "/about/"). All locales share
   * the same clean URLs — the active language comes from the dp-locale cookie
   * (proxy.ts), so no route is ever prefixed with a locale segment. External
   * URLs pass through untouched.
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
  /** Page locale; defaults to the site fallback locale (en). */
  locale?: Locale;
};

/** Render one page module + locale → page JSX. */
export function renderPage(mod: PageModule, options: PageOptions): ReactNode {
  const locale = options.locale ?? DEFAULT_LOCALE;
  return (
    <RuntimeBoot
      bodyClass={mod.BODY_CLASS}
      dataTheme={mod.DATA_THEME}
      dataPage={mod.DATA_PAGE}
      htmlLang={locale}
    >
      <mod.Content
        t={getTranslator(locale)}
        locale={locale}
        path={options.path}
        href={(bare) => bare}
      />
    </RuntimeBoot>
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