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
  "Если тебе тоже тесно в лентах — напиши нам",
  "Если хочешь помогать слышать — напиши нам",
  "Если умеешь слушать без советов — напиши нам",
  "Если хочешь в пилот — напиши нам",
  "Если можешь поддержать проект — напиши нам",
  "Если умеешь кодить — напиши нам",
  "Если умеешь рисовать облачка — напиши нам",
  "Если видишь дыру в приватности — напиши нам",
  "Если хочешь переводить тишины — напиши нам",
  "Если умеешь писать бережно — напиши нам",
  "Если просто хочешь сказать привет — напиши нам",
  "Если тебе плохо прямо сейчас — открой /safety",
  "Если кризис — сразу 112 или 103",
  "Если хочешь модерировать тишину — напиши нам",
  "Если веришь, что помощь без лайков возможна — напиши нам",
  "Если устал от токсичной позитивности — напиши нам",
  "Если хочешь тестировать Anti-Panic — напиши нам",
  "Если умеешь делать доступно — напиши нам",
  "Если знаешь, как звучит «Я слышу тебя» на твоём языке — напиши нам",
  "Если у тебя есть похожая история — напиши нам",
  "Если хочешь стать Helper’ом — напиши нам",
  "Если умеешь слышать молчание — напиши нам",
  "Если тебя тошнит от рейтингов — напиши нам",
  "Если хочешь помочь с открытым кодом — напиши нам",
  "Если умеешь рисовать сцены — напиши нам",
  "Если пишешь тексты, от которых легче — напиши нам",
  "Если хочешь в команду исследования — напиши нам",
  "Если умеешь считать честные метрики — напиши нам",
  "Если задумался о приватности данных — напиши нам",
  "Если хочешь просто почитать — начни с /values/",
  "Если дочитал до конца — точно напиши нам",
  "Если не знаешь, что написать — просто «привет»",
  "Если завтра будет тяжело — /safety рядом",
  "Если готов(а) — напиши нам",
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
    name: "Тишина",
    text: "Тишина: здесь нет лент и рейтингов. Облачко — монолог, «Я слышу тебя», тихие фразы и похожая история.",
  },
  {
    map: "https://maps.app.goo.gl/pFgX1QnHKBYaRA3m9",
    name: "Эмпатия",
    text: "Эмпатия: Helper’ы читают и слышат. Чат начинает только автор. ИИ помечен всегда.",
  },
  {
    map: "https://maps.app.goo.gl/pM9YBEdDGppzd3Po6",
    name: "Забота",
    text: "Забота: при кризисе — 112, 103 и страница /safety. Это не медицина, и мы честно об этом говорим.",
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
          <h1 className="u-visually-hidden">{t("Написать нам")}</h1>

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
                  <li>
                    <a href="https://x.com/soshallitbe5" target="_blank">
                      {t("X")}
                    </a>
                  </li>
                  <li>
                    <a href="mailto:hello@de-press.co" target="_blank">
                      {t("E-mail")}
                    </a>
                  </li>
                  <li>
                    <a href={href("/values/")} target="_blank">
                      {t("Дайджест")}
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/rodionvitenberg-ui/de-press.co"
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

export const PAGE_TITLE = "Связаться — de-press";

export default {
  BODY_CLASS: "lock-scroll",
  DATA_THEME: "contact",
  DATA_PAGE: "contact",
  PAGE_TITLE,
  Content: ContactContent,
} satisfies PageModule;
