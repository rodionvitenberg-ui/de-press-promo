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
        <p className="dp-safety__tag">{t("de-press.co · безопасность")}</p>
        <h1>{t("Если сейчас очень плохо")}</h1>
        <p className="dp-safety__lead">
          {t(
            "de-press.co — тихая гавань, но это не экстренная помощь. Если тебе угрожает опасность или приходят мысли о причинении себе вреда — обратись за помощью прямо сейчас. Ты не обязан справляться в одиночку.",
          )}
        </p>

        <h2>{t("Позвони — это бесплатно")}</h2>
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
            "112 — единый номер экстренных служб, 103 — скорая помощь (в ряде стран). Номера работают с любого телефона, в том числе без денег на счёте.",
          )}
        </p>

        <h2>{t("Что можно сделать прямо сейчас")}</h2>
        <ol>
          <li>
            {t(
              "Скажи живому человеку рядом — даже просто «мне плохо». Не нужно объяснять всё: одной фразы достаточно, чтобы тебя не оставили одного.",
            )}
          </li>
          <li>{t("Позвони 112 или 103 и скажи, что тебе нужна помощь.")}</li>
          <li>
            {t(
              "Оставайся не один: попроси кого-то быть рядом, пока помощь не подойдёт.",
            )}
          </li>
          <li>
            {t(
              "Если можешь — убери от себя то, чем можно себе навредить, и отойди от опасных мест.",
            )}
          </li>
          <li>
            {t(
              "Дыши медленно: вдох на четыре счёта, выдох на шесть. Это не решает всё, но помогает пережить острую волну.",
            )}
          </li>
        </ol>

        <h2>{t("Чего здесь нет")}</h2>
        <p>
          {t(
            "В de-press.co нет лайков, рейтингов и публичных комментариев. Твою историю услышат, но не оценят. Чат может начать только ты. ИИ-помощник всегда помечен, не ставит диагнозов и не заменяет людей.",
          )}
        </p>

        <h2>{t("Если тяжело давно")}</h2>
        <p>
          {t(
            "de-press.co — не медицина и не замена терапии. Если состояние длится неделями или мешает жить — обратись к врачу или психотерапевту. Просить о помощи — нормально.",
          )}
        </p>

        <a className="dp-safety__back" href={localePath(locale, "/")}>
          {t("← Вернуться на главную")}
        </a>
      </main>
    </div>
  );
}
