import { Fx, type PageContentProps, type PageModule } from "./renderer";
import {
  CaretRight,
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
 * About — originalized JSX page (was components/legacy/markups/about.ts;
 * the legacy snapshot was deleted in A3 — git history keeps it).
 */

const PRODUCTS: string[] = [
  "about.products.noLikes",
  "about.products.noComments",
  "about.products.authorChat",
  "about.products.openTech",
  "about.products.emotionMaps",
  "about.products.antiPanic",
  "about.products.helper",
];

function CaretLink({ bare, label, href, t, className }: {
  bare: string;
  label: string;
  href: (bare: string) => string;
  t: Translator;
  className: string;
}) {
  return (
    <a href={href(bare)} className={className}>
      {" "}
      <span className="link--caret-text">{t(label)}</span>{" "}
      <CaretRight />{" "}
    </a>
  );
}

function AboutContent({ t, locale, path, href }: PageContentProps) {
  return (
    <div className="site-wrapper">
      <SiteHeader t={t} href={href} />

      <SiteLoader />

      <SceneRoot />

      <SiteMenuBack />

      <SiteMenuPanel />

      <SiteMenu active="about" t={t} href={href} />

      <div className="site-container" data-router-wrapper="">
        <main data-router-view="about" role="main">
          <picture className="about-background js-in-view appear-fade">
            <source data-srcset="/static/assets/images/about/background-xxs.png" media="(max-width: 450px)" />
            <source data-srcset="/static/assets/images/about/background-m.png" media="(max-width: 815px)" />
            <source data-srcset="/static/assets/images/about/background-l.png" media="(max-width: 1030px)" />
            <img data-src="/static/assets/images/about/background-xl.png" className="js-lazy" alt="" />
          </picture>

          <div className="center">
            <header className="about-header about-header--1 js-in-view">
              <h1 className="u-visually-hidden">{t("about.hiddenTitle")}</h1>

              <p className="about-headline about-headline--blue appear-fade-up">{t("about.commitment")}</p>
              <Fx name="about-intro" className="about-title about-title--large fx-parent" t={t} />
            </header>

            <div className="about-item about-item--1 js-in-view">
              <p className="about-headline appear-fade-up">{t("common.toStart")}</p>
              <p className="about-tagline appear-fade-up appear-delay--2">{t("about.mission")}</p>
            </div>

            <div className="about-item about-item--2 js-in-view">
              <p className="about-title about-title--small appear-fade-up">{t("about.meaningTitle")}</p>
              <div className="about-text typeset appear-fade-up appear-delay--2">
                <p>{t("about.meaningText")}</p>
                <p>
                  {t("about.tired")}
                  <br />
                  {t("about.goodNews")}
                </p>
              </div>
            </div>

            <div className="about-products">
              <ul className="about-products-list">
                {PRODUCTS.map((text) => (
                  <li key={text} className="about-products-item js-in-view appear-fade-right">
                    {t(text)}
                  </li>
                ))}
              </ul>
              <CaretLink bare="/" label="common.watchHowItWorks" href={href} t={t} className="link link--caret js-in-view" />
            </div>

            <header className="about-header about-header--2 js-in-view">
              <h2 className="u-visually-hidden">{t("about.invariants")}</h2>

              <p className="about-headline appear-fade-up">{t("about.decidedTitle")}</p>
              <Fx name="about-swagger" className="about-title fx-parent" t={t} />
            </header>

            <div className="about-item about-item--3 js-in-view appear-fade-up">
              <div className="about-text typeset">
                <p>{t("about.tableIntro")}</p>
              </div>
            </div>

            <div className="about-item about-item--4 js-in-view">
              <p className="about-headline appear-fade-up">{t("common.toStart")}</p>
              <p className="about-tagline appear-fade-up appear-delay--2">{t("about.goal")}</p>
            </div>

            <div className="about-item about-item--5 js-in-view">
              <h2 className="about-title about-title--small appear-fade-up">{t("about.detailsTitle")}</h2>
              <div className="about-text typeset appear-fade-up appear-delay--2">
                <p>
                  {t("about.detailsQuote")}
                  <br />
                  {t("about.detailsText")}
                </p>
              </div>
            </div>

            <div className="about-item about-item--6 js-in-view appear-fade-up">
              <h2 className="about-title about-title--small appear-fade-up">{t("about.howTitle")}</h2>
              <div className="about-text typeset appear-fade-up appear-delay--2">
                <p>{t("about.howText1")}</p>
                <p>{t("about.howText2")}</p>
              </div>
            </div>

            <div className="about-item about-item--7 js-in-view appear-fade-up">
              <div className="about-text typeset">
                <p>{t("about.howText3")}</p>
                <p>{t("about.howText4")}</p>
              </div>

              <CaretLink bare="/values/" label="about.morePrinciples" href={href} t={t} className="link link--caret" />
            </div>
          </div>
        </main>
      </div>

      <CookieBar t={t} href={href} />

      <SiteFooter t={t} href={href} locale={locale} path={path} />
    </div>
  );
}

export const PAGE_TITLE = "meta.about.title";

export default {
  BODY_CLASS: "lock-scroll",
  DATA_THEME: "about",
  DATA_PAGE: "about",
  PAGE_TITLE,
  Content: AboutContent,
} satisfies PageModule;

