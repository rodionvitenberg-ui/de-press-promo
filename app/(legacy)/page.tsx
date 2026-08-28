import type { Metadata } from "next";
import { createLegacyPage } from "@/components/legacy/createLegacyPage";
import * as page from "@/components/legacy/markups/home";

export const metadata: Metadata = {
  title: page.PAGE_TITLE,
  description:
    "Эмпатичная платформа-тихая гавань: истории вместо лент, тишина вместо лайков, «Я слышу тебя» вместо оценок.",
};

export default createLegacyPage(page);
