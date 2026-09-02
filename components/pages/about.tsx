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
 * About — originalized JSX page (was components/legacy/markups/about.ts;
 * the legacy snapshot was deleted in A3 — git history keeps it).
 */

/** Roadmap table: [year, decision badge, decision, status, essence, comment]. */
const TABLE_ROWS: string[][] = [
  ["2024", "about.table.badge.start", "about.table.row.project", "about.table.stat.born", "about.table.essence.rebirth", "about.table.comment.nonprofit"],
  ["2025", "about.table.badge.invariant", "about.table.row.likes", "about.table.stat.foreverCancelled", "about.table.essence.noLikeScores", "about.table.comment.painNoPoints"],
  ["2025", "about.table.badge.invariant", "about.table.row.comments", "about.table.stat.foreverCancelled", "about.table.essence.noComments", "about.table.comment.quietPhrasesOnly"],
  ["2025", "about.table.badge.invariant", "about.table.row.chat", "about.table.stat.accepted", "about.products.authorChat", "about.table.comment.acceptOutreach"],
  ["2025", "about.table.badge.invariant", "about.table.row.ai", "about.table.stat.accepted", "about.table.essence.aiLabeled", "about.table.comment.noDiagnoses"],
  ["2025", "about.table.badge.invariant", "about.table.row.emotionMaps", "about.table.stat.accepted", "about.table.essence.onDevice", "about.table.comment.zk"],
  ["2025", "about.table.badge.invariant", "Anti-Panic", "about.table.stat.accepted", "about.table.essence.overFeed", "about.table.comment.silenceOverReach"],
  ["2025", "about.table.badge.invariant", "about.table.row.crisis", "about.table.stat.accepted", "about.table.essence.crisisPath", "about.table.comment.honesty"],
  ["2025", "about.table.badge.invariant", "Helper", "about.table.stat.accepted", "about.table.essence.helperNotTherapist", "about.table.comment.presence"],
  ["2025", "about.table.badge.never", "about.table.row.threads", "about.table.stat.cancelled", "about.table.essence.noThreads", "about.table.comment.privacy"],
  ["2025", "about.table.badge.never", "about.table.row.traumaMap", "about.table.stat.cancelled", "about.table.essence.noServerStates", "about.table.comment.deviceOnly"],
  ["2025", "about.table.badge.never", "AI-peer", "about.table.stat.cancelled", "about.table.row.aiPeer", "about.table.comment.labeledOnly"],
  ["2025", "about.table.badge.never", "Open matching", "about.table.stat.cancelled", "about.table.essence.noOpenMatching", "about.table.comment.authorDecides"],
  ["2025", "about.table.badge.never", "about.table.row.voice", "about.table.stat.cancelled", "about.table.essence.noWebRTC", "about.table.comment.tooNoisy"],
  ["2026", "about.table.badge.wip", "about.table.row.glModule", "about.table.stat.writing", "about.table.essence.ownScene", "API 1:1 SceneGL"],
  ["2026", "about.table.badge.wip", "about.table.row.scene", "about.table.stat.writing", "about.table.essence.jsonStates", "Catmull-Rom"],
  ["2026", "about.table.badge.wip", "about.table.row.narrative", "about.table.stat.writing", "about.table.essence.storyOverCases", ""],
  ["2026", "about.table.badge.wip", "about.table.row.model", "about.table.stat.searching", "about.table.essence.ownModel", ""],
  ["2026", "about.table.badge.done", "/safety", "about.table.stat.alive", "about.table.essence.safetyPage", ""],
  ["2026", "about.table.badge.wip", "about.table.row.promo", "about.table.stat.writing", "about.table.essence.copyMeta", ""],
  ["2026", "about.table.badge.decision", "common.privacy", "about.table.stat.accepted", "about.table.essence.minimalData", "about.table.comment.forever"],
  ["2026", "about.table.badge.decision", "about.table.row.hosting", "about.table.stat.accepted", "about.table.essence.noAds", "about.table.comment.forever"],
  ["2026", "about.table.badge.wip", "about.table.row.a11y", "about.table.stat.writing", "about.table.essence.a11y", ""],
  ["2026", "about.table.badge.idea", "about.table.row.localization", "about.table.stat.open", "about.table.essence.ruThenEn", ""],
  ["2026", "about.table.badge.open", "about.table.row.research", "about.table.stat.ongoing", "about.table.essence.listening", ""],
  ["2026", "about.table.badge.soon", "about.table.row.pilot", "2026", "about.table.essence.pilot", "about.table.comment.contactUs"],
  ["2026", "about.table.badge.design", "Hearers", "about.table.stat.drawing", "about.table.essence.hearersVisible", ""],
  ["2026", "about.table.badge.design", "Pulse", "about.table.stat.drawing", "about.table.essence.pulseVisible", ""],
];

const PRODUCTS: { text: string; small?: string }[] = [
  { text: "about.products.noLikes" },
  { text: "about.products.noComments" },
  { text: "about.products.authorChat" },
  { text: "about.products.openTech", small: "about.products.openTechNote" },
  { text: "about.products.emotionMaps" },
  { text: "about.products.antiPanic" },
  { text: "about.products.helper" },
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
                {PRODUCTS.map((product) => (
                  <li key={product.text} className="about-products-item js-in-view appear-fade-right">
                    {t(product.text)}
                    {product.small ? (
                      <>
                        <br />
                        <small>{t(product.small)}</small>
                      </>
                    ) : null}
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

            <div className="about-table js-in-view appear-fade-up">
              <div className="about-table-inner">
                <table cellPadding="0" cellSpacing="0">
                  <thead>
                    <tr>
                      <th>{t("about.table.year")}</th>
                      <th>{t("about.table.decision")}</th>
                      <th>{t("about.table.status")}</th>
                      <th>{t("about.table.essence")}</th>
                      <th>{t("about.table.comment")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TABLE_ROWS.map((row) => (
                      <tr key={row[2]}>
                        <td data-after="">{t(row[0])}</td>
                        <td data-after={t(row[1])}>{t(row[2])}</td>
                        <td data-after="">{t(row[3])}</td>
                        <td data-after="">{t(row[4])}</td>
                        <td data-after="">{t(row[5])}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <button className="about-table-more js-table-expand">
              {tx(t, "about.table.more   ")}
              <span className="svg svg-cross">
                <svg width="12" height="12">
                  <use xlinkHref="/static/assets/spritesheet.svg#cross" />
                </svg>
              </span>
            </button>


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

