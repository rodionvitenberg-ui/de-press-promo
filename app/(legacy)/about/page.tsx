import type { Metadata } from "next";
import { createLegacyPage } from "@/components/legacy/createLegacyPage";
import * as page from "@/components/legacy/markups/about";

export const metadata: Metadata = {
  title: page.PAGE_TITLE,
  description:
    "О проекте de-press: зачем тихая гавань, как устроены облачка и какие принципы мы не сломаем.",
};

export default createLegacyPage(page);
