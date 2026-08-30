import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SafetyContent } from "@/components/legacy/SafetyContent";
import { DEFAULT_LOCALE, getTranslator, isLocale, LOCALES } from "@/i18n";

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
    title: t("Безопасность"),
    description: t(
      "Кризисная страница de-press.co: если очень плохо прямо сейчас — телефоны экстренной помощи 112 и 103, шаги самопомощи.",
    ),
  };
}

export default async function LocalizedSafetyPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang) || lang === DEFAULT_LOCALE) notFound();
  return <SafetyContent locale={lang} />;
}
