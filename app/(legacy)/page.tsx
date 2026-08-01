import type { Metadata } from "next";
import { createLegacyPage } from "@/components/legacy/createLegacyPage";
import * as page from "@/components/legacy/markups/home";

export const metadata: Metadata = {
  title: page.PAGE_TITLE,
  description:
    "We are at the intersection of art, design and technology. Our goal is to deliver amazing experiences.",
};

export default createLegacyPage(page);
