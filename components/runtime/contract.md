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
6. Интро (Island.init): delayedCall 0.1s → если у страницы initialMatcap —
   `setMatcap(m0, m1)` + `setMatcapProgress(0→1)` за 3s Quad.easeOut; параллельно
   `animationProgress 0 → scrollTarget` за 1.8s Quart.easeOut; onComplete → снять
   `lock-scroll` (дальше включается in-view/lazy).

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
  `contact→CAREERS_STATE` (в JSON нет CONTACT_STATE — контакт переиспользует
  легаси-careers позы). Меню: `setState('MENU_STATE') + setMatcap(1,0) +
  setMatcapProgress(1) + setAnimationProgress(1, hard)`.
- Initial matcap по страницам: home `[1,0]`, about `[3,3]` (остальные — дефолт `[1,0]`).

## DOM-хуки (гарантирует B, потребляет A)

| Хук | Поведение |
|---|---|
| `.js-in-view` | IntersectionObserver → добавить `.in-view` (однократно); hero/`.fx-parent` каскад — чистый CSS по `.in-view` |
| `.js-lazy` (+ `source[data-srcset]`) | lazy-подмена `data-src`/`data-srcset` при приближении (lozad-поведение, margin 300px); исключение: элементы с нулевым rect (скрытые сцены) прелоадятся сразу — IO их никогда не увидит |
| `.site-header-button` | открыть/закрыть меню: `button.is-active`; через 800ms `body.menu-open`; сцена → MENU_STATE |
| `body.menu-running` | блокировка повторных кликов на время анимации шторки |
| `.js-cookie` + `.js-cookie-accept`/`.js-cookie-deny` | нет `localStorage.acceptedCookie` → `.visible`; клик → записать `true`/`false`, снять `.visible` |
| `.home-cases-list a[data-matcap][data-theme]` | hover → `body[data-theme=…]` + tween `setMatcap(a,b)`; уход → сброс на страницу; сцены `.home-cases-scene` получают `is-visible`/`is-hidden` (`has-delay` — стаггер) |
| `.js-table-expand` (about) | клик → `.about-table.is-expanded` (однократно) + пересчёт анкеров скролла |
| `.js-typed` + `.js-sentences` (contact) | typewriter: содержимое `.js-sentences` — JSON-массив строк; печать/стирание по кругу, курсор `span.typed-cursor` |
| Хедер | скролл: `scrollTop >= headerHeight` → `body.header-sticky`; вниз → `+header-is-hidden`, вверх → показать; при меню — sticky без hidden; первая прокрутка направления не имеет (legacy `previousScrollTop` стартует как undefined) |
| `.ruler--*` | якоря KEYPOINTS — обязательны в разметке сцен (`.scene-root`) |

## Границы владения

- Next.js: роуты, SSG/SSR, `<Link>` не используется на этом этапе — навигация
  обычными `<a>` (full page load, каждый роут бутится заново). Overlay-переходы —
  отдельное улучшение после паритета.
- Рантайм владеет DOM после boot (React не ре-рендерит дерево страниц).
- Удаляется вендор в конце: `main.js`, `detectizr.js`, `modernizr.js`.
