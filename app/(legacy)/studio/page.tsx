import type { Metadata } from "next";
import { createLegacyPage } from "@/components/legacy/createLegacyPage";
import * as page from "@/components/legacy/markups/studio";

export const metadata: Metadata = {
  title: page.PAGE_TITLE,
  description: "The Studio. We are Dogstudio.",
};

export default createLegacyPage(page);
