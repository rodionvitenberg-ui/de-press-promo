"use client";

import { useEffect, useSyncExternalStore } from "react";
import RuntimeBoot from "@/components/runtime/RuntimeBoot";
import {
  DEFAULT_LOCALE,
  getTranslator,
  isLocale,
  LOCALE_COOKIE,
  localeFromHeader,
  type Locale,
} from "@/i18n";
import notFoundPage from "./not-found";

/**
 * 404 shell with cookie/navigator-based locale resolution. URLs carry no
 * locale segment anymore, so the root app/not-found.tsx and the global 404
 * document have no route params: the page prerenders in the fallback locale
 * (en). The visitor's locale is resolved through useSyncExternalStore — the
 * external system here is the dp-locale cookie + navigator.languages: the
 * server snapshot (and the hydration pass) renders the fallback locale, then
 * React re-renders with the detected locale, long before the runtime reads the
 * DOM (initTyped etc. run only after the loader completes, ≥1.2s later).
 * RuntimeBoot receives constant props (no htmlLang) so the swap never re-runs
 * its boot effect; <html lang> and <title> are synced in an effect instead.
 */

/** The URL never changes within a 404 page lifetime — subscription is a no-op. */
const LOCATION_SUBSCRIBE = () => () => {};

function detectLocale(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  const fromCookie = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${LOCALE_COOKIE}=`))
    ?.slice(LOCALE_COOKIE.length + 1);
  if (fromCookie && isLocale(fromCookie)) return fromCookie;
  const languages =
    typeof navigator !== "undefined" && navigator.languages?.length
      ? navigator.languages
      : [navigator?.language ?? ""];
  return localeFromHeader(languages.join(","));
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
        href={(bare) => bare}
      />
    </RuntimeBoot>
  );
}
