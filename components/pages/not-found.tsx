import type { PageContentProps, PageModule } from "./renderer";
import { fxBlock } from "@/i18n/core";
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

/**
 * Not found — the 404 page (originalized; no legacy snapshot existed). The
 * island holds the contact pose (PAGE_STATES["not-found"] → CAREERS_STATE)
 * over the contact background art, and the page reuses the site's quiet
 * mechanics: the per-letter fx reveal for the «404.» headline and the
 * typewriter loop (runtime/typed.ts). Locale is resolved from the requested
 * URL by the client wrapper (not-found-client.tsx). Content styles live in
 * depress.css (.nf-*).
 */

/** fxBlock("404.") — locale-independent digits, revealed like the hero. */
const DIGITS = fxBlock("404.");

function NotFoundContent({ t, locale, path, href }: PageContentProps) {
  return (
    <div className="site-wrapper">
      <SiteHeader t={t} href={href} />

      <SiteLoader />

      <SceneRoot />

      <SiteMenuBack />

      <SiteMenuPanel />

      <SiteMenu active={null} t={t} href={href} />

      <div className="site-container" data-router-wrapper="">
        <main data-router-view="not-found" role="main" data-sentences="">
          <div className="js-sentences u-hidden">
            {JSON.stringify([
              t("notfound.invite.01"),
              t("notfound.invite.02"),
              t("notfound.invite.03"),
              t("notfound.invite.04"),
              t("notfound.invite.05"),
            ])}
          </div>

          <picture className="nf-background js-in-view appear-fade">
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
            <h1 className="nf-title">
              <span className="u-visually-hidden">
                {t("notfound.hiddenTitle")}
              </span>
              <span
                className="fx-parent"
                aria-hidden="true"
                dangerouslySetInnerHTML={{ __html: DIGITS }}
              />
            </h1>

            <p className="nf-typed">
              <span className="js-typed" />
            </p>

            <div className="nf-actions">
              <a href={href("/")} className="link link--caret">
                <span className="link--caret-text">{t("notfound.back")}</span>{" "}
                <CaretRight />
              </a>

              <a href={href("/contact/")} className="nf-write">
                {t("notfound.write")}
              </a>
            </div>
          </div>
        </main>
      </div>

      <CookieBar t={t} href={href} />

      <SiteFooter t={t} href={href} locale={locale} path={path} />
    </div>
  );
}

export const PAGE_TITLE = "meta.notfound.title";

export default {
  BODY_CLASS: "lock-scroll",
  DATA_THEME: "contact",
  DATA_PAGE: "not-found",
  PAGE_TITLE,
  Content: NotFoundContent,
} satisfies PageModule;
