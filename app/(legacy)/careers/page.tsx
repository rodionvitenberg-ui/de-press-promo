import type { Metadata } from "next";
import { createLegacyPage } from "@/components/legacy/createLegacyPage";
import * as page from "@/components/legacy/markups/careers";

export const metadata: Metadata = {
  title: page.PAGE_TITLE,
  description:
    "Помогать в de-press: стать Helper’ом, модератором тишины, разработчиком или автором. Helper ≠ терапевт.",
};

export default createLegacyPage(page);
