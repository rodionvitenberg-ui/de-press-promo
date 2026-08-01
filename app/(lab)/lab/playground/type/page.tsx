import type { Metadata } from "next";
import LabShell from "@/components/lab/LabShell";
import { colors, fonts, typeRoles } from "@/components/lab/tokens";

export const metadata: Metadata = {
  title: "Typography playground — Lab",
};

export default function TypePlaygroundPage() {
  return (
    <LabShell
      title="Typography"
      lead="Роли display / body / meta из study/scss/base/_typography.scss. В lab — системные fallbacks; self-host Heebo/Gilroy/Sectra лежит в public theme."
    >
      <section className="lab-section">
        <h2>Scale</h2>
        <div className="type-scale">
          <div className="type-row">
            <div className="meta">Display XL · serif · ~h1 energy</div>
            <div className="type-display type-display--xl">We Make Good Shit</div>
          </div>
          <div className="type-row">
            <div className="meta">
              Display LG · serif medium · typeset h2 ~{typeRoles.display.sizes.h2}px
            </div>
            <div className="type-display type-display--lg">
              Multidisciplinary creative studio
            </div>
          </div>
          <div className="type-row">
            <div className="meta">
              Body · sans · base {typeRoles.baseSizePx}px · lh{" "}
              {typeRoles.lineHeightBody}
            </div>
            <p className="type-body">
              Our goal is to deliver amazing experiences that make people talk,
              and build strategic value for brands, tech, entertainment, arts
              and culture. Long line-height is part of the original voice.
            </p>
          </div>
          <div className="type-row">
            <div className="meta">Meta · uppercase tracking</div>
            <div className="type-meta">Featured projects · 2020 — Ongoing</div>
          </div>
        </div>
      </section>

      <section className="lab-section">
        <h2>Font stacks (tokens)</h2>
        <div className="type-font-faces">
          <div className="type-row">
            <div className="meta">Lab serif fallback</div>
            <div style={{ fontFamily: fonts.labSerif, fontSize: "1.5rem" }}>
              GT Sectra → Georgia
            </div>
          </div>
          <div className="type-row">
            <div className="meta">Lab sans fallback</div>
            <div style={{ fontFamily: fonts.labSans }}>Heebo / Gilroy → system-ui</div>
          </div>
          <div className="type-row">
            <div className="meta">Muted body color (blue-A @ 40%)</div>
            <p style={{ color: colors.fadedText, margin: 0 }}>
              Faded text sample using token <code>fadedText</code>.
            </p>
          </div>
        </div>
      </section>

      <section className="lab-section">
        <h2>Study pointers</h2>
        <ul className="lab-list">
          <li>
            <code>study/scss/base/_typography.scss</code>
          </li>
          <li>
            <code>study/scss/utils/_variables.scss</code>
          </li>
          <li>
            Runtime faces:{" "}
            <code>public/.../static/assets/fonts/</code>
          </li>
          <li>
            Source tokens: <code>components/lab/tokens.ts</code>
          </li>
        </ul>
      </section>
    </LabShell>
  );
}
