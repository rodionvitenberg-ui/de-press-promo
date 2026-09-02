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
 * Support — the support page (de-press.co/support): the 0% take-rate
 * manifesto and two working gateways — Solana & USDC (SPL) and Ethereum/EVM,
 * both public Phantom addresses. Per the Web3 UX baseline there are no
 * redirects: each plate shows the compact 4+4 address, a click copies the
 * full string from the plate's data-address, and the QR pop serves phone
 * wallets. Copy follows the project copywriting guidelines; content styles
 * live in depress.css (.support-*). The island reuses the privacy pose.
 */

/** The 0% manifesto: three non-negotiables (dictionary keys). */
const MANIFEST = [
  "support.manifest.noFee",
  "support.manifest.noSubscription",
  "support.manifest.noMonetize",
];

/** The two working gateways, one wallet plate per chain. */
const GATEWAYS = [
  {
    id: "solana",
    name: "support.gateway.solana.name",
    text: "support.gateway.solana.text",
  },
  {
    id: "evm",
    name: "support.gateway.evm.name",
    text: "support.gateway.evm.text",
  },
] as const;

/**
 * The public wallet addresses (Phantom). Data, not copy — they live here
 * once instead of being duplicated across all 10 dictionaries.
 */
const GATEWAY_ADDRESSES: Record<(typeof GATEWAYS)[number]["id"], string> = {
  solana: "7oF9eiHf9vYAeEPyQsVoMYhvoq4tt7cuLM2yMXt9yWpu",
  evm: "0x9f74cee66919224cb5d7c91cbbdbb44b7c3ef1e8",
};

/**
 * Compact plate form: first 4 + last 4 characters (EVM keeps the 0x prefix:
 * 0x9f74…f1e8). The clipboard always gets the full string — it stays in the
 * DOM as the plate's data-address, the runtime reads it from there.
 */
function shortAddress(address: string): string {
  const head = address.startsWith("0x")
    ? address.slice(0, 6)
    : address.slice(0, 4);
  return `${head}…${address.slice(-4)}`;
}

/** Minimal QR glyph for the scanner toggle (three finders + dots). */
function QrIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="16"
      height="16"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M1 1h5.5v5.5H1V1zm1.75 1.75v2h2v-2h-2zM9.5 1H15v5.5H9.5V1zm1.75 1.75v2h2v-2h-2zM1 9.5h5.5V15H1V9.5zm1.75 1.75v2h2v-2h-2zM9.5 9.5h2v2h-2v-2zm3.75 0H15V11h-1.75V9.5zM9.5 13.25H11V15H9.5v-1.75zm3.75 0H15V15h-1.75v-1.75z"
      />
    </svg>
  );
}

function SupportContent({ t, locale, path, href }: PageContentProps) {
  return (
    <div className="site-wrapper">
      <SiteHeader t={t} href={href} />

      <SiteLoader />

      <SceneRoot />

      <SiteMenuBack />

      <SiteMenuPanel />

      <SiteMenu active={null} t={t} href={href} />

      <div className="site-container" data-router-wrapper="">
        <main data-router-view="support" role="main">
          <div className="center">
            <header className="support-header js-in-view">
              <p className="support-headline support-headline--blue appear-fade-up">
                {t("support.hiddenTitle")}
              </p>
              <h1 className="support-title appear-fade-up appear-delay--1">
                {t("support.title")}
              </h1>
              <p className="support-lead appear-fade-up appear-delay--2">
                {t("support.lead")}
              </p>
            </header>

            <section className="support-section js-in-view">
              <h2 className="support-subtitle appear-fade-up">
                {t("support.manifestTitle")}
              </h2>
              <ul className="support-list appear-fade-up appear-delay--1">
                {MANIFEST.map((item) => (
                  <li key={item}>{t(item)}</li>
                ))}
              </ul>
            </section>

            <section className="support-section js-in-view">
              <h2 className="support-subtitle appear-fade-up">
                {t("support.treasuryTitle")}
              </h2>

              {GATEWAYS.map((gateway) => {
                const address = GATEWAY_ADDRESSES[gateway.id];
                return (
                  <div
                    className="support-wallet appear-fade-up appear-delay--1"
                    key={gateway.id}
                    data-address={address}
                  >
                    <h3 className="support-wallet-name">{t(gateway.name)}</h3>
                    <p className="support-wallet-text">{t(gateway.text)}</p>

                    <p className="support-wallet-address">
                      <span aria-hidden="true">{shortAddress(address)}</span>
                      <span className="u-visually-hidden">{address}</span>
                    </p>

                    <div className="support-wallet-actions">
                      <button
                        type="button"
                        className="support-wallet-copy js-support-copy"
                        data-copied={t("support.gateway.copied")}
                      >
                        <span className="support-wallet-copy-label">
                          {t("support.gateway.copy")}
                        </span>
                      </button>

                      <span className="support-wallet-qr-wrap">
                        <button
                          type="button"
                          className="support-wallet-qr js-support-qr"
                          aria-expanded="false"
                          aria-label={t("support.gateway.qr")}
                        >
                          <QrIcon />
                        </button>

                        <span className="support-wallet-qr-pop" hidden>
                          <picture>
                            <img
                              src={`/static/assets/images/support/qr-${gateway.id}.svg`}
                              alt=""
                              width={168}
                              height={168}
                              loading="lazy"
                            />
                          </picture>
                        </span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </section>
          </div>
        </main>
      </div>

      <CookieBar t={t} href={href} />

      <SiteFooter t={t} href={href} locale={locale} path={path} />
    </div>
  );
}

export const PAGE_TITLE = "meta.support.title";

export default {
  BODY_CLASS: "lock-scroll",
  DATA_THEME: "support",
  DATA_PAGE: "support",
  PAGE_TITLE,
  Content: SupportContent,
} satisfies PageModule;