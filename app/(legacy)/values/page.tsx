import type { Metadata } from "next";
import { createLegacyPage } from "@/components/legacy/createLegacyPage";
import * as page from "@/components/legacy/markups/values";

export const metadata: Metadata = {
  title: page.PAGE_TITLE,
  description: "Values. What we believe in at Dogstudio.",
};

export default createLegacyPage(page);
