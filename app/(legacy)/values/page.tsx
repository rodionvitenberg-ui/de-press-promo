import type { Metadata } from "next";
import { createLegacyPage } from "@/components/legacy/createLegacyPage";
import * as page from "@/components/legacy/markups/values";

export const metadata: Metadata = {
  title: page.PAGE_TITLE,
  description:
    "Десять принципов de-press: без лайков и рейтингов, без публичных комментариев, чат начинает только автор.",
};

export default createLegacyPage(page);
