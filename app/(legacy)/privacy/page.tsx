import type { Metadata } from "next";
import { PrivacyContent } from "@/components/legacy/PrivacyContent";
import { getTranslator } from "@/i18n";
import { DEFAULT_LOCALE } from "@/i18n/core";

const t = getTranslator(DEFAULT_LOCALE);

export const metadata: Metadata = {
  title: t("Приватность"),
  description: t(
    "Что de-press.co хранит и чего не хранит: анонимность как свойство системы, никаких трекеров, логов с IP и поведенческой аналитики.",
  ),
};

export default function PrivacyPage() {
  return <PrivacyContent locale={DEFAULT_LOCALE} />;
}
