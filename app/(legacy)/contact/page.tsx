import type { Metadata } from "next";
import { createLegacyPage } from "@/components/legacy/createLegacyPage";
import * as page from "@/components/legacy/markups/contact";

export const metadata: Metadata = {
  title: page.PAGE_TITLE,
  description:
    "Написать de-press: помочь, участвовать в пилоте или поддержать проект. Кризис → 112/103 и /safety.",
};

export default createLegacyPage(page);
