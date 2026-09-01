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
  group: string;
  name: string;
  headline: string;
  /** Exact template text per .home-cases-line (leading/trailing spaces matter). */
  lines: string[];
};

const CASES: CaseItem[] = [
  {
    theme: "tomorrowland",
    matcap: "18, 18",
    group: "Публичное",
    name: "Монолог",
    headline: "Облачко",
    lines: ["Твоя история — без лайков,", " без оценок и без гонки", " за вниманием."],
  },
  {
    theme: "navy-pier",
    matcap: "7, 7",
    group: "Публичное",
    name: "Я слышу тебя",
    headline: "Реакция",
    lines: ["Единственная реакция здесь —", " не лайк, а присутствие:", " «я рядом, я услышал»."],
  },
  {
    theme: "msi-chicago",
    matcap: "8, 8",
    group: "Публичное",
    name: "Тихие фразы",
    headline: "Поддержка",
    lines: ["Короткие слова поддержки. ", " Бережно, без споров ", " и без публичных тредов."],
  },
  {
    theme: "this-was-louises-phone",
    matcap: "11, 11",
    group: "Публичное",
    name: "Похожая история",
    headline: "Резонанс",
    lines: ["Чужой опыт, похожий на твой. ", " Связь через резонанс, ", " а не обсуждение."],
  },
  {
    theme: "kikk-18",
    matcap: "9, 9",
    group: "Автору",
    name: "Pulse",
    headline: "Автору",
    lines: ["Тихий пульс истории: её слышат — и это видно только тебе."],
  },
  {
    theme: "the-kennedy-center",
    matcap: "10, 10",
    group: "Автору",
    name: "Hearers",
    headline: "Автору",
    lines: ["Те, кто услышал историю.", " Список виден", " только её автору."],
  },
  {
    theme: "orw",
    matcap: "12, 12",
    group: "Безопасность",
    name: "Anti-Panic",
    headline: "Безопасность",
    lines: ["Режим тишины, когда всё", " слишком. Лента и уведомления", " молчат, помощь — рядом."],
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
          <p className="home-cases-headline">{t(item.headline)}</p>
          <p className="home-cases-name">{t(item.name)}</p>
          <p className="home-cases-text">
            {item.lines.flatMap((line, i) =>
              i === 0
                ? [<span key={i} className="home-cases-line">{tx(t, line)}</span>]
                : [" ", <span key={i} className="home-cases-line">{tx(t, line)}</span>],
            )}
          </p>
          <p className="link link--caret">
            <span className="link--caret-text">{t("Подробнее")}</span>{" "}
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
              <h2 className="u-visually-hidden">{t("Тебя услышат")}</h2>

              <div className="center">
                <Fx name="home-hero" className="home-hero-title fx-parent" t={t} />

                <div className="home-hero-content">
                  <p className="lead">
                    <span>{t("de-press — тихая гавань")}</span>{" "}
                    <span>{t("для тех, кому сейчас")}</span>{" "}
                    <span>{t("эмоционально тяжело.")}</span>
                  </p>

                  <p>
                    <span>{t("Вместо лайков, рейтингов и публичных реакций —")}</span>{" "}
                    <span>{t("тишина, истории и человек рядом, который скажет:")}</span>{" "}
                    <span>{t("«Я слышу тебя».")}</span>
                  </p>
                  <a href="https://app.de-press.co" target="_blank" className="home-app-link link link--under">
                    {" "}
                    <span className="link-label">{t("Открыть приложение")}</span>{" "}
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
                <h2 className="home-cases-title js-in-view appear-fade-up">{t("Истории")}</h2>

                <ul className="home-cases-list js-cases-list">
                  {CASES.map((item) => (
                    <li key={item.theme} className="js-in-view appear-fade-up">
                      <a href={href("/about/")} data-theme={item.theme} data-matcap={item.matcap}>
                        <span>{t(item.group)}</span>
                        {tx(t, ` ${item.name}`)}
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
              <h2 className="u-visually-hidden">{t("Мы делаем место, где не бывает оценок")}</h2>

              <picture className="home-about-background js-in-view appear-fade">
                <source data-srcset="/static/assets/images/home/about-xxs.png" media="(max-width: 450px)" />
                <source data-srcset="/static/assets/images/home/about-m.png" media="(max-width: 815px)" />
                <source data-srcset="/static/assets/images/home/about-l.png" media="(max-width: 1030px)" />
                <img data-src="/static/assets/images/home/about-xl.png" className="js-lazy" alt="" />
              </picture>

              <div className="center">
                <header className="home-about-header js-in-view">
                  <p className="home-about-headline appear-fade-up">{t("Так это устроено")}</p>
                  <Fx name="home-about" className="home-about-title fx-parent" t={t} />
                </header>

                <div className="home-about-content js-in-view">
                  <div className="home-about-text typeset">
                    <p className="appear-fade-up appear-delay--3">
                      {t("de-press — некоммерческая эмпатичная платформа.")}
                      <br />
                      {t("Мы против токсичных механик соцсетей: вместо лайков, рейтингов и публичных комментариев здесь тишина, истории и бережная поддержка.")}
                    </p>
                    <p className="appear-fade-up appear-delay--4">
                      {t("Проект живёт на энтузиазме волонтёров и открытом коде. Мы верим: просить о помощи — нормально, а слышать друг друга — навык, которому можно учиться.")}
                    </p>
                  </div>

                  <a href={href("/values/")} className="home-about-link link link--under" title={t("Читать принципы")}>
                    {" "}
                    <span className="link-label">{t("Принципы")}</span>{" "}
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

export const PAGE_TITLE = "de-press — тебя услышат";

export default {
  BODY_CLASS: "lock-scroll",
  DATA_THEME: "home",
  DATA_PAGE: "home",
  PAGE_TITLE,
  Content: HomeContent,
} satisfies PageModule;

