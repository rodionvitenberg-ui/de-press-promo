import type { Metadata } from "next";
import Link from "next/link";
import LabShell from "@/components/lab/LabShell";
import ShowreelModal from "@/components/lab/ShowreelModal";

export const metadata: Metadata = {
  title: "Showreel modal — Lab",
};

export default function ShowreelPlaygroundPage() {
  return (
    <LabShell
      title="Showreel modal"
      lead="Poster → overlay → Vimeo iframe. Original home uses Plyr + .js-showreel. Needs network for video."
    >
      <ShowreelModal />
      <section className="lab-section">
        <h2>Study pointers</h2>
        <ul className="lab-list">
          <li>
            Legacy home: showreel button / <code>.js-plyr</code>
          </li>
          <li>
            <code>components/lab/ShowreelModal.tsx</code>
          </li>
          <li>
            Compare <Link href="/">legacy /</Link>
          </li>
        </ul>
      </section>
    </LabShell>
  );
}
