import type { Metadata } from "next";
import privacy from "@/components/pages/privacy";
import { createPage } from "@/components/pages/renderer";
import { getTranslator } from "@/i18n";
import { DEFAULT_LOCALE } from "@/i18n/core";

const t = getTranslator(DEFAULT_LOCALE);

export const metadata: Metadata = {
  title: t(privacy.PAGE_TITLE),
  description: t(
    "meta.privacy.description",
  ),
};

export default createPage(privacy, { path: "/privacy/" });
