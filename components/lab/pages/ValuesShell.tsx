import Link from "next/link";
import PageShell from "../PageShell";

const VALUES = [
  {
    n: "01",
    title: "Growing together",
    text: "Collaboration over hero culture — pair, review, ship as a unit.",
  },
  {
    n: "02",
    title: "Own the work",
    text: "Everyone is accountable for craft and outcomes, not just tickets.",
  },
  {
    n: "03",
    title: "Agile & human",
    text: "Move fast without treating people as sprint fuel.",
  },
  {
    n: "04",
    title: "Work globally",
    text: "Time zones and cultures are constraints you design for.",
  },
  {
    n: "05",
    title: "Platform agnostic",
    text: "Pick the medium that serves the idea — web, install, film, XR.",
  },
  {
    n: "06",
    title: "Keep evolving",
    text: "Stack, process, and taste are allowed to change.",
  },
  {
    n: "07",
    title: "Long-term relationships",
    text: "Prefer multi-year partners over one-off fireworks.",
  },
  {
    n: "08",
    title: "Honest communication",
    text: "Transparency over theatre — say the hard thing early.",
  },
];

/**
 * React shell of /values/.
 * Study: templates/_values.scss, values-list staggered items.
 */
export default function ValuesShell() {
  return (
    <PageShell
      tone="values"
      footerNote="Values shell — staggered list pattern, study only."
    >
      <section className="lab-shell-hero lab-shell-hero--values">
        <p className="lab-shell-kicker">Values</p>
        <h1 className="lab-shell-display">
          Culture is more than a ping-pong table
        </h1>
        <p className="lab-shell-lead">
          Original page stacks numbered beliefs with asymmetric rows. This port
          keeps the rhythm; wording is paraphrased for learning. Reference:{" "}
          <Link href="/values/">legacy /values/</Link>.
        </p>
      </section>

      <section className="lab-shell-values">
        {VALUES.map((v, i) => (
          <article
            key={v.n}
            className={`lab-shell-value lab-shell-value--${(i % 3) + 1}`}
          >
            <span className="lab-shell-value-n">{v.n}</span>
            <h2>{v.title}</h2>
            <p>{v.text}</p>
          </article>
        ))}
      </section>

      <section className="lab-shell-block lab-shell-cta">
        <Link href="/lab/playground/pages/contact/" className="lab-shell-link">
          Contact shell →
        </Link>
        <Link href="/values/" className="lab-shell-link lab-shell-link--muted">
          Legacy values →
        </Link>
      </section>
    </PageShell>
  );
}
