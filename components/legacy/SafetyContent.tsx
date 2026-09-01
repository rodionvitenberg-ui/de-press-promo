import { getTranslator, localePath } from "@/i18n";
import type { Locale } from "@/i18n/core";

/**
 * Crisis page content, shared by the default (ru) route and /[lang]/safety.
 * Static and self-contained: no legacy runtime, no WebGL, readable even if
 * everything else breaks. Styles: depress.css (.dp-safety).
 */
export function SafetyContent({ locale }: { locale: Locale }) {
  const t = getTranslator(locale);
  return (
    <div className="dp-safety">
      <main className="dp-safety__inner">
        <p className="dp-safety__tag">{t("safety.hiddenTitle")}</p>
        <h1>{t("safety.nowTitle")}</h1>
        <p className="dp-safety__lead">
          {t(
            "safety.nowText",
          )}
        </p>

        <h2>{t("safety.callTitle")}</h2>
        <div className="dp-safety__phones">
          <a className="dp-safety__phone" href="tel:112">
            112
          </a>
          <a className="dp-safety__phone" href="tel:103">
            103
          </a>
        </div>
        <p className="dp-safety__note">
          {t(
            "safety.callText",
          )}
        </p>

        <h2>{t("safety.stepsTitle")}</h2>
        <ol>
          <li>
            {t(
              "safety.step1",
            )}
          </li>
          <li>{t("safety.step2")}</li>
          <li>
            {t(
              "safety.step3",
            )}
          </li>
          <li>
            {t(
              "safety.step4",
            )}
          </li>
          <li>
            {t(
              "safety.step5",
            )}
          </li>
        </ol>

        <h2>{t("common.notHereTitle")}</h2>
        <p>
          {t(
            "safety.notHereText",
          )}
        </p>

        <h2>{t("safety.longTermTitle")}</h2>
        <p>
          {t(
            "safety.longTermText",
          )}
        </p>

        <a className="dp-safety__back" href={localePath(locale, "/")}>
          {t("common.backHome")}
        </a>
      </main>
    </div>
  );
}
