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
    title: "Что здесь хранится",
    items: [
      "Анонимная сессия — UUID в cookie. Для сервера это и есть ты: без регистрации и без имени.",
      "Псевдоним — любая строка, можно пустую. Отдельно мы ведём служебные флаги помощи — это учёт, кому помогли; привязывать его к аккаунту не обязательно.",
      "Email — только если ты сам завёл аккаунт или попросил уведомления. Иначе поле просто пустое.",
      "Telegram id — только при входе через Telegram Mini App.",
      "Истории, диалоги, сообщения — это и есть проект. Их автор для нас — тот же UUID, а не человек с именем.",
      "Голосовые и видео-круги — файлы внутри диалога. Храним их только с согласия автора.",
      "Уведомления, жалобы, блокировки — приватные события получателя, псевдонимные, как всё остальное.",
      "Адрес Solana для благодарности помощнику публикует сам помощник — по желанию.",
    ],
  },
  {
    title: "Чего здесь нет",
    items: [
      "IP-адресов. Код не записывает их никогда. Единственное место, где IP участвует, — защита каталога переводов от перебора: в кеше на час остаётся только хеш, подмешанный с секретным ключом. Сам адрес не сохраняется даже там.",
      "User-Agent — не читается и не записывается.",
      "Логов с IP и User-Agent: nginx в продакшене пишет приватный формат.",
      "Google Analytics, Яндекс.Метрики, профилей в Sentry — никакой поведенческой аналитики.",
      "Лайков и просмотров — их нет в модели данных: тихая эмпатия вместо гонки за охваты.",
      "Приватных ключей и платежей. Деньги идут кошелёк → кошелёк, платформа видит только статус.",
    ],
  },
  {
    title: "Сколько это живёт",
    items: [
      "Голосовые сообщения исчезают вместе с диалогом. Останутся, только если автор сам выбрал «сохранить».",
      "Видео-круги удаляются, когда диалог закрыт.",
      "Анонимная сессия живёт в твоём cookie — и за ней ничего, кроме UUID и необязательных полей из списка выше.",
    ],
  },
];

/** «Не веришь — проверь»: principles, self-hosting and CTA in one closing section. */
const TRUST_ITEMS = [
  "Ни одна функция не требует регистрации. Email и Telegram — необязательные каналы уведомлений, а не вход.",
  "В данных нет настоящих имён, телефонов, дат рождения, геолокации, аватаров и социальных графов.",
  "В коде нет ни пикселей, ни рекламы, ни снятия отпечатков браузера.",
  "Практики самопомощи работают прямо в браузере и не покидают твоё устройство.",
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
                {t("de-press.co · приватность")}
              </p>
              <h1 className="privacy-title appear-fade-up appear-delay--1">
                {t("Приватность")}
              </h1>
              <p className="privacy-lead appear-fade-up appear-delay--2">
                {t(
                  "Здесь рассказывают то, что не рассказывают никому. Поэтому о данных мы говорим прямо: что сохраняется, чего здесь нет и как долго это живёт.",
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
              <h2 className="privacy-subtitle appear-fade-up">{t("Не веришь — проверь")}</h2>
              <ul className="privacy-list appear-fade-up appear-delay--1">
                {TRUST_ITEMS.map((item) => (
                  <li key={item}>{t(item)}</li>
                ))}
              </ul>
              <div className="privacy-text appear-fade-up appear-delay--1">
                <p>
                  {t(
                    "Каждая строчка выше — свойство кода, а не обещание. Платформа самохостится: подними свой экземпляр и загляни в таблицы базы сам.",
                  )}
                </p>
              </div>
              <a href={href("/")} className="privacy-more link link--under">
                {" "}
                <span className="link-label">{t("Смотреть, как устроено")}</span>{" "}
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

export const PAGE_TITLE = "Приватность — de-press";

export default {
  BODY_CLASS: "lock-scroll",
  DATA_THEME: "privacy",
  DATA_PAGE: "privacy",
  PAGE_TITLE,
  Content: PrivacyContent,
} satisfies PageModule;