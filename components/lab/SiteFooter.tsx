import Link from "next/link";

export type FooterColumn = {
  title: string;
  lines: string[];
};

export type FooterLink = {
  href: string;
  label: string;
};

type SiteFooterProps = {
  columns?: FooterColumn[];
  links?: FooterLink[];
  email?: string;
  note?: string;
};

const DEFAULT_COLUMNS: FooterColumn[] = [
  { title: "Chicago", lines: ["Study office", "Reference only"] },
  { title: "Amsterdam", lines: ["Not a real address", "Pattern demo"] },
  { title: "Paris", lines: ["Lab footer layout", "Port of site-footer"] },
];

const DEFAULT_LINKS: FooterLink[] = [
  { href: "/lab/", label: "Lab" },
  { href: "/lab/playground/chrome/", label: "Chrome" },
  { href: "/", label: "Legacy" },
];

/**
 * React port of multi-column site-footer structure.
 * Study: study/scss/partials/common/_footer.scss
 */
export default function SiteFooter({
  columns = DEFAULT_COLUMNS,
  links = DEFAULT_LINKS,
  email = "you@example.com",
  note = "Study footer — not Dogstudio contact info.",
}: SiteFooterProps) {
  return (
    <footer className="lab-chrome-footer">
      <div className="lab-chrome-footer-top">
        <div className="lab-chrome-footer-cols">
          {columns.map((col) => (
            <div key={col.title} className="lab-chrome-footer-col">
              <h3>{col.title}</h3>
              {col.lines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          ))}
          <div className="lab-chrome-footer-col lab-chrome-footer-col--links">
            <h3>Links</h3>
            <ul>
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="lab-chrome-footer-contact">
          <p className="lab-chrome-footer-contact-label">Contact</p>
          <a href={`mailto:${email}`} className="lab-chrome-footer-email">
            {email}
          </a>
        </div>
      </div>
      <div className="lab-chrome-footer-bottom">
        <p>{note}</p>
      </div>
    </footer>
  );
}
