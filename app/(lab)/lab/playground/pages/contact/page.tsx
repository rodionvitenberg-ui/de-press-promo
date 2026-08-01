import type { Metadata } from "next";
import ContactShell from "@/components/lab/pages/ContactShell";

export const metadata: Metadata = {
  title: "Contact shell — Lab",
};

export default function ContactShellPage() {
  return <ContactShell />;
}
