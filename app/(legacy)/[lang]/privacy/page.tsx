import type { Metadata } from "next";
import { notFound } from "next/navigation";
import privacy from "@/components/pages/privacy";
import { renderPage } from "@/components/pages/renderer";
import { getTranslator, isLocale, LOCALES } from "@/i18n";

type Props = { params: Promise<{ lang: string }> };

// Strictly the prerendered locale set: anything else (e.g. /xyz/privacy/) is
// rejected at the routing level and served by the global 404 document
// (app/global-not-found.tsx) with full static HTML.
export const dynamicParams = false;

/** Internal locale pages: all 10 locales (proxy.ts picks the active one). */
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getTranslator(lang);
  return {
    title: t(privacy.PAGE_TITLE),
    description: t(
      "meta.privacy.description",
    ),
  };
}

export default async function LocalizedPrivacyPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return renderPage(privacy, { locale: lang, path: "/privacy/" });
}
