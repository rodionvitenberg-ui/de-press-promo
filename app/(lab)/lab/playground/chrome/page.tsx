import type { Metadata } from "next";
import LabShell from "@/components/lab/LabShell";
import SiteHeader from "@/components/lab/SiteHeader";
import SiteFooter from "@/components/lab/SiteFooter";

export const metadata: Metadata = {
  title: "Chrome playground — Lab",
};

export default function ChromePlaygroundPage() {
  return (
    <LabShell
      title="Header · Menu · Footer"
      lead="React-порт chrome без dog.js/Highway. Открой Menu — fullscreen panel + stagger links + Escape/lock scroll."
    >
      <div className="lab-chrome-demo">
        <SiteHeader />
        <div className="lab-chrome-demo-body">
          <h2>Fullscreen menu pattern</h2>
          <p>
            Оригинал: fixed header, pointer-events split, menu panel поверх
            backdrop. Здесь — accessible button, dialog semantics, body scroll
            lock.
          </p>
          <p>
            Сравни с legacy:{" "}
            <a href="/">home</a> → кнопка меню. SCSS:{" "}
            <code>_header.scss</code>, <code>_menu.scss</code>,{" "}
            <code>_footer.scss</code>.
          </p>
        </div>
      </div>

      <SiteFooter />

      <section className="lab-section">
        <h2>Source</h2>
        <ul className="lab-list">
          <li>
            <code>components/lab/SiteHeader.tsx</code>
          </li>
          <li>
            <code>components/lab/SiteFooter.tsx</code>
          </li>
          <li>
            Styles in <code>components/lab/lab.css</code> (lab-chrome-*)
          </li>
        </ul>
      </section>
    </LabShell>
  );
}
