# de-press.co — промо-страница (Next.js)

Промо-страница **de-press.co** — некоммерческая, эмпатичная платформа-«тихая гавань» для людей, которым эмоционально тяжело. Альтернатива токсичным социальным сетям: вместо лайков, рейтингов и публичных реакций — тишина, эмпатия и контроль со стороны автора.

Репозиторий — **промо-страница / лендинг проекта** на собственном сценарном движке (WebGL-сцена, matcap-подсветка, скролл-хореография). Это собственный продукт, который переводится с легаси-вендорских бандлов на полностью собственный, поддерживаемый код — план оригинализации: [`docs/ROADMAP.md`](./docs/ROADMAP.md). Точка до начала — git-тег `pre-originalize`.

---

## Оглавление

1. [Проект de-press.co](#проект-de-pressco)
2. [Целевая архитектура](#целевая-архитектура)
3. [Быстрый старт](#быстрый-старт)
4. [Как чем управлять (переходный период)](#как-чем-управлять-переходный-период)
5. [Чего не делать](#чего-не-делать)
6. [Верификация (каждый коммит)](#верификация-каждый-коммит)
7. [3D-модель: устройство и безопасная замена](#3d-модель-устройство-и-безопасная-замена)
8. [Скрипты](#скрипты)
9. [Ограничения и копирайт](#ограничения-и-копирайт)

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

> Промо-страница рассказывает историю проекта. Сценарно — на уровне базового рантайма: движение камеры не меняется, те же эффекты, та же подсветка, та же длина скролла. Меняем контент и 3D-модель.

---

## Целевая архитектура

К деплою (Фаза 3 роадмапа завершена) репозиторий выглядит так:

```
app/(legacy)/                          routes + metadata (SSG, 10 локалей)
components/
  pages/{home,about,values,contact}.tsx   JSX-страницы вместо HTML-снимков (DOM и классы 1:1)
  runtime/                             собственный рантайм вместо legacy main.js
    SiteRuntime.tsx                    client-обёртка в (legacy)/layout — единственный
                                       владелец DOM после гидрации
    capabilities.ts                    mobile/tablet, prefers-reduced-motion, WASM
                                       (замена Detectizr/Modernizr)
    loader.ts · menu.ts · scroll-engine.ts · fx-letter.ts ·
    cases-hover.ts · cookie-bar.ts · transitions.ts
  legacy/glscene/                      наш TypeScript/three — сцена импортируется напрямую
i18n/                                  10 словарей (ключ = исходная RU-строка) + t(), <Fx>, <LangSwitcher>
public/static/css/                     main.css + depress.css
public/data/scene/*.json               данные сцены — первоисточник
```

| Слой | Где живёт | Что это |
|--|--|--|
| Страницы | `app/(legacy)/` + `components/pages/` | Route + metadata; контент — JSX (SSG, 10 локалей) |
| Стили | `public/static/css/` | Runtime CSS через `<link>`, не через bundler |
| JS / motion / WebGL | `components/runtime/` + `components/legacy/glscene/` | Рантайм — свой; «камера»/«свет» — `public/data/scene/*.json` |
| i18n | `i18n/` | 10 локалей; ключ = исходная RU-строка, маппинг на рендере |
| Инструменты | `scripts/` | Эталонные скриншоты, i18n-проверки, html-diff |

**Переходный период (Фазы 0–2):** контент ещё рендерится из HTML-снимков `components/legacy/markups/*` через `createLegacyPage`, рантайм — легаси `public/static/js/main.js` (boot: `components/legacy/BootPage.tsx`). JSX-страницы встают поверх того же легаси-рантайма и проверяются html-diff'ом; собственный рантайм включается в Фазе 3, после чего `markups/` и вендоры удаляются. Контракт DOM/классов рантайма — `docs/ARCHITECTURE-legacy.md` (временно, удаляется в Фазе 3).

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

> Открывать только по `localhost:3001`. При заходе через `127.0.0.1` в dev-режиме
> падает HMR-сокет (`ERR_INVALID_HTTP_RESPONSE`) и гидрация не происходит
> (в prod `next start` без разницы). Это среда, не проект.

Desktop: WebGL-остров (SceneGL). Mobile: `disable_scene` (как в оригинале).

Прод: `npm run build && npm run start`.

---

## Как чем управлять (переходный период)

### Цикл правки текста / вёрстки

```
1. components/legacy/markups/<page>.ts — правишь MARKUP (до Фазы 2),
   затем — components/pages/<page>.tsx
2. Словарь: i18n/dictionaries/<locale>.json (ключ = исходная RU-строка)
3. node --experimental-strip-types scripts/i18n-check.mjs
4. Hard refresh (Ctrl+Shift+R)
```

Тексты маппятся на рендере (`i18n/core.ts`); анимационные заголовки
перегенерируются из переводов через `<!--DP:FX:…-->` плейсхолдеры,
футерный переключатель языков — `<!--DP:LANGS-->`.

### Локализация (i18n)

- 10 локалей: `en de es pl pt ru uk zh ja ko`. Дефолт — `ru`, живёт в корне;
  остальные — по префиксу `/{locale}/…` (`app/(legacy)/[lang]/…`, SSG через
  `generateStaticParams`).
- Словари — gettext-стиль: ключ = точная исходная RU-строка
  (`i18n/dictionaries/*.json`), `ru.json` — только намеренные переопределения.
  Нет перевода → показывается исходная строка, вёрстка не ломается.
- Проверка покрытия: `node --experimental-strip-types scripts/i18n-check.mjs`.

### Стили

| Слой | Как |
|------|-----|
| Runtime | `<link href=".../main.css">` в `(legacy)/layout` — **не** bundler import |
| Свои | `depress.css` после main.css в `(legacy)/layout` |

### Ассеты и сцена

- Не ломай пути: runtime ждёт `window.Site.assetsRoot = ''` (ассеты в `public/static/`).
- Картинки: `public/static/assets/images/...`; остров: `public/static/assets/island/`.
- Сцена — собственный модуль `components/legacy/glscene/` (TypeScript/three,
  фасад `window.SceneGL`).
- Данные «камеры»/«света»: `public/data/scene/*.json` (STATES, MATCAPS) —
  правка без пересборки бандлов.

---

## Чего не делать

- Не править `public/static/js/main.js` — минифицированный вендор, удаляется в Фазе 3.
- Не вешать Tailwind preflight / `next/font` на `(legacy)/layout`.
- Не импортировать `main.css` через bundler — только `<link>` (иначе `url(../assets/…)` ломаются).
- Не удалять заглушку `.site-loader` в разметке — её ждёт рантайм.
- Не переименовывать легаси DOM-классы, классы/атрибуты сцены и `data-*`-хуки — на них завязан рантайм (контракт — `docs/ARCHITECTURE-legacy.md`).
- Не форматировать `main.css` вне согласованного разового прохода Фазы 2 (только переносы/секции — ни одного селектора или значения).
- Не ломать пути `public/static` (`window.Site.assetsRoot`).

---

## Верификация (каждый коммит)

- `npx tsc --noEmit` → 0 ошибок
- `npm run lint`
- `node --experimental-strip-types scripts/i18n-check.mjs` → OK
- `npm run build` → все страницы собираются
- `npm run screenshots` — дифф против эталона `reference/screenshots/`
  (против dev :3001 или свежего `next start` :3111, `BASE_URL=…`)
- Фазы 2–3: `node scripts/html-diff.mjs` — SSR-HTML «до vs после»
  по каждой странице × 10 локалей
- Smoke: 200/404

Остановка серверов: `pkill -f '[n]ext-server'` (паттерн `next start` процесс не ловит).

---

## 3D-модель: устройство и безопасная замена

Сценарный движок **не принимает произвольную модель «файл-в-файл»**. Жёсткие связи:

| Слой | Что хардкодит | Где живёт |
|------|---------------|-----------|
| **Разметка мешей** | `skinWeight` → тело; имена `Reye`/`Leye` → глаза; всё прочее → «ветки» (скрываются на `reduced`) | `glscene` (`island.ts`) |
| **Материалы** | Кастомный шейдер ждёт `map`, `normalMap`, `specularMap`, matcap-атлас `tMatCap`, веса | `glscene` (`material.ts`) |
| **«Анимация»** | Полёт камеры по сплайнам `CAM_Y, DEPTH, V_ROTATION, H_ROTATION, X_OFFSET, Y_OFFSET, MOUSE_INFLUENCE` — модель статична | `public/data/scene/*.json` |
| **«Свет»** | Matcap-атлас (`MATCAP_PER_ROW = 10`), параметры ячеек `normalScale/diffuseWeight/specularWeight`; `const vec3 pos = vec3(13.,20.,13.)` | `public/data/scene/*.json` + `glscene` (шейдер) |
| **Масштаб** | `scale: 20`, `offsetX: .2, offsetY: -.5, offsetZ: .15` | `glscene` (load) |

Замена модели — «положить файл + поправить конфиг»: новый `.glb`
(+ опционально `.drc.glb`), конфиг, разметка мешей и кривые состояний под
новый размер/центр. Детали рантайма — `docs/ARCHITECTURE-legacy.md`.

---

## Скрипты

| Команда | Назначение |
|---------|------------|
| `npm run dev` | Dev-сервер (:3001) |
| `npm run build` / `start` | Production |
| `npm run lint` | ESLint |
| `npm run scene-data` | Из `main.js` → `public/data/scene/*.json` (до Фазы 3) |
| `npm run screenshots` | Эталонные скриншоты (CDP, нужен запущенный dev/start) → `reference/screenshots/` |
| `node scripts/html-diff.mjs` | SSR-HTML «до vs после» (Фаза 2+) |

---

## Ограничения и копирайт

- **Сценарный движок** (WebGL-сцена, matcap, scroll/motion, loader, menu) — **техническая основа** промо; следы исходного референса вычищены.
- Контент, бренд, 3D-модель и посыл — **полностью заменяются на de-press.co** до публичного релиза.
- **Не деплоить репозиторий «как есть».** Публикуется только промо-страница de-press.co.
- de-press.co — не медицина. Кризис → 112/103 и `/safety`.
