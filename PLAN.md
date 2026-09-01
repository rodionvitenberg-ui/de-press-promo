# PLAN — финальная оригинализация promo-depress

> Единственный план работ проекта. Прежние плановые документы (`docs/ROADMAP.md`, `docs/ARCHITECTURE-legacy.md`) удалены; контракт DOM/классов рантайма живёт в `components/runtime/contract.md`, исходники продукта — в `GDPR-docs/` (удаляются после реализации GDPR-страницы).
>
> Статусы: ⬜ план · 🔄 в работе · ✅ сделано

## Где мы (состояние на 01.09.2026, проверено по коду)

- Ветка `main`, точка отсчёта — тег `pre-originalize`. **Один шаг = одна задача = один атомарный коммит.**
- Контентная оригинализация исходного ТЗ закрыта: хедер, hero «Don't cry alone» (10 локалей), соц-блок, app-линк, музыка удалена, шторка меню, фирменный красный → белый, футер-линки, контакты, cookie-функционал, values (белая тема + контраст).
- Все страницы — собственный JSX: `components/pages/{home,about,values,contact}.tsx` + safety, рендер через `renderPage` (`components/pages/renderer.tsx`). Фаза 2 (markups → JSX) завершена. `components/legacy/markups/` остались только как источник синтеза baseline для html-diff (`scripts/regen-html-baseline.mjs`).
- Собственный рантайм написан и работает за лаб-флагом **`?boot=own`** (`components/legacy/BootPage.tsx` → `components/runtime/boot.ts`: capabilities → scene-data → island → cases/cookie/header/menu/reveals/table-expand/typed). **По умолчанию сайт всё ещё грузит легаси-вендор `public/static/js/main.js` (1.68 МБ) + `detectizr.js` + `modernizr.js`.**
- GL-сцена уже собственная: `components/legacy/glscene/` (TypeScript/three), данные `public/data/scene/*.json` — первоисточник.
- Словари: 10 локалей (ключ = RU-строка); ключ «Don't cry alone» есть во всех 10 — футер-фиксу словарные правки не нужны.
- GDPR: документация пришла (`GDPR-docs/PRIVACY.md`, `CONTEXT.md`, `README.md`); самой страницы нет; ссылка «Подробнее о приватности» в куки-баре ведёт на `/values/` (заглушка).

## Кто что делает

| Трек | Зона владения |
|---|---|
| **Агент-2** (второстепенные задачи) | `components/pages/shared.tsx`, `components/runtime/**`, `components/legacy/**`, `components/legacy/markups/**`, `public/static/js/**`, `scripts/**`, GDPR-страница, README |
| **Основной агент + пользователь** (кейсы) | секция кейсов в `components/pages/home.tsx`, ассеты кейсов, палитры тем кейсов, ключи словарей кейсов |
| Общий ресурс — `i18n/dictionaries/*.json` | каждый добавляет/меняет только свои ключи; синхронно не редактируем |

Секция кейсов на главной (`home-cases`) — совместная работа основного агента и пользователя. Агент-2 в неё не вмешивается.

---

## Трек A — агент-2 (выполнять по порядку)

### A1. Футер: «We Make Good Shit» → «Don't cry alone» ⬜

Упущение исходного ТЗ: в футере всех 4 страниц осталась ненулевая SVG-надпись `svg.baseline`.

- `components/pages/shared.tsx` (`SiteFooter`, `<svg className="baseline">…`): заменить на живой текст `{t("Don't cry alone")}` — по образцу слогана меню (коммит `b93c53f`).
- Зеркально в 4 двойниках `components/legacy/markups/{home,about,values,contact}.ts` — baseline синтезируется из них, html-diff иначе упадёт.
- Стили: слот SVG повторить текстом, аналог `.site-menu-slogan` в `public/static/css/depress.css`.
- Словарные правки: **не нужны**.
- Верификация: реген baseline → html-diff 0 diff, i18n-check, build, эталонные скриншоты, smoke.

### A2. Рантайм: включить свой, выкинуть вендор ⬜

- Достроить недостающее в `components/runtime/`: `loader.ts` (`.site-loader`, percent, `lock-scroll`), scroll-engine (keypoints из `public/data/scene/*.json` + сплайны + mouse parallax — сверить с `components/runtime/island.ts` и контрактом), transitions (минимум: full page load уже работает).
- Переключить boot: легаси `main.js`/`detectizr`/`modernizr` больше не грузятся (лаб-флаг `?boot=own` убрать; способ — `SiteRuntime` в `(legacy)/layout` или дефолтный boot в `BootPage` — на усмотрение агента-2, контракт: `components/runtime/contract.md`).
- Прогон 12–14 эталонных состояний + мобильный путь (`disable_scene`), фикс-круг.

### A3. Зачистка легаси ⬜

- Удалить: `public/static/js/{main,detectizr,modernizr}.js`, `components/legacy/markups/`, `components/legacy/createLegacyPage.tsx` (+ `finalizeLegacyMarkup` в `i18n/`), `scripts/extract-scene-data.mjs`, `components/legacy/BootPage.tsx` (после переноса boot).
- `scripts/html-diff.mjs` и `scripts/regen-html-baseline.mjs`: guard «SSR = легаси-снимок» завершён — снять с дежурства; `regen-html-baseline` при необходимости перевести на live-снятие всех страниц (как safety) для i18n-check.
- `next.config.ts`: `reactStrictMode: true` + проверить двойной эффект рантайма.
- Регрессия дальше — по эталонным скриншотам (`reference/screenshots/`).

### A4. GDPR-страница ⬜

- Маршрут и набор локалей — **согласовать с пользователем** (например `/privacy/`, все 10 или ru+en).
- Контент — из `GDPR-docs/PRIVACY.md` (фактическая инвентаризация данных платформы), адаптировать под промо-сайт; `CONTEXT.md` — словарь терминов.
- Куки-бар: «Подробнее о приватности» → на новую страницу. Белая тема куки-бара — после A2.
- После приёмки — удалить `GDPR-docs/` (остаётся в git-истории).

### A5. Финальная вычитка текстов ⬜ (после B)

- Все тексты ×10 локалей после кейсов; мёртвые ключи словарей вычистить (известный pre-existing: `ja.json` «дизайн» — мёртвый ключ).

---

## Трек B — основной агент + пользователь: секция кейсов на главной 🔄

Текущее состояние: `components/pages/home.tsx`, массив `CASES` (7 карточек: tomorrowland/Монолог, navy-pier/Я слышу тебя, msi-chicago/Тихие фразы, this-was-louises-phone/Похожая история, kikk-18/Pulse, the-kennedy-center/Hearers, orw/Anti-Panic). Тексты уже de-press-специфичные и локализованы ×10. Фоны — легаси (`public/static/assets/images/cases/<theme>/background-{450,815,1015,1440}.png`, ~6.6 МБ суммарно). Палитры тем — 216 селекторов `home-cases-scene--*` в `public/static/css/main.css` (+ `touchevents`/`no-touchevents`). `data-matcap` — ховер карточки подменяет matcap GL-сцены.

1. **B1. Контент и посыл** — согласовать с пользователем: список фич, заголовки, тексты, число карточек, группы (Публичное / Автору / Безопасность).
2. **B2. Свои фоны** — ассеты пользователя → `public/static/assets/images/cases/<тема>/` (4 брейкпоинта на тему), имена тем.
3. **B3. Палитры тем** — CSS под новые фоны; цель — выкинуть легаси-цвета кейс-тем.
4. **B4. `data-matcap`** — сохранить или пересмотреть (GL-эффект ховера; согласовать с пользователем).
5. **B5. i18n** — новые ключи ×10 локалей, вычистка старых кейс-ключей.
6. **B6. Двойник** — пока существует `markups/home.ts` (A3 не выполнен): зеркалить изменения в него, иначе сломается baseline-синтез. Если A3 уже выполнен — шаг не нужен.
7. **B7. Верификация** — build, tsc, lint, i18n-check (реген baseline), новые эталонные скриншоты home, smoke.

---

## Синхронизация треков

- A1 (футер) — **до** регена baseline в B7: обе задачи меняют SSR-HTML; baseline регенерируем по очереди, не параллельно.
- A2/A3 не трогают `components/pages/home.tsx`; трек B не трогает `BootPage`/`(legacy)/layout.tsx`.
- B6 зависит от A3: markups удалены → двойник не нужен.

## Открытые решения (нужно решение пользователя)

- GDPR: маршрут и набор локалей (A4).
- Кейсы: контент/посыл/фоны/matcap — заполняется по ходу трека B.
- Хостинг и домен (деплой): Vercel vs VPS рядом с `app.de-press.co` (учитывать объём статики).

## Деплой ⬜

`next build` + `next start`; чеклист: 200/404, 10 локалей, `/safety`, mobile, 0 ошибок консоли.

## Верификация каждого коммита

Кратко (полная версия — в README):

- `npx tsc --noEmit` · `npm run lint` · i18n-check (перед прогоном: поднять сервер, `node scripts/regen-html-baseline.mjs`) · `npm run build` · `npm run screenshots` · html-diff (пока живы markups) · smoke 200/404.
- Серверы: dev :3001 / `next start` :3111 (свежий, `BASE_URL=…`); остановка `pkill -f '[n]ext-server'`.
- Правило для агентов: Next.js в репо новее обучающих данных — перед кодом читать `node_modules/next/dist/docs/`.


