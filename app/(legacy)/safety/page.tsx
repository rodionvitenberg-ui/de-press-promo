import type { Metadata } from "next";
import { SafetyContent } from "@/components/legacy/SafetyContent";
import { getTranslator } from "@/i18n";
import { DEFAULT_LOCALE } from "@/i18n/core";

const t = getTranslator(DEFAULT_LOCALE);

export const metadata: Metadata = {
  title: t("Безопасность"),
  description: t(
    "Кризисная страница de-press.co: если очень плохо прямо сейчас — телефоны экстренной помощи 112 и 103, шаги самопомощи.",
  ),
};

export default function SafetyPage() {
  return <SafetyContent locale={DEFAULT_LOCALE} />;
}

