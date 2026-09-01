import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { renderPage } from "@/components/pages/renderer";
import { DEFAULT_LOCALE, getTranslator, isLocale, LOCALES } from "@/i18n";
import contact from "@/components/pages/contact";

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
    title: t(contact.PAGE_TITLE),
    description: t(
      "meta.contact.description",
    ),
  };
}

export default async function LocalizedContactPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang) || lang === DEFAULT_LOCALE) notFound();
  return renderPage(contact, { locale: lang, path: "/contact/" });
}
