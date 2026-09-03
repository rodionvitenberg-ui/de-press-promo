import type { Metadata } from "next";
import { DEFAULT_LOCALE, getTranslator } from "@/i18n";
import NotFoundClient from "@/components/pages/not-found-client";
import { LegacyShell } from "./legacy-shell";

/**
 * Global 404 (experimental.globalNotFound) — served directly at the routing
 * level for every URL that matches no route, as a full prerendered HTML
 * document. Unlike app/not-found.tsx (route-level notFound()), this file
 * bypasses all layouts and must render its own <html>/<body> — so the legacy
 * shell (styles, page curtain, boot-state script) is included explicitly.
 * The document prerenders in the default locale; the requested URL's locale
 * segment is resolved by the client wrapper
 * (components/pages/not-found-client.tsx) under the loader cover.
 */

const t = getTranslator(DEFAULT_LOCALE);

export const metadata: Metadata = {
  title: t("meta.notfound.title"),
  description: t("meta.notfound.description"),
};

export default function GlobalNotFound() {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <LegacyShell>
          <NotFoundClient />
        </LegacyShell>
      </body>
    </html>
  );
}
