import Link from "next/link";
import PageShell from "../PageShell";

const SERVICES = [
  "Brand Strategy",
  "Branding & Art Direction",
  "Digital Products",
  "Emerging Technologies",
  "Interactive Installations",
  "Visual Design",
  "Animation & Illustration",
];

const AWARDS = [
  { year: "2024", org: "Awwwards", type: "SOTD", project: "Immersive experience" },
  { year: "2023", org: "FWA", type: "FOTD", project: "Campaign site" },
  { year: "2022", org: "Webby", type: "Honoree", project: "Web3 experiment" },
];

/**
 * React shell of /studio/ (router-view "about").
 * Study: templates/_about.scss, partials about-*, legacy markups/studio.ts
 */
export default function StudioShell() {
  return (
    <PageShell
      footerNote="Studio shell — layout study, not Dogstudio marketing site."
    >
      <section className="lab-shell-hero">
        <p className="lab-shell-kicker">The Studio</p>
        <h1 className="lab-shell-display">
          We&apos;re just making good work like it&apos;s 1996
        </h1>
        <p className="lab-shell-lead">
          Structure port of the about page: hero claim → services grid → awards
          table. Content is simplified for study; compare with legacy{" "}
          <Link href="/studio/">/studio/</Link>.
        </p>
      </section>

      <section className="lab-shell-block">
        <h2 className="lab-shell-h2">What we ship</h2>
        <ul className="lab-shell-services">
          {SERVICES.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </section>

      <section className="lab-shell-block">
        <div className="lab-shell-block-head">
          <h2 className="lab-shell-h2">Awards table pattern</h2>
          <p className="lab-shell-note">
            Original uses expand/collapse (.js-table-expand). Here — static
            responsive table.
          </p>
        </div>
        <div className="lab-shell-table-wrap">
          <table className="lab-shell-table">
            <thead>
              <tr>
                <th>Year</th>
                <th>Org</th>
                <th>Type</th>
                <th>Project</th>
              </tr>
            </thead>
            <tbody>
              {AWARDS.map((row) => (
                <tr key={`${row.year}-${row.project}`}>
                  <td>{row.year}</td>
                  <td>{row.org}</td>
                  <td>{row.type}</td>
                  <td>{row.project}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="lab-shell-block lab-shell-cta">
        <Link href="/lab/playground/pages/values/" className="lab-shell-link">
          Values shell →
        </Link>
        <Link href="/studio/" className="lab-shell-link lab-shell-link--muted">
          Legacy studio →
        </Link>
      </section>
    </PageShell>
  );
}
