import type { PageContentProps, PageModule } from "./renderer";
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
 * Contact — originalized JSX page (was components/legacy/markups/contact.ts;
 * the legacy snapshot was deleted in A3 — git history keeps it).
 * The rotating sentences (div.js-sentences) ship as a compact JSON array —
 * the exact shape the legacy pipeline produced.
 */

const SENTENCES = [
  "contact.invite.01",
  "contact.invite.02",
  "contact.invite.03",
  "contact.invite.04",
  "contact.invite.05",
  "contact.invite.06",
  "contact.invite.07",
  "contact.invite.08",
  "contact.invite.09",
  "contact.invite.10",
  "contact.invite.11",
  "contact.invite.12",
  "contact.invite.13",
  "contact.invite.14",
  "contact.invite.15",
  "contact.invite.16",
  "contact.invite.17",
  "contact.invite.18",
  "contact.invite.19",
  "contact.invite.20",
  "contact.invite.21",
  "contact.invite.22",
  "contact.invite.23",
  "contact.invite.24",
  "contact.invite.25",
  "contact.invite.26",
  "contact.invite.27",
  "contact.invite.28",
  "contact.invite.29",
  "contact.invite.30",
  "contact.invite.31",
  "contact.invite.32",
  "contact.invite.33",
  "contact.invite.34",
];

type Country = {
  /** Maps link of the empty .contact-country__link (aria-label is NOT localized — legacy pipeline never touched it). */
  map: string;
  name: string;
  text: string;
};

const COUNTRIES: Country[] = [
  {
    map: "https://maps.app.goo.gl/QLrbQe5WPhrRh58b9",
    name: "common.word.silence",
    text: "contact.country.silence",
  },
  {
    map: "https://maps.app.goo.gl/pFgX1QnHKBYaRA3m9",
    name: "common.word.empathy",
    text: "contact.country.empathy",
  },
  {
    map: "https://maps.app.goo.gl/pM9YBEdDGppzd3Po6",
    name: "common.word.care",
    text: "contact.country.care",
  },
];

function ContactContent({ t, locale, path, href }: PageContentProps) {
  return (
    <div className="site-wrapper">
      <SiteHeader t={t} href={href} />

      <SiteLoader />

      <SceneRoot />

      <SiteMenuBack />

      <SiteMenuPanel />

      <SiteMenu active="contact" t={t} href={href} />

      <div className="site-container" data-router-wrapper="">
        <main data-router-view="contact" role="main" data-sentences="">
          <h1 className="u-visually-hidden">{t("shared.footer.writeUs")}</h1>

          <div className="js-sentences u-hidden">
            {JSON.stringify(SENTENCES.map((s) => t(s)))}
          </div>

          <picture className="contact-background js-in-view appear-fade">
            <source
              data-srcset="/static/assets/images/contact/background-xxs.png"
              media="(max-width: 450px)"
            />
            <source
              data-srcset="/static/assets/images/contact/background-m.png"
              media="(max-width: 815px)"
            />
            <source
              data-srcset="/static/assets/images/contact/background-l.png"
              media="(max-width: 1030px)"
            />
            <img
              data-src="/static/assets/images/contact/background-xl.png"
              className="js-lazy"
              alt=""
            />
          </picture>

          <div className="center js-in-view">
            <p className="contact-title">
              <span className="js-typed" />
            </p>

            <div className="contact-footer js-in-view">
              <div className="contact-footer__title">
                <a
                  href="mailto:hello@de-press.co"
                  className="contact-email appear-fade-up"
                >
                  hello@de-press.co
                </a>

                <ul>
                  <li>
                    <a href="https://t.me/depresscoofficial" target="_blank">
                      {t("Telegram")}
                    </a>
                  </li>
                  {/* Кнопка X скрыта до появления рабочего аккаунта
                  <li>
                    <a href="https://x.com/soshallitbe5" target="_blank">
                      {t("X")}
                    </a>
                  </li>
                  */}
                  <li>
                    <a href="mailto:hello@de-press.co" target="_blank">
                      {t("E-mail")}
                    </a>
                  </li>
                  <li>
                    <a href={href("/values/")} target="_blank">
                      {t("contact.digestTitle")}
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/de-pressco/de-press"
                      target="_blank"
                    >
                      {t("GitHub")}
                    </a>
                  </li>
                </ul>
              </div>

              <div className="contact-countries">
                {COUNTRIES.map((country, i) => (
                  <div
                    key={country.name}
                    className={`contact-country appear-fade-up appear-delay--${i + 1}`}
                  >
                    <a
                      href={country.map}
                      target="_blank"
                      className="contact-country__link"
                      aria-label={country.name}
                    />

                    <div className="contact-country__text">
                      <h2>
                        {t(country.name)} <b>.</b>
                      </h2>
                      <p>{t(country.text)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      <CookieBar t={t} href={href} />

      <SiteFooter t={t} href={href} locale={locale} path={path} />
    </div>
  );
}

export const PAGE_TITLE = "meta.contact.title";

export default {
  BODY_CLASS: "lock-scroll",
  DATA_THEME: "contact",
  DATA_PAGE: "contact",
  PAGE_TITLE,
  Content: ContactContent,
} satisfies PageModule;
