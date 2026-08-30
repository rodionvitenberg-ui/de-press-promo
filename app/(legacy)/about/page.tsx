import type { Metadata } from "next";
import { createLegacyPage } from "@/components/legacy/createLegacyPage";
import { getTranslator } from "@/i18n";
import { DEFAULT_LOCALE } from "@/i18n/core";
import * as page from "@/components/legacy/markups/about";

const t = getTranslator(DEFAULT_LOCALE);

export const metadata: Metadata = {
  title: t(page.PAGE_TITLE),
  description: t(
    "О проекте de-press: зачем тихая гавань, как устроены облачка и какие принципы мы не сломаем.",
  ),
};

export default createLegacyPage(page, { path: "/about/" });

