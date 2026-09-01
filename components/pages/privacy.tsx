import { type PageContentProps, type PageModule } from "./renderer";
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

/**
 * Privacy — originalized JSX page (was components/legacy/PrivacyContent.tsx,
 * retired after the rework — git history keeps it). Full site page like
 * about/values: shared chrome + island on its own PRIVACY_STATE pose (the
 * about pose, raised and shifted right of the title). Copy follows the
 * project copywriting guidelines — plain, conversational, no catalog-speak —
 * while keeping the A4 factual inventory (GDPR-docs/PRIVACY.md). Content
 * styles live in depress.css (.privacy-*).
 */

/** List sections: section title → items (dictionary keys). */
const SECTIONS: { title: string; items: string[] }[] = [
  {
    title: "privacy.storedTitle",
    items: [
      "privacy.stored.session",
      "privacy.stored.alias",
      "privacy.stored.email",
      "privacy.stored.telegramId",
      "privacy.stored.stories",
      "privacy.stored.voice",
      "privacy.stored.notifications",
      "privacy.stored.solana",
    ],
  },
  {
    title: "common.notHereTitle",
    items: [
      "privacy.notHere.ip",
      "privacy.notHere.userAgent",
      "privacy.notHere.logs",
      "privacy.notHere.analytics",
      "privacy.notHere.likes",
      "privacy.notHere.keys",
    ],
  },
  {
    title: "privacy.retentionTitle",
    items: [
      "privacy.retention.voice",
      "privacy.retention.video",
      "privacy.retention.session",
    ],
  },
];

/** «Не веришь — проверь»: principles, self-hosting and CTA in one closing section. */
const TRUST_ITEMS = [
  "privacy.verify.registration",
  "privacy.verify.data",
  "privacy.verify.code",
  "privacy.verify.practices",
];

function PrivacyContent({ t, locale, path, href }: PageContentProps) {
  return (
    <div className="site-wrapper">
      <SiteHeader t={t} href={href} />

      <SiteLoader />

      <SceneRoot />

      <SiteMenuBack />

      <SiteMenuPanel />

      <SiteMenu active={null} t={t} href={href} />

      <div className="site-container" data-router-wrapper="">
        <main data-router-view="privacy" role="main">
          <div className="center">
            <header className="privacy-header js-in-view">
              <p className="privacy-headline privacy-headline--blue appear-fade-up">
                {t("privacy.hiddenTitle")}
              </p>
              <h1 className="privacy-title appear-fade-up appear-delay--1">
                {t("common.privacy")}
              </h1>
              <p className="privacy-lead appear-fade-up appear-delay--2">
                {t(
                  "privacy.lead",
                )}
              </p>
            </header>

            {SECTIONS.map((section) => (
              <section className="privacy-section js-in-view" key={section.title}>
                <h2 className="privacy-subtitle appear-fade-up">{t(section.title)}</h2>
                <ul className="privacy-list appear-fade-up appear-delay--1">
                  {section.items.map((item) => (
                    <li key={item}>{t(item)}</li>
                  ))}
                </ul>
              </section>
            ))}

            <section className="privacy-section js-in-view">
              <h2 className="privacy-subtitle appear-fade-up">{t("privacy.verifyTitle")}</h2>
              <ul className="privacy-list appear-fade-up appear-delay--1">
                {TRUST_ITEMS.map((item) => (
                  <li key={item}>{t(item)}</li>
                ))}
              </ul>
              <div className="privacy-text appear-fade-up appear-delay--1">
                <p>
                  {t(
                    "privacy.verify.selfHosted",
                  )}
                </p>
              </div>
              <a href={href("/")} className="privacy-more link link--under">
                {" "}
                <span className="link-label">{t("common.watchHowItWorks")}</span>{" "}
                <span className="link-line" />{" "}
                <span className="link-line--anim" />{" "}
              </a>
            </section>
          </div>
        </main>
      </div>

      <CookieBar t={t} href={href} />

      <SiteFooter t={t} href={href} locale={locale} path={path} />
    </div>
  );
}

export const PAGE_TITLE = "meta.privacy.title";

export default {
  BODY_CLASS: "lock-scroll",
  DATA_THEME: "privacy",
  DATA_PAGE: "privacy",
  PAGE_TITLE,
  Content: PrivacyContent,
} satisfies PageModule;