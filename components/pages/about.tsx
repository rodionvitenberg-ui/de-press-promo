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
 * About — JSX twin of components/legacy/markups/about.ts.
 * DOM must be 1:1 with the legacy snapshot (scripts/html-diff.mjs guards it).
 */

/** Roadmap table: [year, decision badge, decision, status, essence, comment]. */
const TABLE_ROWS: string[][] = [
  ["2024", "старт", "Проект", "Родился", "de-press переосмыслен как «тихая гавань»", "Некоммерческий, открытый код"],
  ["2025", "инвариант", "Лайки", "Навсегда отменены", "Нет публичных лайков и рейтингов страдания", "Боль не собирает очки"],
  ["2025", "инвариант", "Комментарии", "Навсегда отменены", "Нет публичных комментариев под историей", "Только тихие фразы"],
  ["2025", "инвариант", "Чат", "Принято", "Чат инициирует только автор", "accept или Author Outreach"],
  ["2025", "инвариант", "ИИ", "Принято", "ИИ всегда помечен", "Без диагнозов и toxic positivity"],
  ["2025", "инвариант", "Карты эмоций", "Принято", "Только на устройстве пользователя", "ZK: сервер не видит"],
  ["2025", "инвариант", "Anti-Panic", "Принято", "Важнее ленты и realtime", "Тишина важнее охвата"],
  ["2025", "инвариант", "Кризис", "Принято", "112/103 и страница /safety", "Честность вместо запретов"],
  ["2025", "инвариант", "Helper", "Принято", "Helper ≠ терапевт", "Присутствие, не лечение"],
  ["2025", "не будет", "Треды", "Отменено", "Публичные обсуждения историй", "Приватно всё, кроме тишины"],
  ["2025", "не будет", "Карта травм", "Отменено", "Серверное хранение состояний", "Только устройство"],
  ["2025", "не будет", "AI-peer", "Отменено", "Скрытые роботы-собеседники", "Только помеченный ИИ"],
  ["2025", "не будет", "Open matching", "Отменено", "Публичный поиск собеседников", "Решение за автором"],
  ["2025", "не будет", "Голосовые", "Отменено", "WebRTC-комнаты", "Слишком шумно"],
  ["2026", "в работе", "GL-модуль", "Пишется", "Собственная сцена вместо бандлов", "API 1:1 SceneGL"],
  ["2026", "в работе", "Сцена", "Пишется", "JSON-стейты: камера, сплайны, matcap", "Catmull-Rom"],
  ["2026", "в работе", "Нарратив", "Пишется", "История проекта вместо кейсов", ""],
  ["2026", "в работе", "Модель", "Ищем", "Собственная 3D-модель", ""],
  ["2026", "готово", "/safety", "Живёт", "Кризисная страница 112/103", ""],
  ["2026", "в работе", "Промо", "Пишется", "Тексты и метаданные страниц", ""],
  ["2026", "решение", "Приватность", "Принято", "Минимум данных, без трекеров", "Навсегда"],
  ["2026", "решение", "Хостинг", "Принято", "Без рекламы и продажи данных", "Навсегда"],
  ["2026", "в работе", "Доступность", "Пишется", "Контраст, клавиатура, читаемость", ""],
  ["2026", "идея", "Локализация", "Открыто", "Сначала русский, потом English", ""],
  ["2026", "открыто", "Исследование", "Идёт", "Что помогает: слушание vs советы", ""],
  ["2026", "скоро", "Пилот", "2026", "Закрытый пилот сообщества", "Стучитесь на /contact/"],
  ["2026", "дизайн", "Hearers", "Рисуем", "Виден только автору облачка", ""],
  ["2026", "дизайн", "Pulse", "Рисуем", "Пульс истории — только автору", ""],
];

const PRODUCTS: { text: string; small?: string }[] = [
  { text: "Нет публичных лайков и рейтингов" },
  { text: "Нет публичных комментариев" },
  { text: "Чат инициирует только автор" },
  { text: "Открытые технологии", small: "(открытый код, ИИ с честной меткой, WebRTC)" },
  { text: "Эмоциональные карты — только на устройстве" },
  { text: "Anti-Panic важнее ленты" },
  { text: "Helper ≠ терапевт по умолчанию" },
];

const CLIENT_IMAGES = [
  "Group-4590", "Group-4581", "Group-4589", "Group-4591", "Group-4577",
  "Group-4585", "Group-4584", "Group-4579", "Group-4587", "Group-4583",
  "Group-4588", "Group-4578", "Group-4582", "Group-4580", "Group-4586",
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
              <h1 className="u-visually-hidden">{t("Мы строим тихую гавань — без лайков и рейтингов")}</h1>

              <p className="about-headline about-headline--blue appear-fade-up">{t("Наше обязательство")}</p>
              <Fx name="about-intro" className="about-title about-title--large fx-parent" t={t} />
            </header>

            <div className="about-item about-item--1 js-in-view">
              <p className="about-headline appear-fade-up">{t("Для начала")}</p>
              <p className="about-tagline appear-fade-up appear-delay--2">{t("de-press — эмпатичная платформа для эмоциональной поддержки. Наша миссия — исследовать, как тишина, истории и контроль автора заменяют механику лайков и рейтингов.")}</p>
            </div>

            <div className="about-item about-item--2 js-in-view">
              <p className="about-title about-title--small appear-fade-up">{t("И что это значит?")}</p>
              <div className="about-text typeset appear-fade-up appear-delay--2">
                <p>{t("Мы верим в силу истории и присутствия: «Я слышу тебя» заменяет лайк, тихая фраза — комментарий, а решение всегда за автором истории.")}</p>
                <p>
                  {t("Устал читать одинаковые описания проектов, которые притворяются другими?")}
                  <br />
                  {t("Хорошая новость: мы тоже. Поэтому сразу к делу — как устроена помощь здесь.")}
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
              <CaretLink bare="/" label="Смотреть, как устроено" href={href} t={t} className="link link--caret js-in-view" />
            </div>

            <header className="about-header about-header--2 js-in-view">
              <h2 className="u-visually-hidden">{t("Инварианты и решения. Да, снова принципы.")}</h2>

              <p className="about-headline appear-fade-up">{t("Что уже решено")}</p>
              <Fx name="about-swagger" className="about-title fx-parent" t={t} />
            </header>

            <div className="about-item about-item--3 js-in-view appear-fade-up">
              <div className="about-text typeset">
                <p>{t("Таблица — это наши принципы и статус проекта: что принято навсегда, что в работе, чего не будет. Не награды — обещания.")}</p>
              </div>
            </div>

            <div className="about-table js-in-view appear-fade-up">
              <div className="about-table-inner">
                <table cellPadding="0" cellSpacing="0">
                  <thead>
                    <tr>
                      <th>{t("Год")}</th>
                      <th>{t("Решение")}</th>
                      <th>{t("Статус")}</th>
                      <th>{t("Суть")}</th>
                      <th>{t("Комментарий")}</th>
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
              {tx(t, "Смотреть ещё   ")}
              <span className="svg svg-cross">
                <svg width="12" height="12">
                  <use xlinkHref="/static/assets/spritesheet.svg#cross" />
                </svg>
              </span>
            </button>


            <div className="about-item about-item--4 js-in-view">
              <p className="about-headline appear-fade-up">{t("Для начала")}</p>
              <p className="about-tagline appear-fade-up appear-delay--2">{t("Наша цель — бережные опыты, о которых хочется рассказать тихо: без лайков и рейтингов, но с реальной пользой для тех, кому сейчас трудно.")}</p>
            </div>

            <div className="about-item about-item--5 js-in-view">
              <h2 className="about-title about-title--small appear-fade-up">{t("Тишина — в деталях")}</h2>
              <div className="about-text typeset appear-fade-up appear-delay--2">
                <p>
                  {t("«Будь гибкой, но держись своих принципов» — тут Элеонора права.")}
                  <br />
                  {t("Наш уклад вырос из опыта: успехов и провалов, тихих смен и чужих историй. Чем глубже понимаешь чужую боль, тем бережнее должна быть помощь. Вот и весь принцип.")}
                </p>
              </div>
            </div>

            <div className="about-item about-item--6 js-in-view appear-fade-up">
              <h2 className="about-title about-title--small appear-fade-up">{t("Как здесь устроено")}</h2>
              <div className="about-text typeset appear-fade-up appear-delay--2">
                <p>{t("Мы знаем своё дело, но не твою историю — и это правильно: настоящая помощь начинается со знакомства. Работать можно только вместе: с автором, с Helper’ами и теми, кто просто рядом (даже если это ночная переписка)")}</p>
                <p>{t("Прежде чем что-то делать, мы всегда начинаем со знакомства.")}</p>
              </div>
            </div>

            <div className="about-item about-item--7 js-in-view appear-fade-up">
              <div className="about-text typeset">
                <p>{t("Твоя история, твои ожидания, твой темп и твои границы — всё это важно, вплоть до любимого чая.")}</p>
                <p>{t("Если тебе нужен просто исполнитель задач — без доверия и разговора, честно покажем, куда идти дальше.")}</p>
              </div>

              <CaretLink bare="/values/" label="Ещё о принципах" href={href} t={t} className="link link--caret" />
            </div>

            <header className="about-header about-header--3 js-in-view">
              <h2 className="u-visually-hidden">{t("Кто с нами")}</h2>

              <p className="about-headline appear-fade-up">{t("Нам доверяют истории")}</p>
              <Fx name="about-clients" className="about-title" t={t} />
            </header>

            <div className="about-clients">
              {CLIENT_IMAGES.map((name) => (
                <div key={name} className="about-clients-item js-in-view appear-fade-up">
                  <img src={`/app/uploads/2019/02/${name}.png`} alt="" />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      <CookieBar t={t} href={href} />

      <SiteFooter t={t} href={href} locale={locale} path={path} />
    </div>
  );
}

export const PAGE_TITLE = "О проекте — de-press";

export default {
  BODY_CLASS: "lock-scroll",
  DATA_THEME: "about",
  DATA_PAGE: "about",
  PAGE_TITLE,
  Content: AboutContent,
} satisfies PageModule;

