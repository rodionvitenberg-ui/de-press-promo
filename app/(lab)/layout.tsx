import type { ReactNode } from "react";
import "@/components/lab/lab.css";

export default function LabLayout({ children }: { children: ReactNode }) {
  return <div className="lab-root">{children}</div>;
}
