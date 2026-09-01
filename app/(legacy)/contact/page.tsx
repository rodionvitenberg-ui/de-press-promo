import type { Metadata } from "next";
import { createPage } from "@/components/pages/renderer";
import { getTranslator } from "@/i18n";
import { DEFAULT_LOCALE } from "@/i18n/core";
import contact from "@/components/pages/contact";

const t = getTranslator(DEFAULT_LOCALE);

export const metadata: Metadata = {
  title: t(contact.PAGE_TITLE),
  description: t(
    "Написать de-press: помочь, участвовать в пилоте или поддержать проект. Кризис → 112/103 и /safety.",
  ),
};

export default createPage(contact, { path: "/contact/" });

