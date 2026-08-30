# Daily workflow

Короткая шпаргалка. Полная картина — в корневом [README.md](../README.md).

## Перед работой

```bash
npm run dev   # :3001 (порт :3000 занят другим сервисом)
```

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
| WebGL/движение | `components/legacy/doggl/` |
| Данные «камеры»/«света» | `public/data/scene/*.json` (правка → hard refresh) |
| Ассеты | `public/static/...` |
| Переводы | `i18n/dictionaries/*.json` |

## Чего не делать

- Не править `public/.../main.js` / `dog.js` как основной способ.
- Не вешать Tailwind preflight / `next/font` на `(legacy)/layout`.
- Не `import` `main.css` через bundler.
- Не удалять `.site-loader`-заглушку в разметке (её ждёт рантайм).
- Не ломать пути `public/static` (`theme_link`).

## Инструменты

```bash
npm run dog-data     # main.js → public/data/scene/*.json (после правки STATES/MATCAPS)
npm run screenshots  # эталонные скриншоты → reference/screenshots/ (нужен запущенный dev/start)
npm run lint         # ESLint
npx tsc --noEmit     # типы
```
