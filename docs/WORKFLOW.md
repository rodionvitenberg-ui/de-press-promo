# Daily workflow

Короткая шпаргалка. Полная картина — в корневом [README.md](../README.md).

## Перед работой

```bash
npm run dev
```

| Нужен reference | Открой |
|-----------------|--------|
| Как выглядит оригинал-клон | http://localhost:3000/ |
| Свой React-код | http://localhost:3000/lab/ |

## Цикл «увидел → понял → сделал»

```
1. Legacy page (reference)
2. DevTools: class / data-* / network
3. study/scss or study/js (search)
4. Lab playground (React)
5. Iterate only in lab
```

### Пример: fade-up при скролле

1. Home → секция cases, class `appear-fade-up`.
2. `rg "appear-fade" study/scss`
3. `rg "in-view" study/js/main.beautified.js`
4. Смотри `/lab/playground/appear/` и `components/lab/AppearDemo.tsx`
5. Форкни под свой кейс.

## Куда класть код

| Тип | Путь |
|-----|------|
| Новая demo | `app/(lab)/playground/<name>/page.tsx` |
| React UI | `components/lab/` |
| Стили lab | `components/lab/lab.css` или co-located CSS module |
| Текст клона | `components/legacy/markups/*.ts` (осторожно + mirror) |
| Ассеты клона | `public/app/themes/portfolio-2018/...` |

## Чего не делать

- Не править `public/.../main.js` / `dog.js` как основной способ.
- Не вешать Tailwind preflight / `next/font` на `(legacy)/layout`.
- Не `import` `main.css` через bundler.
- Не `npm run mirror` сразу после ручных правок markups (перезапишет).

## Mirror

```bash
npm run mirror                              # live → assets + markups
npm run mirror:assets                       # только ассеты, markups не трогать
npm run mirror -- --pages=home,studio       # выборочные страницы
npm run mirror -- --pages=careers --assets-only
npm run mirror:help
```

Перед полным `mirror`: commit/stash markups, если правил руками.

## Study extract

```bash
npm run study:extract
```

Нужно после обновления CSS map / JS на диске.
