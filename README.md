# de-press.co — промо-страница (Next.js)

Промо-страница **de-press.co** — некоммерческая, эмпатичная платформа-«тихая гавань» для людей, которым эмоционально тяжело. Альтернатива токсичным социальным сетям: вместо лайков, рейтингов и публичных реакций — тишина, эмпатия и контроль со стороны автора.

Этот репозиторий — **промо-страница / лендинг проекта**, построенный на основе сценарного движка [dogstudio.co](https://dogstudio.co/):

- Движение камеры, эффекты, matcap-подсветка, длина скролла — **наследуются от оригинала**.
- Контент, посыл и 3D-модель — **полностью заменяются на свои** (модель ещё не выбрана, нарратив в проработке: история проекта / история депрессии / иной сценарий).

**Важно:** это не «клон для учёбы». Это собственный продукт, который постепенно, аккуратно и без поломок переводится с минифицированных бандлов Dogstudio на поддерживаемый код.

---

## Оглавление

1. [Два мира: Legacy vs Lab](#два-мира-legacy-vs-lab)
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
- Архитектура оригинала: [`study/ARCHITECTURE.md`](./study/ARCHITECTURE.md)

---

## Два мира: Legacy vs Lab

Проект разделён на два мира. Это главное, если ты привык к «нормальному» Next.js.

| | **Legacy** (основа промо) | **Lab** (песочница) |
|--|---------------------------|---------------------|
| URL | `/`, `/studio/`, `/careers/`, `/values/`, `/contact/` | `/lab/`, `/lab/playground/...` |
| Вёрстка | HTML-снимки в `components/legacy/markups/*` (постепенно → JSX) | React-компоненты |
| Стили | `public/.../main.css` (orig) + кастомные overrides | `components/lab/lab.css` (+ свои) |
| JS / motion / WebGL | `dog.js` + `main.js` → **план: собственный GL-модуль** | hooks, GSAP, R3F… по желанию |
| Правки | Аккуратно; `mirror` затирает markups | Свободно, как в любом Next-проекте |
| Назначение | **Прод-основа**: сценарий, эффекты, скролл | Эксперименты и переиспользуемые паттерны |

```
┌──────────────────────────────────────────────────────────┐
│  Next.js (route groups, dev server)                      │
│                                                          │
│  (legacy) ─► DogstudioPage ─► HTML + dog.js + main.js    │
│      │              ▲              │                     │
│      │              │              └──→ Фаза 2: GL-модуль │
│      │              └── public/app/themes/portfolio-2018 │
│      │                                                   │
│  (lab) ────► page.tsx + components/lab/*                 │
│      │                                                   │
│  study/ ───► SCSS + beautified JS (только чтение)        │
└──────────────────────────────────────────────────────────┘
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

> Промо-страница рассказывает историю проекта. Сценарно — так же, как главная dogstudio: движение камеры не меняется, те же эффекты, та же подсветка, та же длина скролла. Меняем только контент и 3D-модель.

---

## Быстрый старт

```bash
npm install
npm run mirror          # при необходимости: live → assets + markups
npm run study:extract   # опционально: SCSS + beautified JS
npm run dev
```

| Что | URL |
|-----|-----|
| Home (legacy) | http://localhost:3000/ |
| Studio | http://localhost:3000/studio/ |
| Careers | http://localhost:3000/careers/ |
| Values | http://localhost:3000/values/ |
| Contact | http://localhost:3000/contact/ |
| **Lab index** | http://localhost:3000/lab/ |
| Tokens | http://localhost:3000/lab/playground/tokens/ |
| Type | http://localhost:3000/lab/playground/type/ |
| Appear | http://localhost:3000/lab/playground/appear/ |
| Chrome (header/menu/footer) | http://localhost:3000/lab/playground/chrome/ |
| Page shells | http://localhost:3000/lab/playground/pages/ |
| Careers slider | http://localhost:3000/lab/playground/slider/ |
| Showreel modal | http://localhost:3000/lab/playground/showreel/ |
| Theme / matcap mood | http://localhost:3000/lab/playground/themes/ |
| Dog R3F | http://localhost:3000/lab/playground/dog/ |
| Product starter | http://localhost:3000/lab/product/ |

Desktop: полный WebGL dog. Mobile: `disable_dog` (как в оригинале).

---

## Структура репозитория

```
app/
  layout.tsx                      # минимальный html/body
  (legacy)/
    layout.tsx                    # link → original main.css
    page.tsx                      # /
    studio|careers|values|contact/page.tsx
  (lab)/
    layout.tsx                    # lab.css
    page.tsx                      # /lab/
    playground/tokens|appear/page.tsx

components/
  legacy/
    DogstudioPage.tsx             # inject HTML + boot scripts
    createLegacyPage.tsx          # фабрика page
    markups/                      # GENERATED (mirror) → кастомизируем
  lab/
    LabShell.tsx
    AppearDemo.tsx
    lab.css

public/app/themes/portfolio-2018/static/
  css/main.css
  js/{detectizr,modernizr,dog,main}.js
  assets/                         # 3D, textures, fonts, images, audio
  # (план) data/dog/*.json        # STATES / MATCAPS — данные наружу

public/data/dog/                  # (план) вынесенные данные состояний

study/                            # не runtime
  ARCHITECTURE.md
  scss/
  js/*.beautified.js

scripts/
  mirror-pages.mjs                # ⚠️ защитить от перезаписи модели (Фаза 0)
  extract-scss-from-map.mjs
  beautify-js.mjs

docs/
  WORKFLOW.md
```

---

## Как чем управлять

### Страницы legacy

| Файл | Роль |
|------|------|
| `app/(legacy)/*/page.tsx` | Route + metadata + `createLegacyPage(mod)` |
| `components/legacy/markups/*.ts` | `BODY_CLASS`, `DATA_THEME`, `DATA_PAGE`, `MARKUP`, `PAGE_TITLE` |
| `components/legacy/DogstudioPage.tsx` | Boot: Detectizr → dog.js → main.js (→ план: GL-модуль) |

| URL | `data-router-view` / slug |
|-----|---------------------------|
| `/` | `home` |
| `/studio/` | `about` |
| `/careers/` | `careers` |
| `/values/` | `values` |
| `/contact/` | `contact` |

### Ассеты

- Не ломай пути: runtime ждёт `window.Dogstudio.theme_link = '/app/themes/portfolio-2018'`.
- Картинки: `public/.../static/assets/images/...`
- Dog: `.../dog/models/`, `.../dog/images/dog/final/` (+ `ASTC/`, `PVRTC/`).

### Стили

| Слой | Как |
|------|-----|
| Runtime legacy | `<link href=".../main.css">` в `(legacy)/layout` — **не** bundler import |
| Понимание | `study/scss/**` |
| Свои | `(lab)` + `components/lab`; кастомные overrides legacy — отдельный файл |

### Runtime JS

| Файл | Workflow |
|------|----------|
| `public/.../main.js`, `dog.js` | Сейчас: minified, правки нежелательны. План: вытеснить GL-часть собственным модулем (Фаза 2) |
| `study/js/*.beautified.js` | Читать / искать |

### Mirror

```bash
npm run mirror                              # assets + markups
npm run mirror:assets                       # только assets
npm run mirror -- --pages=home,studio       # выборочно
```

- Качает HTML + ассеты.
- Полный `mirror` **перезаписывает** `components/legacy/markups/*.ts`.
- ⚠️ **Фаза 0:** модели и matcap-атласы убраны из `KNOWN_ASSETS`, чтобы mirror не затёр кастомизацию.
- Ручные правки markups → commit/stash **до** полного mirror, либо используй `--assets-only`.

---

## Как редактировать

### A. Текст / ссылки на legacy

1. `components/legacy/markups/<page>.ts`
2. Найти фрагмент в `MARKUP`
3. Hard refresh
Не гоняй `mirror` сразу после.

### B. Картинка

- Заменить файл с **тем же именем**, или
- Поменять `data-src` / `src` / `data-srcset` в markup.

### C. Быстрый cosmetic на клоне (хрупко)

Override CSS **после** main.css только в legacy (отдельный файл, если добавишь).
Лучше переносить вид в собственные страницы.

### D. Своя фича

**Пока — только lab:**
```
app/(lab)/playground/my-feature/page.tsx
components/lab/MyFeature.tsx
```
После Фазы 2–3 — напрямую в прод-страницы промо.

### E. Понять эффект

1. DevTools → класс (`.appear-fade-up`, `.site-loader`…)
2. `rg "appear-fade" study/scss`
3. `rg "appear-fade" study/js/main.beautified.js`
4. Lab playground

---

## 3D-модель: устройство и безопасная замена

Сценарный движок (унаследован от dogstudio) **не принимает произвольную модель «файл-в-файл»**. Разбор `dog.js` + `main.js` + `data-*.js` показывает жёсткие связи:

### Как рантайм использует модель

| Слой | Что хардкодит | Где живёт |
|------|---------------|-----------|
| **Разметка мешей** | `skinWeight` → тело; имена `Reye`/`Leye` → глаза; всё прочее → «ветки» (скрываются на `reduced`) | `dog.js` (`traverse`) |
| **Материалы** | Кастомный шейдер ждёт `map`, `normalMap`, `specularMap`, matcap-атлас `tMatCap`, веса | `dog.js` (`onBeforeCompile`) |
| **«Анимация»** | Полёт камеры по сплайнам `CAM_Y, DEPTH, V_ROTATION, H_ROTATION, X_OFFSET, Y_OFFSET, MOUSE_INFLUENCE` — модель статична | `main.js` → `data-*.js` |
| **«Свет»** | Matcap-атлас (`MATCAP_PER_ROW = 10`), параметры ячеек `normalScale/diffuseWeight/specularWeight`; `const vec3 pos = vec3(13.,20.,13.)` | `main.js` + `dog.js` |
| **Масштаб** | `scale: 20`, `offsetX: .2, offsetY: -.5, offsetZ: .15` | `dog.js` (load) |

### Порядок безопасной замены (по фазам роадмапа)

1. **Фаза 1 — данные наружу.** Состояния и matcap-параметры выносятся из `main.js` в `public/data/dog/*.json`. Полёт камеры и «свет» становятся данными.
2. **Фаза 2 — GL-модуль.** `dog.js` переписывается на TypeScript/three с API 1:1 (`window.DogGL`). Разметка мешей, шейдер, масштаб становятся читаемым кодом.
3. **Фаза 3 — модель.** Положить новый `.glb` (+ опционально `.drc.glb`), поменять конфиг, настроить разметку (например, единый материал для статичного меша) и кривые состояний под новый размер/центр.

**Только после Фазы 2 замена модели — это «положить файл + поправить конфиг», а не хирургия по minified-бандлу.**

---

## Роадмап

Статусы: ✅ сделано · 🔄 в работе · ⬜ план

### Фаза 0 — Фриз и защита 🔄

- [x] Next shell + offline assets
- [x] study: SCSS, beautified JS, ARCHITECTURE
- [ ] Git-точка (`legacy-dogstudio-<дата>`) + скриншоты/видео всех состояний (эталон регрессий)
- [ ] **Защита от mirror**: `dog.glb`, `dog.drc.glb`, `matcap-*.jpg` убраны из `KNOWN_ASSETS`
- [ ] Пересобрать README под новое направление (этот документ)

### Фаза 1 — Данные наружу ⬜

- [ ] Извлечь `STATES`, `MATCAPS`, `MATCAP_PER_ROW` из `main.js` (modules `data-*.js`)
- [ ] Выложить в `public/data/dog/*.json`
- [ ] `DogstudioPage` прокидывает JSON в `DogGL` через `data`
- Результат: управление «камерой» и «светом» данными без правки бандлов. Оценка: 1–2 дня.

### Фаза 2 — GL-модуль вместо dog.js ⬜

- [ ] TypeScript-модуль на актуальном three.js, API 1:1 c `window.DogGL`:
  `init, setAnimationProgress, setMatcap, setMatcapProgress, setState, setMouse, update, setSSAA, setPixelRatio`
- [ ] Воспроизвести: Catmull-Rom сплайны (7 массивов), разметку мешей, кастомный шейдер, Draco
- [ ] `DogstudioPage.tsx` загружает GL-модуль вместо `dog.js`
- Результат: `main.js` не замечает подмены; WebGL — поддерживаемый код. Оценка: 1–2 недели.

### Фаза 3 — Кастомизация ⬜

- [ ] Выбрать нарратив и сущность 3D-модели (история проекта / депрессии / иное)
- [ ] Подготовить `.glb` / `.drc.glb`; заменить пути в конфиге; `scale`/offset/кривые состояний
- [ ] Упростить/адаптировать разметку мешей под структуру новой модели
- [ ] «Свет»: новый matcap-атлас или PBR-материал с реальными источниками света
- [ ] Контент: тексты, «тихие фразы», ссылки на `/safety` (кризис → 112/103)
- [ ] Брендинг: `theme_link`, favicon, мета, шрифты
- Оценка: 1–3 дня после Фазы 2 (обычная 3D-задача).

### Фаза 4 — Чистка и прод ⬜

- [ ] Выпилить ненужное из `main.js` (Highway-роутер, showreel, cases-hovers) после проверки
- [ ] Заменить `main.js` на лёгкий собственный рантайм (GSAP-паттерны остаются)
- [ ] `npm run build`, проверка mobile + `/safety`
- [ ] Карантин legacy-бандлов → archive

---

## Скрипты

| Команда | Назначение |
|---------|------------|
| `npm run dev` | Dev-сервер |
| `npm run build` / `start` | Production |
| `npm run lint` | ESLint |
| `npm run mirror` | Pages + assets → markups |
| `npm run mirror:assets` | Только assets (markups не трогать) |
| `npm run mirror -- --pages=home,studio` | Выборочные страницы |
| `npm run mirror:help` | CLI help |
| `npm run study:scss` | CSS map → `study/scss/` |
| `npm run study:js` | Beautify → `study/js/` |
| `npm run study:extract` | scss + js |

---

## Шпаргалка «хочу X → Y»

| Хочу | Делаю |
|------|--------|
| Запустить промо | `npm run dev` → `/` |
| Понять архитектуру оригинала | `study/ARCHITECTURE.md`, `study/scss`, `study/js` |
| Поменять текст home | `components/legacy/markups/home.ts` |
| Поменять «свет»/камеру | Фаза 1 (данные наружу) → `public/data/dog/*.json` |
| Заменить 3D-модель | Фаза 2 + 3 (GL-модуль, затем файл + конфиг) |
| Своя страница | `app/(lab)/...` + `components/lab/...` |
| Appear-анимация | `/lab/playground/appear` |
| Header/menu/footer | `/lab/playground/chrome` |
| Typography | `/lab/playground/type` |
| Matcap hover | legacy home + `rg setMatcap study/js` |
| Обновить с live | `npm run mirror` или `mirror:assets` (модель защищена, Фаза 0) |
| Не сломать dog | пути `public/app/themes/...` + `theme_link`; после Фазы 2 — конфиг GL-модуля |
| Стили lab | `(lab)/layout` + `lab.css` |
| Выкинуть остатки клона | после Фаз 2–4: удалить ненужные части `main.js`, markups, theme public |

---

## Ограничения и копирайт

- **Сценарный движок** (WebGL-собака, matcap, scroll/motion, loader, menu) унаследован от [dogstudio.co](https://dogstudio.co/) и используется как **техническая основа**.
- Контент, бренд, 3D-модель и посыл — **полностью заменяются на de-press.co** до публичного релиза.
- Vimeo showreel — сеть; poster локальный. Cases / news / newsletter / mx — не зеркалились.
- Highway на legacy fetch’ит соседние URL (нужен `[data-router-view]` — у нас есть).
- **Не деплой клон как публичный сайт и не выдавай контент Dogstudio за своё портфолио.** Публикуется только кастомизированная промо-страница.
- de-press.co — не медицина. Кризис → 112/103 и `/safety`.

---

## Связанные файлы

- [`docs/WORKFLOW.md`](./docs/WORKFLOW.md)
- [`study/ARCHITECTURE.md`](./study/ARCHITECTURE.md)
- [`scripts/mirror-pages.mjs`](./scripts/mirror-pages.mjs)# de-press-promo
