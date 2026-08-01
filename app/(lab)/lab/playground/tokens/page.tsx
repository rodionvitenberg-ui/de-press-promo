import type { Metadata } from "next";
import LabShell from "@/components/lab/LabShell";
import { caseThemes, colors } from "@/components/lab/tokens";

export const metadata: Metadata = {
  title: "Tokens playground — Lab",
};

const COLOR_ENTRIES = [
  { name: "body", value: colors.body },
  { name: "blue", value: colors.blue },
  { name: "blueA", value: colors.blueA },
  { name: "blueF", value: colors.blueF },
  { name: "blueG", value: colors.blueG },
  { name: "red", value: colors.red },
  { name: "bodyValues", value: colors.bodyValues },
  { name: "bodyCareers", value: colors.bodyCareers },
  { name: "blueInteract", value: colors.blueInteract },
  { name: "grey", value: colors.grey },
  { name: "white", value: colors.white },
  { name: "black", value: colors.black },
] as const;

export default function TokensPlaygroundPage() {
  return (
    <LabShell
      title="Design tokens"
      lead="Палитра из study/scss/utils/_variables.scss → components/lab/tokens.ts. Не копируй бренд — копируй систему."
    >
      <section className="lab-section">
        <h2>Core colors</h2>
        <div className="token-swatches">
          {COLOR_ENTRIES.map((c) => (
            <div key={c.name} className="token-swatch">
              <div
                className="token-swatch-chip"
                style={{ background: c.value }}
              />
              <div className="token-swatch-meta">
                <strong>{c.name}</strong>
                <span>{c.value}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="lab-section">
        <h2>Case theme accents (sample)</h2>
        <div className="token-swatches">
          {Object.entries(caseThemes).map(([name, t]) => (
            <div key={name} className="token-swatch">
              <div
                className="token-swatch-chip"
                style={{
                  background: `linear-gradient(135deg, ${t.scene} 40%, ${t.ui})`,
                }}
              />
              <div className="token-swatch-meta">
                <strong>{name}</strong>
                <span>
                  {t.ui} / {t.scene}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="lab-section">
        <h2>Study pointers</h2>
        <ul className="lab-list">
          <li>
            <code>study/scss/utils/_variables.scss</code>
          </li>
          <li>
            <code>components/lab/tokens.ts</code>
          </li>
          <li>
            Next: wire tokens into CSS variables on <code>.lab-root</code>
          </li>
        </ul>
      </section>
    </LabShell>
  );
}
