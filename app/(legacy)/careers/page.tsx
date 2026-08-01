import type { Metadata } from "next";
import { createLegacyPage } from "@/components/legacy/createLegacyPage";
import * as page from "@/components/legacy/markups/careers";

export const metadata: Metadata = {
  title: page.PAGE_TITLE,
  description: "Careers at Dogstudio.",
};

export default createLegacyPage(page);
