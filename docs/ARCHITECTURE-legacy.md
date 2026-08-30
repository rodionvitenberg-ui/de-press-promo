# Legacy-рантайм — архитектура

Сценарный слой промо-страницы: WebGL-сцена, matcap-подсветка, скролл-хореография,
loader, menu. Документ описывает текущее устройство после оригинализации;
история реверс-инжиниринга исходного бандла — в git-истории.

## Big picture

```
Browser
  └── Next.js shell (app/(legacy)/*/page.tsx + BootPage)
        ├── CSS:  /static/css/main.css
        ├── DOM:  page snapshot from components/legacy/markups/*
        └── JS (порядок важен):
              1. detectizr.js / modernizr.js  → устройство
              2. island module → window.SceneGL (three.js + Draco/WASM)  [desktop]
              3. main.js       → webpack app (GSAP, Highway router, pages, UI)
```

### Pages

| URL | `data-router-view` | Markup module |
|-----|--------------------|---------------|
| `/` | `home` | `components/legacy/markups/home.ts` |
| `/about/` | `about` | `components/legacy/markups/about.ts` |
| `/values/` | `values` | `components/legacy/markups/values.ts` |
| `/contact/` | `contact` | `components/legacy/markups/contact.ts` |

`/safety/` (и `[lang]/safety`) — нативная Next-страница (`SafetyContent`), в legacy-рантайм не входит.

Локали живут под префиксами `/[lang]/…` (см. README → Локализация).

In-page navigation uses the Highway router: it `fetch`es the next URL and swaps
`[data-router-view]`. Full page loads of each Next route also work (each boots
`BootPage` fresh).

`window.Site.assetsRoot = ''` — модели, matcaps, аудио и спрайты резолвятся
под `public/static/`.

## Boot sequence

1. Detectizr классифицирует устройство.
2. **Mobile:** `window.disable_scene = true` → без WebGL-сцены, 2D-фолбэки в CSS/JS.
3. **Tablet/mobile:** `disable_motion = true` → reduced motion path.
4. WebAssembly-проба (Draco-декодер). Если нет → скрыть loader, форсировать `.in-view`.
5. Грузим island-модуль, затем `main.js` (только `main.js`, когда сцена выключена).

`BootPage.tsx` ставит `data-boot-src` (какой бандл грузить) и маркер
`.boot-page-root` (готовность разметки) до подключения скриптов.

## DOM map (home)

| Region | Classes / hooks | Notes |
|--------|-----------------|-------|
| Loader | `.site-loader`, `.site-loader-percent` | Прогресс, пока грузятся ассеты и сцена; body держит `lock-scroll` до готовности |
| Header | `.site-header` | Логотип (`.dp-logo`), кнопка меню, звук |
| Menu | `.site-menu` | Fullscreen-навигация + фоновая картинка |
| Scene stage | `.scene-root` > `.scene-root-inner` | Точка монтирования WebGL-канваса |
| Hero | `.home-hero` | Заголовок + intro-FX |
| Cases | `.home-cases-list a[data-matcap][data-theme]` | Hover меняет matcap сцены + тему body |
| Case scenes | `.home-cases-scene--*` | Большие карточки проектов |
| About | `.home-about` | Бла студии + ссылка на values |
| Modal | `.js-showreel`, `.js-plyr` | Plyr + Vimeo-эмбед (модалка «Манифест») |
| Footer | `.site-footer` | Адреса, контакты, соцсети |

Scroll / reveal: `.js-in-view` + `.appear-fade` / `.appear-fade-up` (+ delay-модификаторы).

## WebGL island (`components/legacy/glscene/` → `window.SceneGL`)

- three.js + GLTFLoader + DRACOLoader (актуальные версии, TypeScript).
- Модель: `static/assets/island/models/island.drc.glb` (Draco) с фолбэком
  на несжатый `island.glb`.
- Материалы: matcap-атлас `…/images/island/final/matcap-combined-resized.jpg`;
  диффуз `island_diffuse.jpg` (ресурс `island-diffuse`); ветки `branches_*.jpg`.
- Draco runtime: `public/draco/` (декодер из поставки three r185); legacy-обёртка
  Draco 1.3 — `static/assets/island/draco/`.
- Ambience: `static/assets/audios/ambience.mp3`.

API surface, который вызывает `main.js` (полный):

| Method | Where called |
|--------|--------------|
| `new SceneGL(options)` | options: `data`, `reduced`, `container`, `imagePath`, `dracoPath`, `modelPath` |
| `load()` | Loader `.load()` — promise или `true`, когда сцена выключена |
| `init` (via tween) | контроллер `.init()` |
| `update()` | контроллер `.update()` (RAF loop) |
| `resize()` | Manager `.onResize()` |
| `setMatcap(a, b)` | Cases hover, menu, reset |
| `setMatcapProgress(t)` | GSAP-tween crossfade matcap'ов |
| `setAnimationProgress(t, hard?)` | Scroll scrub + intro + menu |
| `setState(state)` | Состояния поз/страниц |
| `setMouse({x,y})` | Параллакс / look-at |
| `setSSAA(bool)` / `setSSAAQuality(n)` | hi-DPI |
| `setPixelRatio(n)` | hi-DPI |

`options.data` **переопределяется** `public/data/scene/*.json` через `Proxy`
вокруг `window.SceneGL` в `BootPage.tsx`. `main.js` ничего не знает о подмене;
при ошибке fetch бандл падает на собственные data-модули.

Matcaps кейсов задаются прямо в HTML:

```html
<a data-theme="tomorrowland" data-matcap="18, 18">…</a>
<a data-theme="navy-pier" data-matcap="7, 7">…</a>
<!-- … -->
```

При уходе со списка matcap возвращается к `[1, 0]`. Body `data-theme` управляет
CSS-вариантами темы.

## App JS (`main.js`)

Webpack-бандл (~1.7 MB) — legacy-слой, правится точечно. Внутри: page-модули
(home, about, menu, модалка «Манифест», hover кейсов), GSAP/TweenMax (tween'ы
matcap и progress, UI motion), Plyr (Vimeo), роутер на
`data-router-view` / `data-router-wrapper`.

## CSS

- Единый `main.css` подключается из layout (не через bundler — сохраняет
  `url(../assets/...)`).
- В sourcemap лежит полный `sourcesContent` — удобно искать селекторы.
- Шрифты (self-hosted `@font-face`): **Heebo**, **Gilroy**, **GT Sectra Display**.

## Граница Next.js

| Owned by Next | Owned by runtime |
|---------------|------------------|
| `npm run dev` / build / routes | WebGL, GSAP, menu, loader, hover кейсов |
| `app/(legacy)/layout.tsx` + CSS link | DOM-мутации после boot |
| `BootPage` one-shot mount | page-модули `main.js` |

Не ре-рендерить дерево домашней страницы React'ом после boot — этими нодами
владеет `main.js`.

## Внешние зависимости

- Vimeo-плеер для эмбеда (постер локальный).
