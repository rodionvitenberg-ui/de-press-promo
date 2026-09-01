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
        title: ["Расти", "вместе с людьми,", "а не с лентой"],
        text: [
          "Боль не собирает очки. Мы убираем механики, которые превращают чужую историю в соревнование.",
        ],
      },
      {
        n: 2,
        delay: 2,
        title: ["Каждый отвечает", "за свою", "тишину"],
        text: [
          "Под чужой историей не место спорам. Только тихие фразы и резонанс — всё остальное приватно.",
        ],
      },
    ],
  },
  {
    items: [
      {
        n: 3,
        delay: 1,
        title: ["Гибко —", "и по-человечески", "бережно"],
        text: [
          "Диалог — это приглашение, а не вторжение. Автор решает, кому ответить: accept или Author Outreach.",
        ],
      },
      {
        n: 4,
        delay: 2,
        title: ["Всегда", "рядом — онлайн"],
        text: [
          "Без скрытых роботов-собеседников, без диагнозов, без toxic positivity. Помощь машины — только с честной меткой.",
        ],
      },
    ],
  },
  {
    items: [
      {
        n: 5,
        delay: 1,
        title: ["В помощь верь,", "но проверяй"],
        text: [
          "Эмоциональные карты живут на устройстве пользователя (ZK). Сервер не видит и не хранит карту твоих состояний.",
        ],
      },
      {
        n: 6,
        delay: 2,
        title: ["Без привязки", "к платформе —", "открытый код"],
        text: [
          "Когда плохо — не время охватов. Режим тишины и путь к /safety всегда важнее любого realtime.",
        ],
      },
      {
        n: 7,
        delay: 3,
        title: ["Развиваемся", "тихо и постоянно"],
        text: [
          "Мы не экстренная служба. При кризисе — 112, 103 и страница /safety. Это не отговорка, это честность.",
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
        title: ["Ценим долгие", "и тихие истории"],
        text: [
          "Helper — слушающий человек, а не врач. Мы не заменяем терапию и не притворяемся, что заменяем.",
        ],
      },
      {
        n: 9,
        delay: 2,
        title: ["Всё решает честный", "разговор"],
        text: [
          "Прозрачность — основа.",
          "Никаких скрытых механик, тёмных паттернов и невидимых манипуляторов: как работает платформа, видно всем. Открытость — это и есть помощь.",
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
        title: ["Мы слышим", "тебя"],
        text: [
          "Не на каждое сообщение нужен ответ. Присутствие без слов — тоже поддержка. Всё в заголовке.",
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
          <h1 className="u-visually-hidden">{t("Принципы")}</h1>

          <section className="values-hero">
            <h2 className="u-visually-hidden">
              {t("Потому что культура — это не фича в роадмапе")}
            </h2>

            <div className="center">
              <header className="values-hero-header js-in-view">
                <p className="values-headline appear-fade-up">
                  {t("Во что мы верим")}
                </p>
                <Fx name="values-culture" className="values-title fx-parent" t={t} />
              </header>

              <div className="values-hero-content js-in-view">
                <p className="values-headline appear-fade-up">
                  {t("Для начала")}
                </p>
                <p className="values-text appear-fade-up appear-delay--2">
                  {t(
                    "Всё, что мы строим, проходит через десять принципов. Через «не надо» и «зачем». Через тишину и уважение.",
                  )}
                </p>
              </div>
            </div>
          </section>

          <section className="values-list">
            <div className="center">
              <header className="values-list-header js-in-view">
                <h2 className="u-visually-hidden">
                  {t("Нет, это не правила ради правил...")}
                </h2>

                <img
                  data-src="/static/assets/images/values/background-leaves-1.png"
                  className="leaves leaves--1 js-lazy"
                />

                <Fx name="values-tgif" className="values-title fx-parent" t={t} />

                <p className="values-subtitle appear-fade appear-delay--7">
                  {t("Дальше — сами принципы...")}
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
                  {t("Мы всегда рады тем, кто умеет слышать")}
                </h2>

                <img
                  data-src="/static/assets/images/values/background-leaves-3.png"
                  className="leaves leaves--3 js-lazy"
                />

                <Fx name="values-hiring" className="values-title fx-parent" t={t} />

                <a
                  href="mailto:hello@de-press.co"
                  className="values-link link link--under"
                  title={t("Как помогать")}
                >
                  {" "}
                  <span className="link-label">{t("Как помогать")}</span>{" "}
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

export const PAGE_TITLE = "Принципы — de-press";

export default {
  BODY_CLASS: "lock-scroll",
  DATA_THEME: "values",
  DATA_PAGE: "values",
  PAGE_TITLE,
  Content: ValuesContent,
} satisfies PageModule;
