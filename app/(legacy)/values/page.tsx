import type { Metadata } from "next";
import { createPage } from "@/components/pages/renderer";
import { getTranslator } from "@/i18n";
import { DEFAULT_LOCALE } from "@/i18n/core";
import values from "@/components/pages/values";

const t = getTranslator(DEFAULT_LOCALE);

export const metadata: Metadata = {
  title: t(values.PAGE_TITLE),
  description: t(
    "meta.values.description",
  ),
};

export default createPage(values, { path: "/values/" });

