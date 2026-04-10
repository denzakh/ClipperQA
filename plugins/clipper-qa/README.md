# ClipperQA (`plugins/clipper-qa`)

Набор для dev-only: Babel-трансформер помечает JSX и при необходимости вставляет виджет; сам виджет — React-компонент.

## Состав папки

| Файл | Назначение |
|------|------------|
| **`index.js`** | Точка входа для конфигурации Babel: только `module.exports` реализации. Подключайте в `.babelrc` / Vite именно его — путь стабильный и короткий. |
| **`babel-plugin-clipper-qa.js`** | Реализация плагина: в `development` добавляет `data-qa-component` / `data-qa-file` на JSX (кроме `ClipperQA.tsx` в этой папке); для entry-файлов (`src/app/layout.tsx`, `app/layout.tsx`, `src/App.tsx`) при отсутствии уже импортированного/используемого `<ClipperQA>` вставляет импорт и виджет в конец `<body>` или корня. |
| **`ClipperQA.tsx`** | Клиентский виджет (`"use client"`): панель QA, инспектор, LocalStorage и т.д. |
| **`README.MD`** | Эта документация. |

## Поведение плагина

- **Чистота репозитория:** в исходниках нет лишних `data-qa-*`; они появляются только в dev-сборке.
- **Production:** при `NODE_ENV !== "development"` плагин ничего не меняет.
- **Уже есть `<ClipperQA />` в layout** (например через `@/components/clipper-qa/ClipperQA`): повторная инъекция не выполняется — проверяется наличие JSX с именем `ClipperQA`.

## Next.js — `.babelrc` в корне проекта

```json
{
  "presets": ["next/babel"],
  "plugins": ["./plugins/clipper-qa/index.js"]
}
```

Альтернатива — ссылаться напрямую на файл реализации: `"./plugins/clipper-qa/babel-plugin-clipper-qa.js"` (эквивалентно `index.js`).

### Next.js 16 + `next dev` (Turbopack)

По умолчанию Turbopack может не применять `.babelrc` так же, как Webpack. Для предсказуемой работы плагина используйте `next dev --webpack` или явно подключите `<ClipperQA />` в `layout.tsx` (как в этом репозитории).

## Vite — `vite.config.ts`

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [path.resolve(__dirname, "plugins/clipper-qa/index.js")],
      },
    }),
  ],
});
```

Используйте `path.resolve`, чтобы путь одинаково резолвился на Windows и Unix.

## Зависимости для отдельной проверки Babel

```bash
npm install --save-dev @babel/core
```

(`path` — встроенный модуль Node.)

## Результат трансформации (фрагмент DOM в dev)

```html
<div
  class="p-4 shadow"
  data-qa-component="Card"
  data-qa-file="src/components/Card.tsx"
>
  …
</div>
```

## Интеграция приложения

Импорт виджета в приложении обычно идёт через обёртку в `src/components/clipper-qa/ClipperQA.tsx`, реэкспортирующую `plugins/clipper-qa/ClipperQA.tsx` — так проще держать алиасы Next.js и единое место подключения в `layout.tsx`.
