import type { Metadata } from "next";
import Link from "next/link";
import LabShell from "@/components/lab/LabShell";

export const metadata: Metadata = {
  title: "Lab — promo-depress",
  description: "Next.js playground for reimplementing Dogstudio techniques.",
};

const PLAYGROUNDS = [
  {
    href: "/lab/playground/tokens/",
    title: "Design tokens",
    body: "Палитра и case-themes → tokens.ts.",
  },
  {
    href: "/lab/playground/type/",
    title: "Typography",
    body: "Display / body / meta scale.",
  },
  {
    href: "/lab/playground/appear/",
    title: "Appear / in-view",
    body: "IntersectionObserver + CSS.",
  },
  {
    href: "/lab/playground/chrome/",
    title: "Header · Menu · Footer",
    body: "Fullscreen menu pattern.",
  },
  {
    href: "/lab/playground/pages/",
    title: "Page shells",
    body: "Studio / Values / Contact layouts.",
  },
  {
    href: "/lab/playground/slider/",
    title: "Careers slider",
    body: "Drag/scroll image strip.",
  },
  {
    href: "/lab/playground/showreel/",
    title: "Showreel modal",
    body: "Poster → Vimeo overlay.",
  },
  {
    href: "/lab/playground/themes/",
    title: "Theme / matcap mood",
    body: "CSS variables swap on case hover.",
  },
  {
    href: "/lab/playground/dog/",
    title: "Dog · R3F",
    body: "WebGL dog.glb + matcap + scroll scrub.",
  },
  {
    href: "/lab/product/",
    title: "Product starter",
    body: "Собери свой лендинг из lab-паттернов.",
  },
];

const LEGACY = [
  { href: "/", label: "Home" },
  { href: "/about/", label: "О проекте" },
  { href: "/values/", label: "Values" },
  { href: "/contact/", label: "Contact" },
];

export default function LabIndexPage() {
  return (
    <LabShell
      title="Study lab"
      lead="React/Next playgrounds без dog.js. Legacy-клон — эталон."
    >
      <section className="lab-section">
        <h2>Playgrounds</h2>
        <div className="lab-grid">
          {PLAYGROUNDS.map((p) => (
            <Link key={p.href} href={p.href} className="lab-card">
              <h2>{p.title}</h2>
              <p>{p.body}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="lab-section">
        <h2>Legacy reference</h2>
        <ul className="lab-list">
          {LEGACY.map((l) => (
            <li key={l.href}>
              <Link href={l.href}>{l.label}</Link>
              <code> {l.href}</code>
            </li>
          ))}
        </ul>
      </section>
    </LabShell>
  );
}
