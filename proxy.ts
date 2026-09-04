import { NextResponse, type NextRequest } from "next/server";
import {
  isLocale,
  LOCALE_COOKIE,
  localeFromHeader,
  type Locale,
} from "./i18n/core";

/**
 * Clean-URL locale proxy (Next 16 renamed middleware → proxy.ts).
 *
 * Public URLs carry no locale segment: /, /about/, /values/, … are shared by
 * all 10 locales. This proxy picks the active one from the dp-locale cookie
 * (Accept-Language on the first visit, fallback en) and rewrites the request
 * to the internal /{locale}/… static page. The address bar never shows the
 * locale.
 *
 * Legacy /{locale}/… links (old bookmarks, old switcher) get a 307 redirect to
 * the clean path with the locale stored in the cookie; the footer switcher
 * uses /path?dp-locale=<locale> links — the same redirect stores the choice.
 */

const PUBLIC_PATHS = new Set([
  "/",
  "/about/",
  "/values/",
  "/contact/",
  "/support/",
  "/privacy/",
  "/safety/",
]);

const COOKIE_OPTIONS = {
  path: "/",
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24 * 365,
};

/** Requests to /_next, /static assets and files (favicon…) skip the proxy. */
export const config = {
  matcher: ["/((?!_next/|static/|.*\\..*).*)"],
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/").filter(Boolean)[0] ?? "";

  // (a) Legacy /<locale>/… URL → remember the locale, redirect to the clean path.
  if (isLocale(first)) {
    const clean = pathname.slice(first.length + 1) || "/";
    const url = request.nextUrl.clone();
    url.pathname = clean === "/" ? "/" : clean.endsWith("/") ? clean : `${clean}/`;
    url.searchParams.delete(LOCALE_COOKIE);
    const res = NextResponse.redirect(url, 307);
    res.cookies.set(LOCALE_COOKIE, first, COOKIE_OPTIONS);
    return res;
  }

  // Normalize to the trailing-slash page form.
  const norm = pathname === "/" ? "/" : pathname.endsWith("/") ? pathname : `${pathname}/`;

  // (b) ?dp-locale=<locale> (footer switcher) → store the choice, drop the query.
  const want = request.nextUrl.searchParams.get(LOCALE_COOKIE);
  if (want && isLocale(want) && PUBLIC_PATHS.has(norm)) {
    const url = request.nextUrl.clone();
    url.searchParams.delete(LOCALE_COOKIE);
    const res = NextResponse.redirect(url, 307);
    res.cookies.set(LOCALE_COOKIE, want, COOKIE_OPTIONS);
    return res;
  }

  // (c) Known public pages only — everything else keeps default routing (404).
  if (!PUBLIC_PATHS.has(norm)) return;

  const locale =
    readCookieLocale(request) ??
    localeFromHeader(request.headers.get("accept-language") ?? "");
  const target = request.nextUrl.clone();
  target.pathname = `/${locale}${norm}`;
  const res = NextResponse.rewrite(target);
  if (!request.cookies.get(LOCALE_COOKIE)) {
    res.cookies.set(LOCALE_COOKIE, locale, COOKIE_OPTIONS);
  }
  return res;
}

function readCookieLocale(request: NextRequest): Locale | null {
  const value = request.cookies.get(LOCALE_COOKIE)?.value;
  if (value && isLocale(value)) return value;
  return null;
}

