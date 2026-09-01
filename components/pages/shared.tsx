import type { Locale, Translator } from "@/i18n/core";
import { LangSwitcher, tx } from "./renderer";

/**
 * Page scaffold shared by all four JSX pages — the blocks that are byte-wise
 * identical across the four legacy markup snapshots (deleted in A3; the DOM
 * parity was verified page by page). Menu active item is the only per-page
 * variation.
 */

export type SharedProps = {
  t: Translator;
  href: (bare: string) => string;
};

export function CaretRight() {
  return (
    <span className="svg svg-caret-right">
      <svg width="7" height="11">
        <use xlinkHref="/static/assets/spritesheet.svg#caret-right" />
      </svg>
    </span>
  );
}

export function SiteHeader({ t, href }: SharedProps) {
  return (
    <div className="site-header">
      <div className="site-header-title">
        <a href={href("/")} className="site-header-logo" title={t("На главную — de-press")}>
          {" "}
          <span className="dp-logo">de-press<span className="dp-logo-tld">.co</span></span>{" "}
        </a>
      </div>

      <a href={href("/safety/")} className="site-header-posts">
        {" "}
        <span className="svg svg-caret-left">
          <svg width="6" height="11">
            <use xlinkHref="/static/assets/spritesheet.svg#caret-left" />
          </svg>
        </span>
        {tx(t, " Безопасность")}
      </a>{" "}
      <a href={href("/")} className="site-header-cases">
        {" "}
        <span className="svg svg-caret-left">
          <svg width="6" height="11">
            <use xlinkHref="/static/assets/spritesheet.svg#caret-left" />
          </svg>
        </span>
        {tx(t, " Как устроено")}
      </a>

      <button type="button" className="site-header-button" title={t("Открыть меню")}>
        <span className="u-visually-hidden">{t("Открыть меню")}</span>{" "}
        <span className="button-bar button-bar--1" />{" "}
        <span className="button-bar button-bar--2" />{" "}
        <span className="button-bar button-bar--3" />
      </button>
    </div>
  );
}

export function SiteLoader() {
  return (
    <div className="site-loader">
      <div className="site-loader-content">
        <span className="site-loader-sprite" />
        <div className="site-loader-progress">
          <svg>
            <circle r="65" cx="68" cy="68" className="site-loader-stroke" />
            <circle r="65" cx="68" cy="68" className="site-loader-percent" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export function SceneRoot() {
  return (
    <div className="scene-root">
      <div className="ruler ruler--top" />
      <div className="ruler ruler--bottom" />
      <div className="ruler ruler--1190" />
      <div className="ruler ruler--1024" />
      <div className="scene-root-inner" />
    </div>
  );
}

export function SiteMenuBack() {
  return (
    <picture className="site-menu-back">
      <source data-srcset="/static/assets/images/menu/background-xxs.png" media="(max-width: 450px)" />
      <source data-srcset="/static/assets/images/menu/background-m.png" media="(max-width: 815px)" />
      <source data-srcset="/static/assets/images/menu/background-l.png" media="(max-width: 1030px)" />
      <img data-src="/static/assets/images/menu/background-xl.png" className="js-lazy" alt="" />
    </picture>
  );
}

export function SiteMenuPanel() {
  return <div className="site-menu-panel" />;
}

const MENU_ITEMS = [
  { key: "home", bare: "/", label: "Главная" },
  { key: "about", bare: "/about/", label: "О проекте" },
  { key: "values", bare: "/values/", label: "Принципы" },
  { key: "contact", bare: "/contact/", label: "Связаться" },
];

export const MENU_SOCIALS = [
  { href: "https://t.me/depresscoofficial", icon: "facebook", label: "Telegram" },
  { href: "https://x.com/soshallitbe5", icon: "x", label: "X" },
  { href: "https://github.com/rodionvitenberg-ui/de-press.co", icon: "dribbble", label: "GitHub" },
  { href: "mailto:hello@de-press.co", icon: "twitter", label: "E-mail" },
];

export const FOOTER_SOCIALS = [
  { href: "https://t.me/depresscoofficial", icon: "facebook", label: "Tg" },
  { href: "https://x.com/soshallitbe5", icon: "x", label: "X" },
  { href: "https://github.com/rodionvitenberg-ui/de-press.co", icon: "dribbble", label: "Gh" },
  { href: "mailto:hello@de-press.co", icon: "twitter", label: "@" },
];

export function SocialItem({
  s,
  t,
}: {
  s: { href: string; icon: string; label: string };
  t: Translator;
}) {
  return (
    <li>
      <a href={s.href} target="_blank">
        {" "}
        <span className="u-from-mobile">
          {" "}
          <span className={`svg svg-${s.icon}`}>
            <svg width="12" height="12">
              <use xlinkHref={`/static/assets/spritesheet.svg#${s.icon}`} />
            </svg>
          </span>{" "}
        </span>{" "}
        <span className="u-from-desktop">{t(s.label)}</span>{" "}
      </a>
    </li>
  );
}

export function SiteMenu({
  active,
  t,
  href,
}: SharedProps & { active: string | null }) {
  return (
    <div className="site-menu">
      <div className="center">
        <ul className="site-menu-list">
          {MENU_ITEMS.map((item) => (
            <li key={item.key} className="site-menu-item">
              <a href={href(item.bare)} className={active === item.key ? "is-active" : ""}>
                {t(item.label)}
              </a>
            </li>
          ))}
        </ul>

        <div className="site-menu-footer">
          <div className="site-menu-content">
            <p className="site-menu-slogan">{t("Don't cry alone")}</p>
            <ul>
              {MENU_SOCIALS.map((s) => (
                <SocialItem key={s.icon} s={s} t={t} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CookieBar({ t, href }: SharedProps) {
  return (
    <div className="site-cookie js-cookie">
      <p className="site-cookie__text">
        {tx(t, "Здесь нет рекламных трекеров и аналитики. Работает только необходимое — без этого сайт не откроется. Продолжая, ты соглашаешься с этим. ")}
        <a href={href("/privacy/")}>{t("Подробнее о приватности")}</a>.
      </p>

      <div className="site-cookie__buttons">
        <button type="button" className="site-cookie__button js-cookie-accept">{t("Хорошо")}</button>
        <button type="button" className="site-cookie__button js-cookie-deny">{t("Отклонить")}</button>
      </div>
    </div>
  );
}



export function SiteFooter({
  t,
  href,
  locale,
  path,
}: SharedProps & { locale: Locale; path: string }) {
  return (
    <div className="site-footer js-in-view">
      <div className="center">
        <div className="site-footer-top">
          <div className="site-footer-block site-footer-block--address appear-fade-up">
            <h3>{t("Тишина")} <b>.</b></h3>
          </div>

          <div className="site-footer-block site-footer-block--address appear-fade-up appear-delay--1">
            <h3>{t("Эмпатия")} <b>.</b></h3>
          </div>

          <div className="site-footer-block site-footer-block--address appear-fade-up appear-delay--2">
            <h3>{t("Забота")} <b>.</b></h3>
          </div>

          <div className="site-footer-block site-footer-block--social appear-fade-up appear-delay--3">
            <h2 className="site-footer-title">
              <span className="u-visually-hidden">{t("Написать нам")}</span>
              <span className="site-footer-slogan">{t("Don't cry alone")}</span>
            </h2>

            <ul>
              {FOOTER_SOCIALS.map((s) => (
                <SocialItem key={s.icon} s={s} t={t} />
              ))}
            </ul>
          </div>
        </div>

        <div className="site-footer-bottom">
          <p className="site-footer-contact appear-fade-up">
            {tx(t, "Хочешь помочь проекту — напиши: ")}
            <a href="mailto:hello@de-press.co">hello@de-press.co</a>
          </p>

          <div className="site-footer-right">
            <p className="site-footer-newsletter appear-fade-up appear-delay--4">
              <a href={href("/privacy/")}>
                {tx(t, " Приватность ")}
              </a>
            </p>

            <div className="site-footer-languages appear-fade-up appear-delay--5">
              {t("Язык:")}
              <LangSwitcher locale={locale} path={path} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
