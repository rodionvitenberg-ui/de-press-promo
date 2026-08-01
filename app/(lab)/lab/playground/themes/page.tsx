import type { Metadata } from "next";
import Link from "next/link";
import LabShell from "@/components/lab/LabShell";
import ThemeSwitcher from "@/components/lab/ThemeSwitcher";

export const metadata: Metadata = {
  title: "Theme states — Lab",
};

export default function ThemesPlaygroundPage() {
  return (
    <LabShell
      title="Theme / matcap mood"
      lead="2D analogue of body[data-theme] + case hover. Full 3D matcap swap lives on the dog playground."
    >
      <ThemeSwitcher />
      <section className="lab-section">
        <h2>Study pointers</h2>
        <ul className="lab-list">
          <li>
            Legacy home: <code>data-theme</code> / <code>data-matcap</code> on case
            links
          </li>
          <li>
            <code>study/scss/utils/_variables.scss</code> → <code>$themes</code>
          </li>
          <li>
            3D: <Link href="/lab/playground/dog/">Dog playground</Link>
          </li>
        </ul>
      </section>
    </LabShell>
  );
}
