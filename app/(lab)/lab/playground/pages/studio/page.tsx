import type { Metadata } from "next";
import StudioShell from "@/components/lab/pages/StudioShell";

export const metadata: Metadata = {
  title: "Studio shell — Lab",
};

export default function StudioShellPage() {
  return <StudioShell />;
}
