# PLAN — финальная оригинализация promo-depress

> Единственный план работ проекта. Прежние плановые документы (`docs/ROADMAP.md`, `docs/ARCHITECTURE-legacy.md`) удалены; контракт DOM/классов рантайма живёт в `components/runtime/contract.md`, исходники продукта — в `GDPR-docs/` (удаляются после реализации GDPR-страницы).
>
> Статусы: ⬜ план · 🔄 в работе · ✅ сделано

## Где мы (состояние на 01.09.2026, проверено по коду)

- Ветка `main`, точка отсчёта — тег `pre-originalize`. **Один шаг = одна задача = один атомарный коммит.**
- Контентная оригинализация исходного ТЗ закрыта: хедер, hero «Don't cry alone» (10 локалей), соц-блок, app-линк, музыка удалена, шторка меню, фирменный красный → белый, футер-линки, контакты, cookie-функционал, values (белая тема + контраст).
- Все страницы — собственный JSX: `components/pages/{home,about,values,contact,privacy}.tsx` + safety, рендер через `renderPage` (`components/pages/renderer.tsx`); safety — статическая контентная страница без рантайма (`components/legacy/SafetyContent.tsx`). Легаси-шаблоны (`components/legacy/markups/`) и `html-diff` снесены (A3).
- Собственный рантайм — безусловный дефолт (A2): `components/runtime/RuntimeBoot.tsx` → `runtime/boot.ts` (capabilities → DOM-модули → loader → island → cases/cookie/header/menu/reveals/table-expand/typed). Легаси-вендор (`public/static/js/main.js` + detectizr + modernizr) удалён (A3).
- GL-сцена уже собственная: `components/legacy/glscene/` (TypeScript/three), данные `public/data/scene/*.json` — первоисточник.
- Словари: 10 локалей (ключ = RU-строка); ключ «Don't cry alone» есть во всех 10 — футер-фиксу словарные правки не нужны.
- GDPR: страница `/privacy/` реализована на всех 10 локалях (A4); ссылка «Подробнее о приватности» в куки-баре ведёт на неё. `GDPR-docs/` удаляются после приёмки пользователем.

## Кто что делает

| Трек | Зона владения |
|---|---|
| **Агент-2** (второстепенные задачи) | `components/pages/shared.tsx`, `components/runtime/**`, `components/legacy/**`, `components/legacy/markups/**`, `public/static/js/**`, `scripts/**`, GDPR-страница, README |
| **Основной агент + пользователь** (кейсы) | секция кейсов в `components/pages/home.tsx`, ассеты кейсов, палитры тем кейсов, ключи словарей кейсов |
| Общий ресурс — `i18n/dictionaries/*.json` | каждый добавляет/меняет только свои ключи; синхронно не редактируем |

Секция кейсов на главной (`home-cases`) — совместная работа основного агента и пользователя. Агент-2 в неё не вмешивается.

---

## Трек A — агент-2 (выполнять по порядку)

### A1. Футер: «We Make Good Shit» → «Don't cry alone» ✅

Упущение исходного ТЗ: в футере всех 4 страниц осталась ненулевая SVG-надпись `svg.baseline`.

- `components/pages/shared.tsx` (`SiteFooter`, `<svg className="baseline">…`): заменить на живой текст `{t("Don't cry alone")}` — по образцу слогана меню (коммит `b93c53f`).
- Зеркально в 4 двойниках `components/legacy/markups/{home,about,values,contact}.ts` — baseline синтезируется из них, html-diff иначе упадёт.
- Стили: слот SVG повторить текстом, аналог `.site-menu-slogan` в `public/static/css/depress.css`.
- Словарные правки: **не нужны**.
- Верификация: реген baseline → html-diff 0 diff, i18n-check, build, эталонные скриншоты, smoke.

### A2. Рантайм: включить свой, выкинуть вендор ✅

- Сделано: `runtime/loader.ts` — точный порт легаси-лоадера (`.site-loader` → кольцо → `completed` → hide); boot в легаси-порядке: capabilities → DOM-модули → Loader.show → Loader.load (кольцо ∥ ассеты острова) → `loaded()` (retina SSAA) → `completed` (остров есть → show+intro, unlock в onComplete; нет → прямой unlock) → `InView.reset` (+500ms) → Loader.hide; `initMenu(getIsland)` — null-safe при позднем острове; `BootPage` — `bootRuntime` безусловный дефолт, вендорный `main.js`/`detectizr`/`modernizr` больше не грузятся (файлы сносятся в A3); сцен-типы переехали в `runtime/types.ts`.
- Пиксельный паритет: `values`, `mobile/{home,about,values}` — 0 px против легаси (d422de2); `scroll-2`, cookie-зона — 0 px; `about` — 264 px (reveal `.appear-fade-up` у сгиба — свой рантайм раскрывает, легаси нет); menu/hover — детерминированные фазовые дельты tween/matcap-свапа (межпрогонная воспроизводимость 0.4–2%); top/scroll-1 — известный шиммер острова.
- Эталоны пересняты: 12 состояний, `loaderWait` done ×12, `canvas` фиксируется в момент съёмки (desktop True на всех островных маршрутах — остров монтируется и на about; mobile False).
- Верификация: tsc 0, lint 0 ошибок в коде проекта (3 в marketingskills/), build OK, html-diff OK 50/50 (SSR-HTML не изменился), реген baseline DONE 50, i18n-check OK (3 pre-existing), smoke 200/404.

### A3. Зачистка легаси ✅

- Удалено: `public/static/js/{main,detectizr,modernizr}.js`, `components/legacy/markups/` (4 двойника), `components/legacy/createLegacyPage.tsx`, `components/legacy/BootPage.tsx`, `scripts/extract-scene-data.mjs` (+ npm-скрипт `scene-data`), `scripts/html-diff.mjs`, мёртвый i18n-пайплайн markups-эры (`finalizeMarkup`/`localizeMarkup`/`localizeSentences`/`localizeHrefs` + `finalizeLegacyMarkup`).
- Boot перенесён в `components/runtime/RuntimeBoot.tsx` (без markup-пропа): StrictMode-safe — `destroyed`-флаг уничтожает boot-хэндл, разрешившийся после cleanup (dev double-mount не оставляет дублей канваса/утечек; проверено CDP-пробой на dev :3001: `canvases: 1`, `errors: none`).
- `next.config.ts`: `reactStrictMode: true`.
- `scripts/html-diff.mjs` снят с дежурства (guard «SSR = легаси-снимок» завершён); `regen-html-baseline.mjs` переведён на live-снятие всех 5 страниц × 10 локалей (normalize перенесён из html-diff) — **все 50 live-снапшотов байт-идентичны прежним синтезированным** (паритет live SSR ↔ легаси-синтез). Регрессия дальше — по эталонным скриншотам.

### A4. GDPR-страница ✅ (01.09.2026)

- Решение пользователя: маршрут `/privacy/`, все 10 локалей.
- `components/legacy/PrivacyContent.tsx` — фактическая инвентаризация из `GDPR-docs/PRIVACY.md`, адаптированная под промо-сайт (принципы / что хранится / чего нет / retention / проверяемость), тон safety-страницы; статическая страница без рантайма по паттерну `SafetyContent`. Стили `.dp-privacy` в `depress.css` (та же тихая оболочка, что `.dp-safety`).
- Роуты `app/(legacy)/privacy/page.tsx` (ru) + `app/(legacy)/[lang]/privacy/page.tsx` (9 локалей, SSG; `/ru/privacy/` → 404 — паритет с safety).
- Куки-бар: «Подробнее о приватности» → `href("/privacy/")`.
- i18n: 28 новых ключей ×9 локалей; 4 переиспользованы из прежних страниц («Приватность», «Принципы», «Чего здесь нет», «← Вернуться на главную» — словарные значения сохранены). `i18n-check.mjs`: PAGES + privacy (6×10=60 снапшотов), T_SOURCE_FILES + PrivacyContent + оба privacy-роута; `regen-html-baseline.mjs`: PAGES + privacy, «REGEN DONE 50» → динамический счёт.
- После приёмки — удалить `GDPR-docs/` (остаётся в git-истории).

### A4.1. Privacy в стиле сайта ✅ (01.09.2026)

- Privacy переезжает на полный паритет со страницами сайта (по образцу about): `components/pages/privacy.tsx` — PageModule (lock-scroll / data-theme=privacy / data-page=privacy / title «Приватность — de-press») через renderPage: loader, header, меню (`active=null` — пункта в меню нет), футер, куки-бар, reveals. Тексты A4 сохранены 1:1 (28 + 4 переиспользованных ключа), подача — about-токены (headline/title/tagline/текст, списки с тире-маркерами); «← Вернуться на главную» убрана (навигация — хедер/меню/футер), вместо неё `link--caret` «Смотреть, как устроено» → `/`.
- Остров: `PAGE_STATES.privacy = "PRIVACY_STATE"`, `PAGE_MATCAPS.privacy = [3, 3]` (якорится на общие линейки SceneRoot). Сцена за контентом: `:not(.menu-open) [data-page="privacy"] .scene-root-inner { z-index: -1 }` + мобильный вариант, как у about.
- CSS: блок `.dp-privacy` заменён на `.privacy-*` в depress.css (токены about: Gilroy/GT Sectra/Heebo, фирменные цвета, `.center`-ритм); main.css не тронут. `components/legacy/PrivacyContent.tsx` удалён. safety не тронут — тихая страница осознанно (кризисная).
- i18n: +1 ключ «Приватность — de-press» ×9 локалей; `i18n-check.mjs`: T_SOURCE_FILES — PrivacyContent → components/pages/privacy.tsx. Верификация: tsc, lint, build, реген baseline (DONE 60), i18n-check (3 pre-existing), smoke 200/404 ×10, SSR-хром, бут острова на десктопе.
- Правка по фидбеку (01.09.2026): своя поза `PRIVACY_STATE` в `desktop.json` — about-поза поднята (Y −14.8 → 2) и отзеркалена вправо от заголовка (X 11.9 → −12.5): камера смотрит с −Z (`stage.ts`), мир X+ = лево экрана, так что «правее» — минус X), поза скролла-исчезновения сохранена; копирайт переработан по `copywriting/SKILL.md` — живой тон, без канцелярита и каталог-паттернов «Название: описание», факты A4 сохранены; порядок секций: «Что здесь хранится» → «Чего здесь нет» → «Сколько это живёт» → «Не веришь — проверь» (принципы + самохостинг + CTA одним блоком); 25 ключей заменено ×10 локалей (интонация дублирована: lead ↔ заголовок «Сколько это живёт»); у обеих ссылок на `/privacy/` (футер + куки-бар) убран `target="_blank"`. Верификация: tsc 0, lint 0, build OK, реген DONE 60 → i18n-check OK (3 pre-existing), prerender: новые строки на месте, старых нет, `_blank` только у соцсетей; boot-check OK (4 секции / 21 пункт, сцена, 0 ошибок консоли).

### A5. Финальная вычитка текстов ⬜ (после B)

- Все тексты ×10 локалей после кейсов; мёртвые ключи словарей вычистить (известный pre-existing: `ja.json` «дизайн» — мёртвый ключ).

---

## Трек B — основной агент + пользователь: секция кейсов на главной 🔄

Текущее состояние: секция переведена на «чувства» (см. B1). Темы-имена (`tomorrowland`, `navy-pier`, `msi-chicago`, `this-was-louises-phone`, `orw`) пока легаси — переименуются вместе с фонами (B2). Фоны — легаси (`public/static/assets/images/cases/<theme>/background-{450,815,1015,1440}.png`, ~6.6 МБ суммарно). Палитры тем — 216 селекторов `home-cases-scene--*` в `public/static/css/main.css` (+ `touchevents`/`no-touchevents`). `data-matcap` — ховер карточки подменяет matcap GL-сцены (сейчас 18/7/8/11/12).

1. **B1. Контент и посыл ✅** (утверждено 01.09) — заголовок «Если ты…»; 5 чувств вместо 7 кейс-фич: Одиноко / Изолированно / Неслышно / Нетак / Слишком — триггеры списка и большие слова карточек; текст карточки — понимание (2 строки, без рекламы); группы и фичевые клички (headline) убраны; «Подробнее» → имя инструмента («Монолог», «Я слышу тебя», «Тихие фразы», «Похожая история», «Anti-Panic») — единственное мягкое «предложение» карточки.
2. **B2. Свои фоны** ⬜ — ассеты пользователя → `public/static/assets/images/cases/<тема>/` (4 брейкпоинта на тему), имена тем.
3. **B3. Палитры тем ✅** — из `main.css` вычищены 216 селекторов легаси-палитр кейс-тем (~942 строки: `@media (max-width: 64.365em)`-блоки, `.touchevents .home-cases-scene--*`, `.link--caret:after`, `.svg`); осознанные оверраиды в `depress.css` сохранены (на десктопе показаны чувство `.home-cases-name` и оффер `.link--caret`, скрытые легаси для no-touch). Пиксельная нейтральность доказана swap-изоляцией на живом сервере (HEAD-css ↔ B3-css, один рантайм): menu 0.11%, scroll-2 0.00%, top-state 0.01%, `mobile/home.png` sha256-идентичен; межпрогонные расхождения (top ~6%, scroll-1 ~1.9%, hover ~2%) — фазовый шиммер GL-рантайма (intro-фрейминг, скролл-поза, фаза matcap-кроссфейда), а детерминированные 22.1% на menu — WIP-рантайм трека A; эталоны переснимаются в A2-коммите.
4. **B4. `data-matcap`** ⬜ — свой matcap на каждое чувство (в атласе 20 ячеек, занято 8) — выбрать по скриншот-пробам.
5. **B5. i18n ✅ (черновик)** — новые ключи («Если ты…», 5 чувств, 10 строк понимания) добавлены ×9 локалей (ru = identity), старые кейс-ключи вычищены из всех словарей; финальная вычитка переводов — в A5.
6. **B6. Двойник ✅** — `markups/home.ts` отзеркален (5 сцен без headline/group, офферы), baseline-синтез консистентен с live SSR.
7. **B7. Верификация** 🔄 — на каждый шаг: build, tsc, lint, i18n-check (реген baseline), новые эталонные скриншоты home, smoke.

---

## Синхронизация треков

- A1 (футер) — **до** регена baseline в B7: обе задачи меняют SSR-HTML; baseline регенерируем по очереди, не параллельно.
- A2/A3 не трогают `components/pages/home.tsx`; трек B не трогает `BootPage`/`(legacy)/layout.tsx`.
- B6 зависит от A3: markups удалены → двойник не нужен.

## Открытые решения (нужно решение пользователя)

- Кейсы: контент/посыл/фоны/matcap — заполняется по ходу трека B.
- Хостинг и домен (деплой): Vercel vs VPS рядом с `app.de-press.co` (учитывать объём статики).

## Деплой ⬜

`next build` + `next start`; чеклист: 200/404, 10 локалей, `/safety`, mobile, 0 ошибок консоли.

## Верификация каждого коммита

Кратко (полная версия — в README):

- `npx tsc --noEmit` · `npm run lint` · i18n-check (перед прогоном: поднять сервер, `node scripts/regen-html-baseline.mjs`) · `npm run build` · `npm run screenshots` · html-diff (пока живы markups) · smoke 200/404.
- Серверы: dev :3001 / `next start` :3111 (свежий, `BASE_URL=…`); остановка `pkill -f '[n]ext-server'`.
- Правило для агентов: Next.js в репо новее обучающих данных — перед кодом читать `node_modules/next/dist/docs/`.


