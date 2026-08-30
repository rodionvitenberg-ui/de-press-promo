# de-press.co — промо-страница (Next.js)

Промо-страница **de-press.co** — некоммерческая, эмпатичная платформа-«тихая гавань» для людей, которым эмоционально тяжело. Альтернатива токсичным социальным сетям: вместо лайков, рейтингов и публичных реакций — тишина, эмпатия и контроль со стороны автора.

Этот репозиторий — **промо-страница / лендинг проекта**, построенный на основе собственном сценарном движке (WebGL-сцена, matcap-подсветка, скролл-хореография):

- Движение камеры, эффекты, matcap-подсветка, длина скролла — уровень базового рантайма.
- Контент, посыл и 3D-модель — **полностью заменяются на свои** (модель ещё не выбрана, нарратив в проработке: история проекта / история депрессии / иной сценарий).

**Важно:** это не «клон для учёбы». Это собственный продукт, который постепенно, аккуратно и без поломок переводится с минифицированных legacy-бандлов на поддерживаемый код.

---

## Оглавление

1. [Как устроен проект](#как-устроен-проект)
2. [Проект de-press.co](#проект-de-pressco)
3. [Быстрый старт](#быстрый-старт)
4. [Структура репозитория](#структура-репозитория)
5. [Как чем управлять](#как-чем-управлять)
6. [Как редактировать](#как-редактировать)
7. [3D-модель: устройство и безопасная замена](#3d-модель-устройство-и-безопасная-замена)
8. [Роадмап](#роадмап)
9. [Скрипты](#скрипты)
10. [Шпаргалка «хочу X → Y»](#шпаргалка-хочу-x--y)
11. [Ограничения и копирайт](#ограничения-и-копирайт)
12. [Связанные файлы](#связанные-файлы)

- Day-to-day: [`docs/WORKFLOW.md`](./docs/WORKFLOW.md)
- Архитектура рантайма: [`docs/ARCHITECTURE-legacy.md`](./docs/ARCHITECTURE-legacy.md)

---

## Как устроен проект

Один продукт, одна основа: legacy-рантайм (сценарный движок) как технический фундамент, поверх него — собственный контент и i18n. Это главное, если ты привык к «нормальному» Next.js.

| Слой | Где живёт | Что это |
|--|--|--|
| Страницы | `app/(legacy)/` (+ `[lang]/` для локалей) | Route + metadata; контент — HTML-снимки в `components/legacy/markups/*` (постепенно → JSX) |
| Стили | `public/.../main.css` (orig) + override-файлы | Runtime CSS через `<link>`, не через bundler |
| JS / motion / WebGL | `main.js` + собственный GL-модуль (`components/legacy/glscene`) | «Камера»/«свет» — данные в `public/data/scene/*.json` |
| i18n | `i18n/` | 10 локалей; ключ = исходная RU-строка, маппинг на рендере |
| Инструменты | `scripts/` | scene-data (данные рантайма), эталонные скриншоты, i18n-проверки |

```
┌───────────────────────────────────────────────────────────┐
│  Next.js (route groups, dev server)                       │
│                                                           │
│  (legacy) ─► BootPage ─► HTML + SceneGL-модуль         │
│      │              ▲              │                      │
│      │              │              └─ public/data/scene    │
│      │              └── public/static                     │
│      │                  (main.css + main.js — runtime)   │
│  i18n ─────► словари + маппинг текстов на рендере         │
└───────────────────────────────────────────────────────────┘
```

**Частая ошибка:** править `app/(legacy)/page.tsx` и ждать, что изменится hero.
Там тонкая обёртка. Контент = markup + CSS + runtime (сейчас — minified бандлы).

---

## Проект de-press.co

**Предназначение:** эмпатичная платформа для эмоциональной поддержки. **Не медицина** и не замена терапии/экстренной помощи (кризис → 112/103 и страница `/safety`).

**Инвариант «облачков»:**
```
Публично: [монолог] [Я слышу тебя] [Тихие фразы] [Похожая история]
Автору:   Pulse · Hearers · приватные облачка · inbox · outreach
```
Нет публичных комментариев, лайков и who-heard.

**Принципы, которые нельзя ломать:**
1. Нет публичных лайков / рейтингов страдания.
2. Нет публичных комментариев под историей.
3. Чат инициирует только автор (accept или Author Outreach).
4. ИИ всегда помечен; без диагнозов и toxic positivity.
5. Emotional maps / «карта травм» — только device (ZK).
6. Anti-Panic важнее ленты и realtime.
7. Кризис → 112/103 и `/safety`.
8. Helper ≠ терапевт по умолчанию.

**Сознательные не-цели** для текущего scope: публичные треды/лайки, «мессенджер всех со всеми», серверная «карта травм», AI как скрытый peer, **3D-scrollytelling как блокер пилота**, open matching, мобильные приложения и WebRTC voice rooms — later / never.

> Промо-страница рассказывает историю проекта. Сценарно — на уровне базового рантайма: движение камеры не меняется, те же эффекты, та же подсветка, та же длина скролла. Меняем только контент и 3D-модель.

---

## Быстрый старт

```bash
npm install
npm run dev   # :3001 (порт :3000 занят другим сервисом)
```

| Что | URL |
|-----|-----|
| Home | http://localhost:3001/ |
| О проекте | http://localhost:3001/about/ |
| Values | http://localhost:3001/values/ |
| Contact | http://localhost:3001/contact/ |
| Safety | http://localhost:3001/safety/ |
| Локали | http://localhost:3001/{en,de,es,pl,pt,uk,zh,ja,ko}/… |

Desktop: WebGL-остров (SceneGL). Mobile: `disable_scene` (как в оригинале).

---

## Структура репозитория

```
app/
  layout.tsx                      # минимальный html/body
  (legacy)/
    layout.tsx                    # link → original main.css (+ override-файлы)
    page.tsx                      # /
    about|values|contact/page.tsx # ru (дефолтная локаль)
    [lang]/…                      # /en/, /de/, … — те же страницы в локали
    safety/page.tsx               # кризисная страница

components/
  legacy/
    BootPage.tsx                  # inject HTML + boot scripts
    createLegacyPage.tsx          # фабрика page
    markups/                      # HTML-снимки страниц → кастомизируем
    glscene/                      # ✅ Фаза 2: GL-модуль (порт сценарного модуля на three.js)

public/static/
  css/main.css
  js/{detectizr,modernizr,main}.js
  assets/                         # 3D, textures, fonts, images, audio

public/data/scene/                  # ✅ Фаза 1: STATES / MATCAPS / MATCAP_PER_ROW
                                  # (извлекаются из main.js скриптом, прокидываются в SceneGL)

i18n/                             # словари 10 локалей (ключ = исходная RU-строка)

scripts/
  extract-scene-data.mjs            # ✅ Фаза 1: main.js → public/data/scene/*.json
  i18n-extract.mjs                # сбор текстов markups → словари
  i18n-check.mjs                  # проверка покрытия переводов
  reference-screenshots.mjs       # эталонные скриншоты (CDP)

docs/
  WORKFLOW.md                     # day-to-day цикл правок
  ARCHITECTURE-legacy.md          # устройство оригинального рантайма
```

---

## Как чем управлять

### Страницы legacy

| Файл | Роль |
|------|------|
| `app/(legacy)/*/page.tsx` | Route + metadata + `createLegacyPage(mod)` |
| `components/legacy/markups/*.ts` | `BODY_CLASS`, `DATA_THEME`, `DATA_PAGE`, `MARKUP`, `PAGE_TITLE` |
| `components/legacy/BootPage.tsx` | Boot: Detectizr → SceneGL → main.js |

| URL | `data-router-view` / slug |
|-----|---------------------------|
| `/` | `home` |
| `/about/` | `about` |
| `/values/` | `values` |
| `/contact/` | `contact` |

### Локализация (i18n)

- 10 локалей: `en de es pl pt ru uk zh ja ko`. Дефолт — `ru`, живёт в корне;
  остальные — по префиксу `/{locale}/…` (`app/(legacy)/[lang]/…`, SSG через
  `generateStaticParams`).
- Словари — gettext-стиль: ключ = точная исходная RU-строка
  (`i18n/dictionaries/*.json`), `ru.json` — только намеренные переопределения.
  Нет перевода → показывается исходная строка, вёрстка не ломается.
- Шаблоны-снимки не переписываются: текстовые узлы и атрибуты
  (`title/alt/placeholder/data-after`) маппятся в `i18n/core.ts` на рендере;
  анимационные заголовки (`fx-letter`) перегенерируются из переводов через
  `<!--DP:FX:…-->` плейсхолдеры, футерный переключатель — `<!--DP:LANGS-->`.
- Проверка покрытия: `node --experimental-strip-types scripts/i18n-check.mjs`.


### Ассеты

- Не ломай пути: runtime ждёт `window.Site.assetsRoot = ''` (ассеты в `public/static/`).
- Картинки: `public/static/assets/images/...`
- Остров: `public/static/assets/island/models/`, `.../island/images/island/final/` (+ `ASTC/`, `PVRTC/`).

### Стили

| Слой | Как |
|------|-----|
| Runtime legacy | `<link href=".../main.css">` в `(legacy)/layout` — **не** bundler import |
| Свои | override-файл после main.css в `(legacy)/layout` (кастомные правила legacy) |

### Runtime JS

| Файл | Workflow |
|------|----------|
| `public/static/js/main.js` | Сейчас: minified, правки нежелательны. GL-часть вытеснена собственным модулем (Фаза 2) |
| `public/data/scene/*.json` | ✅ Фаза 1: данные «камеры»/«света» (STATES, MATCAPS). `BootPage` подменяет ими `options.data` в `new SceneGL(...)` без правки бандлов |

---

## Как редактировать

### A. Текст / ссылки на legacy

1. `components/legacy/markups/<page>.ts`
2. Найти фрагмент в `MARKUP`
3. Hard refresh

### B. Картинка

- Заменить файл с **тем же именем**, или
- Поменять `data-src` / `src` / `data-srcset` в markup.

### C. Быстрый cosmetic на клоне (хрупко)

Override CSS **после** main.css только в legacy (отдельный файл, если добавишь).
Лучше переносить вид в собственные страницы.

### D. Своя страница / фича

По образцу существующих:
```
app/(legacy)/my-feature/page.tsx
components/legacy/markups/my-feature.ts
```
Локаль-варианты — в `app/(legacy)/[lang]/my-feature/page.tsx`; переводы — в `i18n/dictionaries/`.

### E. Понять эффект

1. DevTools → класс (`.appear-fade-up`, `.site-loader`…)
2. `rg "appear-fade" public/static/css/main.css`
3. Механика/анимации — `docs/ARCHITECTURE-legacy.md`; JS — DevTools → Sources → `main.js` (minified)

---

## 3D-модель: устройство и безопасная замена

Сценарный движок **не принимает произвольную модель «файл-в-файл»**. Разбор legacy-бандла (`main.js` + его `data-*.js`) показывает жёсткие связи:

### Как рантайм использует модель

| Слой | Что хардкодит | Где живёт |
|------|---------------|-----------|
| **Разметка мешей** | `skinWeight` → тело; имена `Reye`/`Leye` → глаза; всё прочее → «ветки» (скрываются на `reduced`) | `glscene` (`island.ts`) |
| **Материалы** | Кастомный шейдер ждёт `map`, `normalMap`, `specularMap`, matcap-атлас `tMatCap`, веса | `glscene` (`material.ts`) |
| **«Анимация»** | Полёт камеры по сплайнам `CAM_Y, DEPTH, V_ROTATION, H_ROTATION, X_OFFSET, Y_OFFSET, MOUSE_INFLUENCE` — модель статична | `main.js` → `data-*.js` |
| **«Свет»** | Matcap-атлас (`MATCAP_PER_ROW = 10`), параметры ячеек `normalScale/diffuseWeight/specularWeight`; `const vec3 pos = vec3(13.,20.,13.)` | `main.js` (данные) + `glscene` (шейдер) |
| **Масштаб** | `scale: 20`, `offsetX: .2, offsetY: -.5, offsetZ: .15` | `glscene` (load) |

### Порядок безопасной замены (по фазам роадмапа)

1. **Фаза 1 — данные наружу.** Состояния и matcap-параметры выносятся из `main.js` в `public/data/scene/*.json`. Полёт камеры и «свет» становятся данными.
2. **Фаза 2 — GL-модуль.** Сценарный модуль переписан на TypeScript/three с API 1:1 (`window.SceneGL`). Разметка мешей, шейдер, масштаб становятся читаемым кодом.
3. **Фаза 3 — модель.** Положить новый `.glb` (+ опционально `.drc.glb`), поменять конфиг, настроить разметку (например, единый материал для статичного меша) и кривые состояний под новый размер/центр.

**Только после Фазы 2 замена модели — это «положить файл + поправить конфиг», а не хирургия по minified-бандлу.**

---

## Роадмап

**Актуальный рабочий план — контентная кастомизация: [`docs/ROADMAP.md`](./docs/ROADMAP.md).** Идём строго по нему.

Ниже — техфазы оригинализации (завершены) и остаточный техдолг; контентные правки ведутся по `docs/ROADMAP.md`.

Статусы: ✅ сделано · 🔄 в работе · ⬜ план

### Фаза 0 — Фриз и защита ✅

- [x] Next shell + offline assets
- [x] study-выжимки (SCSS, beautified JS, ARCHITECTURE) — впоследствии вычищены; ARCHITECTURE.md переехал в `docs/ARCHITECTURE-legacy.md`
- [x] Git-точка исходного состояния (см. git-историю)
- [x] Пересобрать README под новое направление (этот документ)
- [x] Скриншоты всех состояний (эталон регрессий) — `npm run screenshots` → `reference/screenshots/` (desktop + mobile; интерактив: меню, скролл, matcap-hover; манифест состояний — `manifest.json`)

### Фаза 1 — Данные наружу ✅

- [x] Извлечь `STATES`, `MATCAPS`, `MATCAP_PER_ROW` из `main.js` (modules `data-*.js`) — `scripts/extract-scene-data.mjs`
- [x] Выложить в `public/data/scene/*.json` (desktop / tablet-* / mobile-*)
- [x] `BootPage` прокидывает JSON в `SceneGL` через `data` (Proxy-обёртка над `window.SceneGL`; fallback на бандл при ошибке)
- Результат: управление «камерой» и «светом» = правка `public/data/scene/*.json` без пересборки бандлов.

### Фаза 2 — GL-модуль вместо legacy-модуля сцены ✅

- [x] TypeScript-модуль на актуальном three.js, API 1:1 c `window.SceneGL`:
  `load, update, resize, setState, setMatcap, setMatcapProgress, setAnimationProgress, setMouse, setSSAA, setSSAAQuality, setPixelRatio`
- [x] Воспроизвести: сплайны камеры по 7 массивам поз, разметку мешей, кастомный шейдер, Draco
- [x] `BootPage.tsx` загружает GL-модуль вместо legacy-модуля
- Результат: `main.js` не замечает подмены; WebGL — поддерживаемый код. Оценка: 1–2 недели.

Реализация — `components/legacy/glscene/` (порт сценарного модуля legacy-бандла, см. git-историю):

- Фасад `index.ts` повторяет публичный класс `window.SceneGL`; `installSceneGL()` ставит его в `window` до загрузки `main.js` (Phase-1 Proxy с JSON-данными продолжает работать поверх).
- Сплайны камеры: `custom-cubic` (DEPTH) + `monotone-cubic` (остальные 6 массивов) — те же алгоритмы, что в бандле (в README они условно названы «Catmull-Rom»).
- Кастомный matcap-шейдер перенесён дословно; для three r185 патч сам объявляет `varying vec2 vUv` (meshbasic больше не даёт `vUv`), а в skinned-ветке нормаль уже скиннит `skinnormal_vertex`.
- Draco: декодер three r185 требует API `DecodeArrayTo*`, поэтому в `public/draco/` лежит декодер из поставки three (`examples/jsm/libs/draco/gltf/`); legacy-обёртка в ассетах — Draco 1.3 (только `DecodeBufferToMesh`). Если `.drc.glb` не декодировался — фолбэк на несжатый `island.glb`.
- Текстуры всегда JPEG-набор (ASTC/PVRTC-варианты не портированы — та же картинка, упрощение Фазы 2).
- Не портировано (не нужно рантайму): dat.gui-редакторы, orbit-контролы, fbohelper/stats, ASTC/PVR-парсеры.

### Оригинализация — вычистка следов исходного референса ✅

Полное удаление следов исходного клона из кода, ассетов, DOM и документации по принятому 6-этапному плану. Упоминания источника в доках не нужны — детали в git-истории.

- [x] Пути: ассеты и данные приведены к нейтральным (`public/static/`, `public/data/scene/`); `THEME=""` и webpack publicPath в `main.js` (`794a1d6`)
- [x] Публичный контракт: DOM-классы сцены → `.scene-root(-inner)`, глобалы `window.Site.assetsRoot` / `window.SceneGL` / `window.disable_scene`, `data-boot-src`, `.boot-page-root`; CSS-модификатор → `.disable-scene`; удалён мёртвый legacy-модуль (`36a55d0`)
- [x] Консоль и копирайт: приветствие в консоли, баннеры, лог роутера, авторы и пути разработчика в комментариях, мёртвые модели (`98b5415`)
- [x] WordPress-классы body (`page-template*`, `page-id-*`, `home`) сняты — CSS/JS их не использовали (`9c49bf7`)
- [x] Внутренние имена: модуль → `glscene/`, страница-обёртка → `BootPage`, классы → `Island` / `IslandMaterial` / `StateDispatcher`, типы `Scene*`; попутно найдены следы вне инвентаря — 14 селекторов сцены в `main.css` (не переименуй — сломалось бы позиционирование канваса), 5 спрайтов, webpack-комментарии, баннер в css.map, видимый EN-текст (`ee340de`)
- [x] Инлайн-SVG-логотип из path-ов букв в шапках about/values/contact (текстовый grep его не видел) → текстовый `.dp-logo` (`a5a3e84`)
- [x] Хвосты: внутренние идентификаторы бандла (`Island`, `ISLAND_A/B/C`, webpack-переменные), 7 текстур-сирот старого нейминга (JPEG/DDS/PVR без единой ссылки) удалены, нейтральная формулировка ячейки about во всех 10 локалях (этот коммит)
- [x] Эталон скриншотов пересобран под новую реальность: маркер готовности `page-template → .boot-page-root`, loader timeout 45→90 с, intro settle 1.8→25 с; 12 состояний пересняты против prod-сборки и проверены визуально (`a5a3e84`)
- Результат: сквозной grep по маркерам исходного клона (брендовые строки, старые глобалы/DOM-классы/пути) даёт 0 вхождений в коде, ассетах и доках; остаются только случайные base64-коллизии в sourcemap и бинарный шум PNG. Верификация каждого этапа: `tsc --noEmit` 0, build 52/52, smoke 200/404.

### Фаза 3 — Кастомизация ⬜

- [ ] Выбрать нарратив и сущность 3D-модели (история проекта / депрессии / иное)
- [ ] Подготовить `.glb` / `.drc.glb`; заменить пути в конфиге; `scale`/offset/кривые состояний
- [ ] Упростить/адаптировать разметку мешей под структуру новой модели
- [ ] «Свет»: новый matcap-атлас или PBR-материал с реальными источниками света
- [ ] Контент: тексты, «тихие фразы», ссылки на `/safety` (кризис → 112/103)
- [ ] Брендинг: favicon, мета, шрифты
- Оценка: 1–3 дня после Фазы 2 (обычная 3D-задача).

### Фаза 4 — Чистка и прод ⬜

- [ ] Выпилить ненужное из `main.js` (Highway-роутер) после проверки; шоурил убрать целиком (кнопка на главной удалена в `35ec9db`; остались модалка «Манифест», Plyr/Vimeo, ссылки в меню); ховеры кейсов остаются — переработать их тему/контент
- [ ] Заменить `main.js` на лёгкий собственный рантайм (GSAP-паттерны остаются)
- [ ] `npm run build`, проверка mobile + `/safety`
- [ ] Карантин legacy-бандлов → archive

---

## Скрипты

| Команда | Назначение |
|---------|------------|
| `npm run dev` | Dev-сервер (:3001) |
| `npm run build` / `start` | Production |
| `npm run lint` | ESLint |
| `npm run scene-data` | Из `main.js` → `public/data/scene/*.json` (при правке STATES/MATCAPS) |
| `npm run screenshots` | Эталонные скриншоты (CDP, нужен запущенный dev/start) → `reference/screenshots/` |

---

## Шпаргалка «хочу X → Y»

| Хочу | Делаю |
|------|--------|
| Запустить промо | `npm run dev` → `/` (:3001) |
| Понять архитектуру рантайма | `docs/ARCHITECTURE-legacy.md` |
| Поменять текст home | `components/legacy/markups/home.ts` (+ словари i18n) |
| Поменять «свет»/камеру | ✅ Фаза 1: `public/data/scene/*.json` (после правки — hard refresh) |
| Заменить 3D-модель | Фаза 2 ✅ + 3 (файл + конфиг) |
| Своя страница | `app/(legacy)/...` + `markups/...` по образцу существующих |
| Matcap hover | legacy home; механика — `docs/ARCHITECTURE-legacy.md` |
| Не сломать сцену | пути `public/static` (`window.Site.assetsRoot`); конфиг GL-модуля (`components/legacy/glscene/`) |
| Выкинуть остатки клона | Фаза 4: удалить ненужные части `main.js`, markups, theme public |

---

## Ограничения и копирайт

- **Сценарный движок** (WebGL-сцена, matcap, scroll/motion, loader, menu) — **техническая основа** промо; следы исходного референса вычищены (Роадмап → Оригинализация).
- Контент, бренд, 3D-модель и посыл — **полностью заменяются на de-press.co** до публичного релиза.
- Vimeo showreel — сеть; poster локальный. Cases / news / newsletter / mx — не зеркалились.
- Highway на legacy fetch’ит соседние URL (нужен `[data-router-view]` — у нас есть).
- **Не деплой репозиторий «как есть».** Публикуется только промо-страница de-press.co.
- de-press.co — не медицина. Кризис → 112/103 и `/safety`.

---

## Связанные файлы

- [`docs/WORKFLOW.md`](./docs/WORKFLOW.md)
- [`docs/ARCHITECTURE-legacy.md`](./docs/ARCHITECTURE-legacy.md)
