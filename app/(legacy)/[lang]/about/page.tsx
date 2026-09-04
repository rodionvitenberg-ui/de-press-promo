import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { renderPage } from "@/components/pages/renderer";
import { getTranslator, isLocale, LOCALES } from "@/i18n";
import about from "@/components/pages/about";

type Props = { params: Promise<{ lang: string }> };

/** Internal locale pages: all 10 locales (proxy.ts picks the active one). */
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getTranslator(lang);
  return {
    title: t(about.PAGE_TITLE),
    description: t(
      "meta.about.description",
    ),
  };
}

export default async function LocalizedAboutPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return renderPage(about, { locale: lang, path: "/about/" });
}
