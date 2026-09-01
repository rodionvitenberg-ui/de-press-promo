import { Fx, type PageContentProps, type PageModule } from "./renderer";
import {
  CookieBar,
  SceneRoot,
  SiteFooter,
  SiteHeader,
  SiteLoader,
  SiteMenu,
  SiteMenuBack,
  SiteMenuPanel,
} from "./shared";
import type { Translator } from "@/i18n/core";

/**
 * Values — originalized JSX page (was components/legacy/markups/values.ts;
 * the legacy snapshot was deleted in A3 — git history keeps it).
 */

type ValueItem = {
  /** values-item--N */
  n: number;
  /** appear-delay--N */
  delay: number;
  /** Title segments — the template breaks them with <br />. */
  title: string[];
  /** Body segments — joined with <br /> (only item 9 has two). */
  text: string[];
};

const ROWS: { modifier?: "right" | "center"; items: ValueItem[] }[] = [
  {
    items: [
      {
        n: 1,
        delay: 1,
        title: ["values.p1.title1", "values.p1.title2", "values.p1.title3"],
        text: [
          "values.p1.text",
        ],
      },
      {
        n: 2,
        delay: 2,
        title: ["values.p2.title1", "values.p2.title2", "values.p2.title3"],
        text: [
          "values.p2.text",
        ],
      },
    ],
  },
  {
    items: [
      {
        n: 3,
        delay: 1,
        title: ["values.p3.title1", "values.p3.title2", "values.p3.title3"],
        text: [
          "values.p3.text",
        ],
      },
      {
        n: 4,
        delay: 2,
        title: ["values.p4.title1", "values.p4.title2"],
        text: [
          "values.p4.text",
        ],
      },
    ],
  },
  {
    items: [
      {
        n: 5,
        delay: 1,
        title: ["values.p5.title1", "values.p5.title2"],
        text: [
          "values.p5.text",
        ],
      },
      {
        n: 6,
        delay: 2,
        title: ["values.p6.title1", "values.p6.title2", "values.p6.title3"],
        text: [
          "values.p6.text",
        ],
      },
      {
        n: 7,
        delay: 3,
        title: ["values.p7.title1", "values.p7.title2"],
        text: [
          "values.p7.text",
        ],
      },
    ],
  },
  {
    modifier: "right",
    items: [
      {
        n: 8,
        delay: 1,
        title: ["values.p8.title1", "values.p8.title2"],
        text: [
          "values.p8.text",
        ],
      },
      {
        n: 9,
        delay: 2,
        title: ["values.p9.title1", "values.p9.title2"],
        text: [
          "values.p9.text1",
          "values.p9.text2",
        ],
      },
    ],
  },
  {
    modifier: "center",
    items: [
      {
        n: 10,
        delay: 1,
        title: ["values.hear.title1", "values.hear.title2"],
        text: [
          "values.hear.text",
        ],
      },
    ],
  },
];

function ValueArticle({ item, t }: { item: ValueItem; t: Translator }) {
  return (
    <article
      className={`values-item values-item--${item.n} appear-fade-up appear-delay--${item.delay}`}
    >
      <header className="values-item-header">
        <p className="values-item-index">
          <span className="values-item-cross" />
          {` ${String(item.n).padStart(2, "0")} /`}
        </p>
        <h3 className="values-item-title">
          {item.title.flatMap((seg, i) =>
            i === 0 ? [t(seg)] : [<br key={i} />, t(seg)],
          )}
        </h3>
      </header>

      <p className="values-item-text">
        {item.text.flatMap((seg, i) =>
          i === 0 ? [t(seg)] : [<br key={i} />, t(seg)],
        )}
      </p>
    </article>
  );
}

function ValuesContent({ t, locale, path, href }: PageContentProps) {
  return (
    <div className="site-wrapper">
      <SiteHeader t={t} href={href} />

      <SiteLoader />

      <SceneRoot />

      <SiteMenuBack />

      <SiteMenuPanel />

      <SiteMenu active="values" t={t} href={href} />

      <div className="site-container" data-router-wrapper="">
        <main data-router-view="values" role="main">
          <h1 className="u-visually-hidden">{t("shared.menu.values")}</h1>

          <section className="values-hero">
            <h2 className="u-visually-hidden">
              {t("values.hiddenTitle")}
            </h2>

            <div className="center">
              <header className="values-hero-header js-in-view">
                <p className="values-headline appear-fade-up">
                  {t("values.believe")}
                </p>
                <Fx name="values-culture" className="values-title fx-parent" t={t} />
              </header>

              <div className="values-hero-content js-in-view">
                <p className="values-headline appear-fade-up">
                  {t("common.toStart")}
                </p>
                <p className="values-text appear-fade-up appear-delay--2">
                  {t(
                    "values.intro",
                  )}
                </p>
              </div>
            </div>
          </section>

          <section className="values-list">
            <div className="center">
              <header className="values-list-header js-in-view">
                <h2 className="u-visually-hidden">
                  {t("values.notRules")}
                </h2>

                <img
                  data-src="/static/assets/images/values/background-leaves-1.png"
                  className="leaves leaves--1 js-lazy"
                />

                <Fx name="values-tgif" className="values-title fx-parent" t={t} />

                <p className="values-subtitle appear-fade appear-delay--7">
                  {t("values.next")}
                </p>
              </header>

              <div className="values-list-items">
                <img
                  data-src="/static/assets/images/values/background-leaves-2.png"
                  className="leaves leaves--2 js-lazy"
                />

                {ROWS.map((row, i) => (
                  <div
                    key={i}
                    className={`values-list-row${
                      row.modifier ? ` values-list-row--${row.modifier}` : ""
                    } js-in-view`}
                  >
                    {row.items.map((item) => (
                      <ValueArticle key={item.n} item={item} t={t} />
                    ))}
                  </div>
                ))}
              </div>

              <footer className="values-list-footer js-in-view">
                <h2 className="u-visually-hidden">
                  {t("values.hearReady")}
                </h2>

                <img
                  data-src="/static/assets/images/values/background-leaves-3.png"
                  className="leaves leaves--3 js-lazy"
                />

                <Fx name="values-hiring" className="values-title fx-parent" t={t} />

                <a
                  href="mailto:hello@de-press.co"
                  className="values-link link link--under"
                  title={t("values.helpLink")}
                >
                  {" "}
                  <span className="link-label">{t("values.helpLink")}</span>{" "}
                  <span className="link-line" />{" "}
                  <span className="link-line--anim" />{" "}
                </a>
              </footer>
            </div>
          </section>
        </main>
      </div>

      <CookieBar t={t} href={href} />

      <SiteFooter t={t} href={href} locale={locale} path={path} />
    </div>
  );
}

export const PAGE_TITLE = "meta.values.title";

export default {
  BODY_CLASS: "lock-scroll",
  DATA_THEME: "values",
  DATA_PAGE: "values",
  PAGE_TITLE,
  Content: ValuesContent,
} satisfies PageModule;
