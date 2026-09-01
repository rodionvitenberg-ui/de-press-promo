import type { Metadata } from "next";
import { createPage } from "@/components/pages/renderer";
import { getTranslator } from "@/i18n";
import { DEFAULT_LOCALE } from "@/i18n/core";
import home from "@/components/pages/home";

const t = getTranslator(DEFAULT_LOCALE);

export const metadata: Metadata = {
  title: t(home.PAGE_TITLE),
  description: t(
    "meta.home.description",
  ),
};

export default createPage(home, { path: "/" });

