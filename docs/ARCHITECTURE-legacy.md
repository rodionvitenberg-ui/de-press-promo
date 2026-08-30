# Dogstudio homepage — architecture notes (legacy)

Notes written during the original study phase. Paths like `study/`, `app/(lab)/`
and `npm run study:*` below refer to tooling that has since been removed —
see git history.

**Names below reflect the state at study time.** They were renamed during the
originalization pass (see README, Роадмап → Оригинализация): `DogstudioPage`
→ `BootPage.tsx`; `dog.js` / `window.DogGL` → the `glscene/` module
(`window.SceneGL`); `window.Dogstudio.theme_link` → `window.Site.assetsRoot`;
`.dog-scene(-inner)` → `.scene-root(-inner)`; `disable_dog` → `disable_scene`;
`data/dog/` → `data/scene/`; `assets/dog/` → `assets/island/`. Historical
mentions of Dogstudio are kept deliberately — this file documents the
reverse-engineering of the original, not the current product.

Local clone of [dogstudio.co](https://dogstudio.co/) homepage for reverse-engineering.  
Copyright: Dogstudio / DEPT. Not for redistribution as a product.

## Big picture

```
Browser
  └── Next.js shell (app/*/page.tsx + DogstudioPage)
        ├── CSS:  /static/css/main.css
        ├── DOM:  page snapshot from components/legacy/markups/*
        └── Scripts (order matters):
              1. detectizr.js   → device type
              2. modernizr.js
              3. dog.js         → window.DogGL (Three.js + Draco/WASM)  [desktop]
              4. main.js        → webpack app (GSAP, Highway router, pages, UI)
```

### Mirrored pages

| URL | WP slug / `data-router-view` | Markup module |
|-----|------------------------------|---------------|
| `/` | `home` | `components/legacy/markups/home.ts` |
| `/studio/` | `about` | `components/legacy/markups/studio.ts` |
| `/careers/` | `careers` | `components/legacy/markups/careers.ts` |
| `/values/` | `values` | `components/legacy/markups/values.ts` |
| `/contact/` | `contact` | `components/legacy/markups/contact.ts` |
| `/lab/` | — (React lab) | `app/(lab)/*` |

In-page navigation uses **Highway** (`@dogstudio/highway`): it `fetch`es the next URL and swaps `[data-router-view]`. Full page loads of each Next route also work (each boots `DogstudioPage` fresh).

`window.Dogstudio.theme_link = ''` is required so models, matcaps, audio, and sprites resolve under `public/static/`.

## Boot sequence (mirrored from original HTML)

1. Detectizr classifies device.
2. **Mobile:** `disable_dog = true` → skip WebGL dog, use 2D fallbacks in CSS/JS.
3. **Tablet/mobile:** `disable_motion = true` → reduced motion path.
4. WebAssembly probe (Draco decoder). If missing → hide loader, force `.in-view`.
5. Load `dog.js` then `main.js` (or only `main.js` when dog disabled).

Implemented in `components/legacy/DogstudioPage.tsx`.

## DOM map (homepage)

| Region | Classes / hooks | Notes |
|--------|-----------------|--------|
| Loader | `.site-loader`, `.site-loader-percent` | Progress while assets + dog load; body has `lock-scroll` until ready |
| Header | `.site-header` | Logo, news/cases shortcuts, menu button, sound toggle |
| Menu | `.site-menu` | Fullscreen nav + menu background picture |
| Dog stage | `.dog-scene` > `.dog-scene-inner` | WebGL canvas mount point |
| Hero | `.home-hero` | “We Make Good Shit” + showreel CTA |
| Cases | `.home-cases-list a[data-matcap][data-theme]` | Hover swaps dog matcap + body theme |
| Case scenes | `.home-cases-scene--*` | Large project cards / pictures |
| About | `.home-about` | Studio blurb + values link |
| Showreel | `.js-showreel`, `.js-plyr` | Plyr + Vimeo embed id `836218697` |
| Footer | `.site-footer` | Addresses, contact, social |

Scroll / reveal: `.js-in-view` + `.appear-fade` / `.appear-fade-up` (+ delay modifiers).

## WebGL dog (`dog.js` → `DogGL`)

- Bundled Three.js + GLTFLoader + DRACOLoader.
- Models:  
  - `static/assets/dog/models/dog.glb`  
  - `static/assets/dog/models/dog.drc.glb` (Draco-compressed)
- Materials:  
  - `…/images/dog/final/matcap-combined-resized.jpg` (atlas)  
  - `…/images/dog/final/dog_normals.jpg` (always JPEG)  
  - GPU-compressed (chosen by `COMPRESSED_FMT` at runtime):  
    - **ASTC** (most desktop Chrome/Firefox): `final/ASTC/{dog,branches}_{diffuse,specular|normals}.dds`  
    - **PVRTC** (iOS): `final/PVRTC/*.pvr`  
  - Also: `dog_diffuse.jpg`, `dog_specular.jpg`, `branches_*.jpg` as non-compressed siblings  
  - Resource keys: `dog-diffuse`, `dog-specular`, `dog-normals`, `branches-diffuse`, `branches-normals`, `matcaps`
- Draco runtime: `static/assets/dog/draco/*`
- Ambience: `static/assets/audios/ambience.mp3`

API surface actually called from `main.js` (full):

| Method | Where called |
|--------|--------------|
| `new DogGL(options)` | `dog/index.js` constructor — options carry `data`, `reduced`, `container`, `imagePath`, `dracoPath`, `modelPath` |
| `load()` | Loader `.load()` — promise or `true` when dog disabled |
| `init` (via tween) | Dog controller `.init()` flow |
| `update()` | Dog controller `.update()` (RAF loop) |
| `resize()` | Manager `.onResize()` |
| `setMatcap(a, b)` | Cases hover, menu, reset |
| `setMatcapProgress(t)` | GSAP tween on matcap crossfade |
| `setAnimationProgress(t, hard?)` | Scroll scrub + intro + menu |
| `setState(state)` | Pose / page state machine |
| `setMouse({x,y})` | Parallax / look-at |
| `setSSAA(bool)` / `setSSAAQuality(n)` | Dog `.loaded()` on hi-DPI |
| `setPixelRatio(n)` | Dog `.loaded()` on hi-DPI |

⚠️ Phase 1: since the 2026-08 port, `options.data` is **overridden** by
`public/data/scene/*.json` via a `Proxy` around `window.DogGL` in
`DogstudioPage.tsx`. Nothing in `main.js` changes; the bundle falls back to
its own `data-*.js` modules if the JSON fetch fails.

Homepage cases set matcaps via HTML:

```html
<a data-theme="tomorrowland" data-matcap="18, 18">…</a>
<a data-theme="navy-pier" data-matcap="7, 7">…</a>
<!-- … -->
```

On list leave, matcap resets toward `[1, 0]`. Body `data-theme` drives CSS color/theme variants.

## App JS (`main.js`)

Webpack bundle (~1.7 MB). Useful `//# sourceURL=webpack:///./src/js/...` breadcrumbs after beautify:

- `src/js/dog/index.js` — React-less Dog controller wrapping `DogGL`
- `src/js/dog/data-desktop.js` (+ mobile/tablet variants) — scroll/animation curves per breakpoint
- Page modules: home, about, menu, showreel, cases list hover
- GSAP / TweenMax — matcap + animation progress tweens, UI motion
- Plyr — Vimeo showreel
- Custom router via `data-router-view` / `data-router-wrapper` (SPA between WP pages; only home present locally)

Beautified copy: `study/js/main.beautified.js`, `study/js/dog.beautified.js`.

## CSS / SCSS

- Runtime: single `main.css` linked from layout (not imported through the bundler — preserves `url(../assets/...)`).
- Source map has **full `sourcesContent`** for ~153 files → extracted under `study/scss/`.
- Start reading:
  - `partials/` home, loader, menu, footer, cases
  - motion / in-view utilities
  - vendor: Plyr, tiny-slider (used elsewhere)

Fonts (self-hosted in CSS `@font-face`): **Heebo**, **Gilroy**, **GT Sectra Display**.

## Next.js boundary

| Owned by Next | Owned by original runtime |
|---------------|---------------------------|
| `npm run dev` / build / routes | WebGL, GSAP, menu, loader, cases hover |
| `app/(legacy)/layout.tsx` + CSS link | DOM mutations after boot |
| `DogstudioPage` one-shot mount | `main.js` page modules |
| `app/(lab)/*` React playgrounds | — |

Do not re-render the homepage tree with React after boot — `main.js` owns those nodes.

## How to re-sync from live site

```bash
npm run mirror        # re-download assets + regenerate home-markup.ts
npm run study:extract # SCSS from map + beautify JS
```

## External deps that stay online

- Vimeo player for showreel (poster is local).
- Optional: nothing else required for homepage chrome + dog.

## Learning path (suggested)

1. Run the app; interact with loader → dog → case hovers → menu.
2. Read this file + skim `study/scss/partials` for home/loader.
3. Search beautified `main.js` for `setMatcap`, `onListLeave`, `Dog.GL`.
4. Search beautified `dog.js` for `setMatcap`, matcap atlas, DRACOLoader.
5. Port one small behavior (e.g. in-view fade) to React/GSAP in a new route without touching the clone.
