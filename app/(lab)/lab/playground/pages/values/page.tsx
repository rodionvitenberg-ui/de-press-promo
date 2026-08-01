import type { Metadata } from "next";
import ValuesShell from "@/components/lab/pages/ValuesShell";

export const metadata: Metadata = {
  title: "Values shell — Lab",
};

export default function ValuesShellPage() {
  return <ValuesShell />;
}
