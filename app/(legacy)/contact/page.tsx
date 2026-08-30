import type { Metadata } from "next";
import { createLegacyPage } from "@/components/legacy/createLegacyPage";
import { getTranslator } from "@/i18n";
import { DEFAULT_LOCALE } from "@/i18n/core";
import * as page from "@/components/legacy/markups/contact";

const t = getTranslator(DEFAULT_LOCALE);

export const metadata: Metadata = {
  title: t(page.PAGE_TITLE),
  description: t(
    "Написать de-press: помочь, участвовать в пилоте или поддержать проект. Кризис → 112/103 и /safety.",
  ),
};

export default createLegacyPage(page, { path: "/contact/" });

