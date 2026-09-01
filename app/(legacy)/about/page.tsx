import type { Metadata } from "next";
import { createPage } from "@/components/pages/renderer";
import { getTranslator } from "@/i18n";
import { DEFAULT_LOCALE } from "@/i18n/core";
import about from "@/components/pages/about";

const t = getTranslator(DEFAULT_LOCALE);

export const metadata: Metadata = {
  title: t(about.PAGE_TITLE),
  description: t(
    "meta.about.description",
  ),
};

export default createPage(about, { path: "/about/" });

