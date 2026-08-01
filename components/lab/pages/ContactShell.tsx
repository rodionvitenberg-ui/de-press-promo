import Link from "next/link";
import PageShell from "../PageShell";

const OFFICES = [
  {
    city: "Chicago",
    lines: ["1 S Wacker Dr. Suite 2250", "Chicago, IL 60606, USA"],
  },
  {
    city: "Amsterdam",
    lines: ["Generaal Vetterstraat 66", "1059 BW Amsterdam, Netherlands"],
  },
  {
    city: "Paris",
    lines: ["5 rue Moret", "75011 Paris, France"],
  },
];

/**
 * React shell of /contact/.
 * Study: templates/_contact.scss — title + email + country blocks.
 * Addresses kept for layout fidelity of the study clone; not a live contact form.
 */
export default function ContactShell() {
  return (
    <PageShell
      tone="contact"
      footerNote="Contact shell — layout study only."
    >
      <section className="lab-shell-hero lab-shell-hero--contact">
        <p className="lab-shell-kicker">Contact</p>
        <h1 className="lab-shell-display">Contact us</h1>
        <p className="lab-shell-lead">
          Big serif title, single email, then office columns — classic contact
          page rhythm. Compare{" "}
          <Link href="/contact/">legacy /contact/</Link>.
        </p>
        <a className="lab-shell-email" href="mailto:study@example.com">
          study@example.com
        </a>
        <p className="lab-shell-note">
          Demo address — original uses biz@dogstudio.be on the live site.
        </p>
      </section>

      <section className="lab-shell-offices">
        {OFFICES.map((o, i) => (
          <article
            key={o.city}
            className="lab-shell-office"
            style={{ transitionDelay: `${i * 60}ms` }}
          >
            <h2>{o.city}</h2>
            {o.lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </article>
        ))}
      </section>

      <section className="lab-shell-block lab-shell-cta">
        <Link href="/lab/playground/pages/" className="lab-shell-link">
          ← All page shells
        </Link>
        <Link href="/contact/" className="lab-shell-link lab-shell-link--muted">
          Legacy contact →
        </Link>
      </section>
    </PageShell>
  );
}
