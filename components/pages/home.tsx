import { Fx, tx, type PageContentProps, type PageModule } from "./renderer";
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
 * Home — JSX twin of components/legacy/markups/home.ts.
 * DOM must be 1:1 with the legacy snapshot (scripts/html-diff.mjs guards it);
 * texts go through the dictionary at render time, fx blocks and the language
 * switcher reuse the exact generators from i18n/core.
 */

type CaseItem = {
  theme: string;
  matcap: string;
  /** The feeling — or the case name (dictionary key); list trigger and the big card name. */
  name: string;
  /** Exact template text per .home-cases-line (leading/trailing spaces matter). */
  lines: string[];
  /** The quiet offer — tool name in the caret link. */
  offer: string;
};

const CASES: CaseItem[] = [
  {
    theme: "tomorrowland",
    matcap: "18, 18",
    name: "cases.lonely.name",
    lines: ["cases.lonely.line1", " cases.lonely.line2"],
    offer: "cases.offer.monologue",
  },
  {
    theme: "navy-pier",
    matcap: "7, 7",
    name: "cases.isolated.name",
    lines: ["cases.isolated.line1", " cases.isolated.line2"],
    offer: "cases.offer.hearYou",
  },
  {
    theme: "msi-chicago",
    matcap: "8, 8",
    name: "cases.unheard.name",
    lines: ["cases.unheard.line1", " cases.unheard.line2"],
    offer: "cases.offer.quietPhrases",
  },
  {
    theme: "this-was-louises-phone",
    matcap: "11, 11",
    name: "cases.misfit.name",
    lines: ["cases.misfit.line1", " cases.misfit.line2"],
    offer: "cases.offer.similarStory",
  },
  {
    theme: "kikk-18",
    matcap: "9, 9",
    name: "cases.pulse.name",
    lines: ["cases.pulse.line1"],
    offer: "cases.offer.more",
  },
  {
    theme: "the-kennedy-center",
    matcap: "10, 10",
    name: "cases.hearers.name",
    lines: ["cases.hearers.line1", " cases.hearers.line2", " cases.hearers.line3"],
    offer: "cases.offer.more",
  },
  {
    theme: "orw",
    matcap: "12, 12",
    name: "cases.tooMuch.name",
    lines: ["cases.tooMuch.line1", " cases.tooMuch.line2"],
    offer: "Anti-Panic",
  },
];

function CaseScene({ item, t, href }: { item: CaseItem; t: Translator; href: (bare: string) => string }) {
  return (
    <div className={`home-cases-scene home-cases-scene--${item.theme}`}>
      <h3 className="u-visually-hidden">{t(item.name)}</h3>
      <div className="inner">
        <a href={href("/about/")} className="home-cases-link">
          <span className="u-visually-hidden">{t(item.name)}</span>
        </a>
        <div className="home-cases-content">
          <p className="home-cases-name">{t(item.name)}</p>
          <p className="home-cases-text">
            {item.lines.flatMap((line, i) =>
              i === 0
                ? [<span key={i} className="home-cases-line">{tx(t, line)}</span>]
                : [" ", <span key={i} className="home-cases-line">{tx(t, line)}</span>],
            )}
          </p>
          <p className="link link--caret">
            <span className="link--caret-text">{t(item.offer)}</span>{" "}
            <CaretRight />
          </p>
        </div>
        <picture className="home-cases-picture">
          <source data-srcset={`/static/assets/images/cases/${item.theme}/background-450.png`} media="(max-width: 450px)" />
          <source data-srcset={`/static/assets/images/cases/${item.theme}/background-815.png`} media="(max-width: 815px)" />
          <source data-srcset={`/static/assets/images/cases/${item.theme}/background-1015.png`} media="(max-width: 1030px)" />
          <img data-src={`/static/assets/images/cases/${item.theme}/background-1440.png`} alt="" className="js-lazy" />
        </picture>
      </div>
    </div>
  );
}


function HomeContent({ t, locale, path, href }: PageContentProps) {
  return (
    <div className="site-wrapper">
      <SiteHeader t={t} href={href} />

      <SiteLoader />

      <SceneRoot />

      <SiteMenuBack />

      <SiteMenuPanel />

      <SiteMenu active={null} t={t} href={href} />

      <div className="site-container" data-router-wrapper="">
          <main data-router-view="home" role="main">
            <h1 className="u-visually-hidden">de-press</h1>

            <picture className="home-background js-in-view appear-fade">
              <source data-srcset="/static/assets/images/home/background-xxs.png" media="(max-width: 450px)" />
              <source data-srcset="/static/assets/images/home/background-m.png" media="(max-width: 815px)" />
              <source data-srcset="/static/assets/images/home/background-l.png" media="(max-width: 1030px)" />
              <img data-src="/static/assets/images/home/background-xl.png" className="js-lazy" alt="" />
            </picture>

            <section className="home-hero js-in-view">
              <h2 className="u-visually-hidden">{t("home.hero.hiddenTitle")}</h2>

              <div className="center">
                <Fx name="home-hero" className="home-hero-title fx-parent" t={t} />

                <div className="home-hero-content">
                  <p className="lead">
                    <span>{t("home.hero.lead1")}</span>{" "}
                    <span>{t("home.hero.lead2")}</span>{" "}
                    <span>{t("home.hero.lead3")}</span>
                  </p>

                  <p>
                    <span>{t("home.hero.sub1")}</span>{" "}
                    <span>{t("home.hero.sub2")}</span>{" "}
                    <span>{t("home.hero.sub3")}</span>
                  </p>
                  <a href="https://app.de-press.co" target="_blank" className="home-app-link link link--under">
                    {" "}
                    <span className="link-label">{t("home.hero.appLink")}</span>{" "}
                    <span className="link-line" />{" "}
                    <span className="link-line--anim" />{" "}
                  </a>
                  <ul>
                    <li><a href="https://t.me/depresscoofficial" target="_blank">{t("Telegram")}</a></li>
                    <li><a href="https://x.com/soshallitbe5" target="_blank">{t("X")}</a></li>
                    <li><a href="https://github.com/rodionvitenberg-ui/de-press.co" target="_blank">{t("GitHub")}</a></li>
                    <li><a href="mailto:hello@de-press.co" target="_blank">{t("E-mail")}</a></li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="home-cases">
              <div className="center">
                <h2 className="home-cases-title js-in-view appear-fade-up">{t("home.cases.title")}</h2>

                <ul className="home-cases-list js-cases-list">
                  {CASES.map((item) => (
                    <li key={item.theme} className="js-in-view appear-fade-up">
                      <a href={href("/about/")} data-theme={item.theme} data-matcap={item.matcap}>
                        {t(item.name)}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="home-cases-scenes">
                {CASES.map((item) => (
                  <CaseScene key={item.theme} item={item} t={t} href={href} />
                ))}
              </div>
            </section>

            <section className="home-about js-in-view">
              <h2 className="u-visually-hidden">{t("home.about.hiddenTitle")}</h2>

              <picture className="home-about-background js-in-view appear-fade">
                <source data-srcset="/static/assets/images/home/about-xxs.png" media="(max-width: 450px)" />
                <source data-srcset="/static/assets/images/home/about-m.png" media="(max-width: 815px)" />
                <source data-srcset="/static/assets/images/home/about-l.png" media="(max-width: 1030px)" />
                <img data-src="/static/assets/images/home/about-xl.png" className="js-lazy" alt="" />
              </picture>

              <div className="center">
                <header className="home-about-header js-in-view">
                  <p className="home-about-headline appear-fade-up">{t("home.about.headline")}</p>
                  <Fx name="home-about" className="home-about-title fx-parent" t={t} />
                </header>

                <div className="home-about-content js-in-view">
                  <div className="home-about-text typeset">
                    <p className="appear-fade-up appear-delay--3">
                      {t("home.about.text1")}
                      <br />
                      {t("home.about.text2")}
                    </p>
                    <p className="appear-fade-up appear-delay--4">
                      {t("home.about.text3")}
                    </p>
                  </div>

                  <a href={href("/values/")} className="home-about-link link link--under" title={t("home.about.link")}>
                    {" "}
                    <span className="link-label">{t("shared.menu.values")}</span>{" "}
                    <span className="link-line" />{" "}
                    <span className="link-line--anim" />{" "}
                  </a>
                </div>
              </div>
            </section>
          </main>
        </div>

        <CookieBar t={t} href={href} />

        <SiteFooter t={t} href={href} locale={locale} path={path} />
      </div>
  );
}

export const PAGE_TITLE = "meta.home.title";

export default {
  BODY_CLASS: "lock-scroll",
  DATA_THEME: "home",
  DATA_PAGE: "home",
  PAGE_TITLE,
  Content: HomeContent,
} satisfies PageModule;

