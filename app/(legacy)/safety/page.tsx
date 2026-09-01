import type { Metadata } from "next";
import { SafetyContent } from "@/components/legacy/SafetyContent";
import { getTranslator } from "@/i18n";
import { DEFAULT_LOCALE } from "@/i18n/core";

const t = getTranslator(DEFAULT_LOCALE);

export const metadata: Metadata = {
  title: t("meta.safety.title"),
  description: t(
    "meta.safety.description",
  ),
};

export default function SafetyPage() {
  return <SafetyContent locale={DEFAULT_LOCALE} />;
}

