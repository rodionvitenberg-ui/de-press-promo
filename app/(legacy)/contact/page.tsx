import type { Metadata } from "next";
import { createLegacyPage } from "@/components/legacy/createLegacyPage";
import * as page from "@/components/legacy/markups/contact";

export const metadata: Metadata = {
  title: page.PAGE_TITLE,
  description: "Contact. Drop a line to Dogstudio.",
};

export default createLegacyPage(page);
