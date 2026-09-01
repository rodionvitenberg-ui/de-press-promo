# Runtime contract (own runtime ↔ page DOM)

Источник: реверс легаси-бандла `public/static/js/main.js` (webpack, GSAP/TweenMax,
Highway router) + `public/data/scene/*.json`. Этот документ — интерфейс между
Агентом A (рантайм) и Агентом B (страницы/JSX): B гарантирует DOM, A гарантирует
поведение. Ничего из списка не переименовывать без синхронного изменения здесь.

## Boot (порядок фиксирован)

1. Body стартует с `lock-scroll` (класс страницы), `data-theme`, `data-page`.
2. Device-детект (замена Detectizr/Modernizr): `desktop|tablet|mobile`,
   orientation, `prefers-reduced-motion`, WASM-проба, touch.
3. `mobile` → `html.disable-scene` + `window.disable_scene=true`; `tablet|mobile` →
   `html.disable-motion` + `window.disable_motion=true`.
4. Нет WASM → фолбэк: снять `lock-scroll`, всем `.js-in-view` добавить `in-view`.
5. Desktop/tablet: загрузить `public/data/scene/{desktop|tablet-*}.json`,
   сконструировать `SceneGL({ data, reduced: tablet, container: '.scene-root-inner',
   imagePath: '/static/assets/island/images/island/final/',
   dracoPath: '/static/assets/island/draco/',
   modelPath: '/static/assets/island/models/' })`.
6. Loader (`components/runtime/loader.ts`, точный порт легаси):
   `.site-loader` → `is-visible` (1.2s) → параллельно фейк-процент кольца
   (тики 100ms, cap 0.9, `strokeDashoffset = (130 − 130·p)·π`) и загрузка
   ассетов острова → `loaded()` (retina: `setSSAA(true)`, `setSSAAQuality(1)`,
   `setPixelRatio(1)` при devicePixelRatio > 1) → кольцо в 0 за 1s →
   `completed` → `is-hidden`. На mobile/no-wasm загрузка мгновенна
   (легаси `: true`), тайминги лоадера те же. Кольцо видимо на прямых
   открытиях (обложка с первого кадра — `html.dp-boot-load`, inline-скрипт
   layout); при шторочном входе (`html.dp-nav-in`) — скрыто под шторкой.
7. По `completed` (легаси `Default.onLoaderCompleted`): остров есть →
   `show()` + `init()` + `onResize()` (unlock — в onComplete интро);
   острова нет → снять `lock-scroll` напрямую (мобильный путь).
   `InView.reset()` (reveals + lazy) — через 500ms после `completed`;
   `Loader.hide()` — параллельно.

## Island (сцена) — точный порт легаси

- Кадровый цикл: `GL.update()`; `dest = min(lerp(dest, value, 0.2), 1)`;
  `GL.setAnimationProgress(dest, true)`; на non-touch: `dest = lerp(dest, mouse, 0.1)`
  → `GL.setMouse(dest)`.
- Мышь: `x = clientX/innerWidth*2-1`; `y = -((innerHeight-clientY)/innerHeight)*2+1`.
- KEYPOINTS (из JSON состояния): анкеры `top = rect.top + pageYOffset -
  innerHeight/2 + (offset||0)`; пересчёт на resize и после смены контента.
- onScroll: `S = pageYOffset`; для пары PA/PB: `TA=PA.top`, `TB=PB?.top ?? pageHeight -
  innerHeight`, `VA=PA.value`, `VB=PB?.value ?? VA`; если `(S-TA)*(S-TB) <= 0`:
  `N = min((S-TA)/|TA-TB|, 1)`; `value = lerp(VA, VB, N)`. Флаг `visible === false`
  у ключевой точки управляет `html классом` `.scene-root.is-visible`.
- Состояния страниц: `home→HOME_STATE`, `about→ABOUT_STATE`, `values→VALUES_STATE`,
  `contact→CAREERS_STATE`, `privacy→PRIVACY_STATE` (в JSON нет CONTACT_STATE —
  контакт переиспользует легаси-careers позы; PRIVACY_STATE — оригинальная
  поза about, поднятая и отзеркаленная вправо от заголовка; камера смотрит
  с −Z (`stage.ts`), поэтому мир X+ = лево экрана — «вправо» это минус X). Меню: `setState('MENU_STATE') + setMatcap(1,0) +
  setMatcapProgress(1) + setAnimationProgress(1, hard)`.
- Initial matcap по страницам: home `[1,0]`, about `[3,3]`, values `[2,2]`,
  contact `[4,4]`, privacy `[3,3]`.

## DOM-хуки (гарантирует B, потребляет A)

| Хук | Поведение |
|---|---|
| `.js-in-view` | IntersectionObserver → добавить `.in-view` (однократно); hero/`.fx-parent` каскад — чистый CSS по `.in-view` |
| `.js-lazy` (+ `source[data-srcset]`) | lazy-подмена `data-src`/`data-srcset` при приближении (lozad-поведение, margin 300px); исключение: элементы с нулевым rect (скрытые сцены) прелоадятся сразу — IO их никогда не увидит |
| `.site-header-button` | открыть/закрыть меню: `button.is-active`; через 800ms `body.menu-open`; сцена → MENU_STATE. Закрытие — тот же проход шторки (`menu-running` 1.6s), `menu-open` снимается в середине (ещё через 800ms) — страница раскрывается уходом шторки вправо |
| `body.menu-running` | блокировка повторных кликов на время анимации шторки |
| `html.dp-nav-in` / `.dp-nav-cover` / `.dp-nav-out` + `.page-curtain` | шторочные переходы страниц (`runtime/transition.ts` + inline-скрипт `app/(legacy)/layout.tsx`): leave — внутренняя ссылка (кроме `/safety/`, внешних, `_blank`/`download`) ставит `sessionStorage["dp-nav"]`, покрывает экран (0.8s) и навигирует; enter — скрипт до первой отрисовки потребляет флаг → `dp-nav-in` (страница открывается уже покрытой); boot после loader `completed` держит 0.3s и уводит шторку вправо (`dp-nav-out`). Без флага скрипт ставит `dp-boot-load` — обложка прелоадера с первого кадра прямого открытия |
| `.js-cookie` + `.js-cookie-accept`/`.js-cookie-deny` | нет `localStorage.acceptedCookie` → `.visible`; клик → записать `true`/`false`, снять `.visible` |
| `.home-cases-list a[data-matcap][data-theme]` | hover → `body[data-theme=…]` + tween `setMatcap(a,b)`; уход → сброс на страницу; сцены `.home-cases-scene` получают `is-visible`/`is-hidden` (`has-delay` — стаггер) |
| `.js-table-expand` (about) | клик → `.about-table.is-expanded` (однократно) + пересчёт анкеров скролла |
| `.js-typed` + `.js-sentences` (contact) | typewriter: содержимое `.js-sentences` — JSON-массив строк; печать/стирание по кругу, курсор `span.typed-cursor` |
| Хедер | скролл: `scrollTop >= headerHeight` → `body.header-sticky`; вниз → `+header-is-hidden`, вверх → показать; при меню — sticky без hidden; первая прокрутка направления не имеет (legacy `previousScrollTop` стартует как undefined) |
| `.ruler--*` | якоря KEYPOINTS — обязательны в разметке сцен (`.scene-root`) |

## Границы владения

- Next.js: роуты, SSG/SSR, `<Link>` не используется — навигация обычными
  `<a>` (full page load, каждый роут бутится заново); переходы — шторка
  поверх загрузки (`runtime/transition.ts`).
- Рантайм владеет DOM после boot (React не ре-рендерит дерево страниц).
- С A2 вендор `main.js`/`detectizr.js`/`modernizr.js` больше не загружается
  (дефолтный boot — `components/runtime/boot`); файлы удаляются в A3.
