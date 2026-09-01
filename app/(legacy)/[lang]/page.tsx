import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { renderPage } from "@/components/pages/renderer";
import { DEFAULT_LOCALE, getTranslator, isLocale, LOCALES } from "@/i18n";
import home from "@/components/pages/home";

type Props = { params: Promise<{ lang: string }> };

/** /en/, /de/, … — the default locale (ru) lives at the bare paths. */
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
    title: t(home.PAGE_TITLE),
    description: t(
      "Эмпатичная платформа-тихая гавань: истории вместо лент, тишина вместо лайков, «Я слышу тебя» вместо оценок.",
    ),
  };
}

export default async function LocalizedHomePage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang) || lang === DEFAULT_LOCALE) notFound();
  return renderPage(home, { locale: lang, path: "/" });
}
