# de-press.co — промо-страница (Next.js)

Промо-страница **de-press.co** — некоммерческая, эмпатичная платформа-«тихая гавань» для людей, которым эмоционально тяжело. Альтернатива токсичным социальным сетям: вместо лайков, рейтингов и публичных реакций — тишина, эмпатия и контроль со стороны автора.

> de-press.co — не медицина и не замена терапии. Кризис → 112/103 и страница `/safety`.

**План работ, текущая стадия и зоны владения — [PLAN.md](./PLAN.md).**
Контракт DOM/классов рантайма — `components/runtime/contract.md`.

## Верификация (каждый коммит)

- `npx tsc --noEmit` → 0 ошибок
- `npm run lint`
- `node --experimental-strip-types scripts/i18n-check.mjs` → OK
  (перед прогоном: поднять сервер и выполнить `node scripts/regen-html-baseline.mjs`, снапшоты gitignored)
- `npm run build` → все страницы собираются
- `npm run screenshots` — дифф против эталона `reference/screenshots/`
  (против dev :3001 или свежего `next start` :3111, `BASE_URL=…`)
- Пока живы `components/legacy/markups/`: `node scripts/html-diff.mjs` — SSR-HTML «до vs после» по каждой странице × 10 локалей
- Smoke: 200/404

Остановка серверов: `pkill -f '[n]ext-server'` (паттерн `next start` процесс не ловит).

## Скрипты

| Команда | Назначение |
|---------|------------|
| `npm run dev` | Dev-сервер (:3001) |
| `npm run build` / `start` | Production |
| `npm run lint` | ESLint |
| `npm run screenshots` | Эталонные скриншоты (CDP, нужен запущенный dev/start) → `reference/screenshots/` |
| `node scripts/regen-html-baseline.mjs` | Регенерация baseline-снапшотов для i18n-check/html-diff |
| `node scripts/html-diff.mjs` | SSR-HTML «до vs после» (пока живы markups) |

## Ограничения

- Не переименовывать легаси DOM-классы, классы/атрибуты сцены и `data-*`-хуки — на них завязан рантайм (контракт: `components/runtime/contract.md`).
- Не импортировать `main.css` через bundler — только `<link>` (иначе `url(../assets/…)` ломаются).
- Не ломать пути `public/static` (`window.Site.assetsRoot`).
- de-press.co — не медицина. Кризис → 112/103 и `/safety`.
