"use client";

import { useEffect, useSyncExternalStore } from "react";
import RuntimeBoot from "@/components/runtime/RuntimeBoot";
import {
  DEFAULT_LOCALE,
  getTranslator,
  isLocale,
  localePath,
  type Locale,
} from "@/i18n";
import notFoundPage from "./not-found";

/**
 * 404 shell with URL-based locale resolution. The root app/not-found.tsx has
 * no route params (and an unmatched URL carries no locale contract), so the
 * page prerenders in the default locale. The requested URL's first segment is
 * read through useSyncExternalStore — the external system here is
 * window.location: the server snapshot (and the hydration pass) renders the
 * default locale, then React re-renders with the URL locale, long before the
 * runtime reads the DOM (initTyped etc. run only after the loader completes,
 * ≥1.2s later). RuntimeBoot receives constant props (no htmlLang) so the swap
 * never re-runs its boot effect; <html lang> and <title> are synced in an
 * effect instead.
 */

/** The URL never changes within a 404 page lifetime — subscription is a no-op. */
const LOCATION_SUBSCRIBE = () => () => {};

function detectLocale(): Locale {
  const first = window.location.pathname.split("/").filter(Boolean)[0] ?? "";
  if (first !== DEFAULT_LOCALE && isLocale(first)) return first;
  return DEFAULT_LOCALE;
}

export default function NotFoundClient() {
  const locale = useSyncExternalStore(
    LOCATION_SUBSCRIBE,
    detectLocale,
    () => DEFAULT_LOCALE,
  );

  const t = getTranslator(locale);

  useEffect(() => {
    if (locale === DEFAULT_LOCALE) return;
    document.documentElement.lang = locale;
    document.title = `${getTranslator(locale)(notFoundPage.PAGE_TITLE)} — de-press.co`;
  }, [locale]);

  return (
    <RuntimeBoot
      bodyClass={notFoundPage.BODY_CLASS}
      dataTheme={notFoundPage.DATA_THEME}
      dataPage={notFoundPage.DATA_PAGE}
    >
      <notFoundPage.Content
        t={t}
        locale={locale}
        path="/"
        href={(bare) => localePath(locale, bare)}
      />
    </RuntimeBoot>
  );
}
