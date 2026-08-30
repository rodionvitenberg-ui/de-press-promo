import type { Metadata } from "next";
import { createLegacyPage } from "@/components/legacy/createLegacyPage";
import { getTranslator } from "@/i18n";
import { DEFAULT_LOCALE } from "@/i18n/core";
import * as page from "@/components/legacy/markups/home";

const t = getTranslator(DEFAULT_LOCALE);

export const metadata: Metadata = {
  title: t(page.PAGE_TITLE),
  description: t(
    "Эмпатичная платформа-тихая гавань: истории вместо лент, тишина вместо лайков, «Я слышу тебя» вместо оценок.",
  ),
};

export default createLegacyPage(page, { path: "/" });

