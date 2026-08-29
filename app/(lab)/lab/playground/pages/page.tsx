import type { Metadata } from "next";
import Link from "next/link";
import LabShell from "@/components/lab/LabShell";

export const metadata: Metadata = {
  title: "Page shells — Lab",
};

const PAGES = [
  {
    href: "/lab/playground/pages/studio/",
    title: "Studio shell",
    body: "About-page rhythm: claim → services → awards table.",
    legacy: "/about/",
  },
  {
    href: "/lab/playground/pages/values/",
    title: "Values shell",
    body: "Staggered belief list + values tone.",
    legacy: "/values/",
  },
  {
    href: "/lab/playground/pages/contact/",
    title: "Contact shell",
    body: "Title · email · office columns.",
    legacy: "/contact/",
  },
];

export default function PagesIndexPage() {
  return (
    <LabShell
      title="Page shells"
      lead="React-layout ports of studio / values / contact. Side-by-side with legacy routes."
    >
      <div className="lab-grid">
        {PAGES.map((p) => (
          <Link key={p.href} href={p.href} className="lab-card">
            <h2>{p.title}</h2>
            <p>{p.body}</p>
            <p style={{ marginTop: "0.75rem", fontSize: "0.8rem" }}>
              Legacy: {p.legacy}
            </p>
          </Link>
        ))}
      </div>
    </LabShell>
  );
}
