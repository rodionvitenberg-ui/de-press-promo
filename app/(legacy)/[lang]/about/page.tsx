import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { renderLegacyPage } from "@/components/legacy/createLegacyPage";
import { DEFAULT_LOCALE, getTranslator, isLocale, LOCALES } from "@/i18n";
import * as page from "@/components/legacy/markups/about";

type Props = { params: Promise<{ lang: string }> };

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
    title: t(page.PAGE_TITLE),
    description: t(
      "О проекте de-press: зачем тихая гавань, как устроены облачка и какие принципы мы не сломаем.",
    ),
  };
}

export default async function LocalizedAboutPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang) || lang === DEFAULT_LOCALE) notFound();
  return renderLegacyPage(page, { locale: lang, path: "/about/" });
}
