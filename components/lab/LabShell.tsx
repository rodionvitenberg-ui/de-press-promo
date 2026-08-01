import Link from "next/link";
import type { ReactNode } from "react";

type LabShellProps = {
  title: string;
  lead?: string;
  children: ReactNode;
};

const NAV = [
  { href: "/lab/", label: "Index" },
  { href: "/lab/playground/themes/", label: "Themes" },
  { href: "/lab/playground/dog/", label: "Dog" },
  { href: "/lab/playground/pages/", label: "Pages" },
  { href: "/lab/product/", label: "Product" },
];

export default function LabShell({ title, lead, children }: LabShellProps) {
  return (
    <div className="lab-shell">
      <nav className="lab-nav" aria-label="Lab">
        <strong>Lab</strong>
        {NAV.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
        <span aria-hidden>·</span>
        <Link href="/">Legacy</Link>
      </nav>
      <h1 className="lab-title">{title}</h1>
      {lead ? <p className="lab-lead">{lead}</p> : null}
      {children}
    </div>
  );
}
