# Daily workflow

Короткая шпаргалка. Полная картина — в корневом [README.md](../README.md).

## Перед работой

```bash
npm run dev   # :3001 (порт :3000 занят другим сервисом)
```

> Открывать только по `localhost:3001`. При заходе через `127.0.0.1` в dev-режиме
> падает HMR-сокет (`ERR_INVALID_HTTP_RESPONSE`) и гидрация не происходит
> (в prod-режиме `next start` без разницы). Это среда, не проект.

| Что открыть | URL |
|-------------|-----|
| Промо (ru) | http://localhost:3001/ |
| Локали | http://localhost:3001/{en,de,es,pl,pt,uk,zh,ja,ko}/… |
| Кризисная страница | http://localhost:3001/safety/ |

## Цикл правки текста / вёрстки

```
1. components/legacy/markups/<page>.ts — правишь MARKUP
2. Словарь: i18n/dictionaries/<locale>.json (ключ = исходная RU-строка)
3. node --experimental-strip-types scripts/i18n-check.mjs
4. Hard refresh (Ctrl+Shift+R)
```

Шаблоны-снимки не переписываются: тексты маппятся на рендере (`i18n/core.ts`);
анимационные заголовки перегенерируются из переводов через `<!--DP:FX:…-->`
плейсхолдеры, футерный переключатель языков — `<!--DP:LANGS-->`.

## Куда класть код

| Тип | Путь |
|-----|------|
| Страница | `app/(legacy)/<name>/page.tsx` (+ `app/(legacy)/[lang]/<name>/` для локалей) |
| Текст/вёрстка | `components/legacy/markups/<page>.ts` (HTML-снимок, осторожно) |
| Стили | override-файл после main.css в `app/(legacy)/layout.tsx` |
| WebGL/движение | `components/legacy/glscene/` |
| Данные «камеры»/«света» | `public/data/scene/*.json` (правка → hard refresh) |
| Ассеты | `public/static/...` |
| Переводы | `i18n/dictionaries/*.json` |

## Чего не делать

- Не править `public/static/js/main.js` как основной способ.
- Не вешать Tailwind preflight / `next/font` на `(legacy)/layout`.
- Не `import` `main.css` через bundler.
- Не удалять `.site-loader`-заглушку в разметке (её ждёт рантайм).
- Не ломать пути `public/static` (`window.Site.assetsRoot`).

## Инструменты

```bash
npm run scene-data    # main.js → public/data/scene/*.json (после правки STATES/MATCAPS)
npm run screenshots  # эталонные скриншоты → reference/screenshots/ (нужен запущенный dev/start)
npm run lint         # ESLint
npx tsc --noEmit     # типы
```
