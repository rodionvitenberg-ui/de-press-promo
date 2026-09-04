import type { Metadata } from "next";
import { DEFAULT_LOCALE, getTranslator } from "@/i18n";
import NotFoundClient from "@/components/pages/not-found-client";
import { LegacyShell } from "./legacy-shell";

/**
 * Root 404 boundary — renders the 404 UI when a route calls notFound() with a
 * real 404 status. Unmatched URLs (no route at all) are served by
 * app/global-not-found.tsx instead — a full prerendered document returned at
 * the routing level (experimental.globalNotFound).
 *
 * This file renders inside the minimal root layout — outside the (legacy)
 * group — so the legacy shell (styles, page curtain, boot-state script) is
 * included explicitly. URLs carry no locale segment: the UI prerenders in the
 * fallback locale and the visitor's locale is resolved by the client wrapper
 * (components/pages/not-found-client.tsx).
 */

const t = getTranslator(DEFAULT_LOCALE);

export const metadata: Metadata = {
  title: t("meta.notfound.title"),
  description: t("meta.notfound.description"),
};

export default function NotFound() {
  return (
    <LegacyShell>
      <NotFoundClient />
    </LegacyShell>
  );
}
