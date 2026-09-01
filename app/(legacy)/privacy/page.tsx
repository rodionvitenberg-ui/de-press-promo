import type { Metadata } from "next";
import privacy from "@/components/pages/privacy";
import { createPage } from "@/components/pages/renderer";
import { getTranslator } from "@/i18n";
import { DEFAULT_LOCALE } from "@/i18n/core";

const t = getTranslator(DEFAULT_LOCALE);

export const metadata: Metadata = {
  title: t(privacy.PAGE_TITLE),
  description: t(
    "Что de-press.co хранит и чего не хранит: анонимность как свойство системы, никаких трекеров, логов с IP и поведенческой аналитики.",
  ),
};

export default createPage(privacy, { path: "/privacy/" });
