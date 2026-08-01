import Link from "next/link";
import SiteHeader from "../SiteHeader";
import SiteFooter from "../SiteFooter";
import AppearDemo from "../AppearDemo";

/**
 * Skeleton “your product” page — lab patterns only, no Dogstudio brand.
 * Compose chrome + appear + your copy.
 */
export default function ProductLanding() {
  return (
    <div className="lab-product">
      <SiteHeader
        brand="Acme Studio"
        nav={[
          { href: "/lab/product/", label: "Home" },
          { href: "/lab/playground/dog/", label: "3D" },
          { href: "/lab/playground/themes/", label: "Themes" },
          { href: "/lab/", label: "Lab index" },
        ]}
      />

      <main className="lab-product-main">
        <section className="lab-product-hero">
          <p className="lab-shell-kicker">Your product</p>
          <h1 className="lab-shell-display">
            Ship work that feels expensive
          </h1>
          <p className="lab-shell-lead">
            This route is a blank canvas built from lab components (header,
            appear, footer). Replace copy and tokens — leave legacy clone for
            reference only.
          </p>
          <div className="lab-product-cta-row">
            <Link href="/lab/playground/dog/" className="lab-product-btn">
              Open 3D playground
            </Link>
            <Link
              href="/lab/playground/themes/"
              className="lab-product-btn lab-product-btn--ghost"
            >
              Theme switcher
            </Link>
          </div>
        </section>

        <section className="lab-product-section">
          <h2 className="lab-shell-h2">Scroll reveals</h2>
          <AppearDemo />
        </section>

        <section className="lab-product-section lab-product-grid">
          <article>
            <h3>Craft</h3>
            <p>Typography, motion, and restraint — ported as patterns, not assets.</p>
          </article>
          <article>
            <h3>Systems</h3>
            <p>Tokens, chrome, shells — compose pages without main.js.</p>
          </article>
          <article>
            <h3>3D when needed</h3>
            <p>R3F dog playground shows how to own WebGL outside DogGL.</p>
          </article>
        </section>
      </main>

      <div className="lab-page-footer-wrap">
        <SiteFooter
          columns={[
            { title: "Product", lines: ["Lab starter", "Your brand here"] },
            { title: "Learn", lines: ["study/ARCHITECTURE", "README roadmap"] },
            { title: "Reference", lines: ["Legacy clone", "Not for prod"] },
          ]}
          links={[
            { href: "/lab/", label: "Lab" },
            { href: "/", label: "Legacy" },
          ]}
          email="hello@example.com"
          note="Acme Studio is a placeholder name for study composition."
        />
      </div>
    </div>
  );
}
