import type { Metadata } from "next";
import { notFound } from "next/navigation";
import privacy from "@/components/pages/privacy";
import { renderPage } from "@/components/pages/renderer";
import { DEFAULT_LOCALE, getTranslator, isLocale, LOCALES } from "@/i18n";

type Props = { params: Promise<{ lang: string }> };

// Strictly the prerendered locale set: anything else (e.g. /ru/privacy/,
// /xyz/privacy/) is rejected at the routing level and served by the global
// 404 document (app/global-not-found.tsx) with full static HTML.
export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.filter((locale) => locale !== DEFAULT_LOCALE).map((lang) => ({
    lang,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang) || lang === DEFAULT_LOCALE) return {};
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
  if (!isLocale(lang) || lang === DEFAULT_LOCALE) notFound();
  return renderPage(privacy, { locale: lang, path: "/privacy/" });
}
