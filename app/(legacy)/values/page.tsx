import type { Metadata } from "next";
import { createLegacyPage } from "@/components/legacy/createLegacyPage";
import { getTranslator } from "@/i18n";
import { DEFAULT_LOCALE } from "@/i18n/core";
import * as page from "@/components/legacy/markups/values";

const t = getTranslator(DEFAULT_LOCALE);

export const metadata: Metadata = {
  title: t(page.PAGE_TITLE),
  description: t(
    "Десять принципов de-press: без лайков и рейтингов, без публичных комментариев, чат начинает только автор.",
  ),
};

export default createLegacyPage(page, { path: "/values/" });

