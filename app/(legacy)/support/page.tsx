import type { Metadata } from "next";
import support from "@/components/pages/support";
import { createPage } from "@/components/pages/renderer";
import { getTranslator } from "@/i18n";
import { DEFAULT_LOCALE } from "@/i18n/core";

const t = getTranslator(DEFAULT_LOCALE);

export const metadata: Metadata = {
  title: t(support.PAGE_TITLE),
  description: t(
    "meta.support.description",
  ),
};

export default createPage(support, { path: "/support/" });