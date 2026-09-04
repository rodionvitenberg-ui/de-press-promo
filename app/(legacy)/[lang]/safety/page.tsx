import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SafetyContent } from "@/components/legacy/SafetyContent";
import { getTranslator, isLocale, LOCALES } from "@/i18n";

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
    title: t("meta.safety.title"),
    description: t(
      "meta.safety.description",
    ),
  };
}

export default async function LocalizedSafetyPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <SafetyContent locale={lang} />;
}
