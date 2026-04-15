# ClipperQA (`plugins/clipper-qa`)

Набор для QA: Babel-трансформер помечает JSX и при необходимости вставляет виджет; сам виджет — React-компонент. Всё включается одной переменной **`NEXT_PUBLIC_CLIPPER_QA_ENABLED=true`** (логика **не** завязана на `NODE_ENV`).

## Состав папки

| Файл                             | Назначение                                                                                                                                                                                                                                                                                                            |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`index.js`**                   | Точка входа для Babel: реэкспорт `babel-plugin-clipper-qa.js`. Подключайте в `.babelrc` / Vite именно его.                                                                                                                                                                                                            |
| **`babel-plugin-clipper-qa.js`** | Плагин: при `NEXT_PUBLIC_CLIPPER_QA_ENABLED=true` добавляет `data-qa-component` / `data-qa-file` на JSX (кроме `ClipperQA.tsx` в этой папке); для entry (`src/app/layout.tsx`, `app/layout.tsx`, `src/App.tsx`) при отсутствии импорта/JSX `ClipperQA` вставляет импорт и `<ClipperQA />` в конец `<body>` или корня. |
| **`ClipperQA.tsx`**              | Клиентский виджет (`"use client"`): клипы, инспектор, LocalStorage, нижние кнопки в зависимости от `NEXT_PUBLIC_CLIPPER_QA_ACTION_MODE`.                                                                                                                                                                              |
| **`types.ts`**                   | Общие типы: `ClippedBug`, `ClipperQaActionMode`.                                                                                                                                                                                                                                                                      |
| **`formatBugsForJira.ts`**       | Экспорт в текст: `formatBugsForJira`, `buildClipperExportMeta`, тип `JiraExportMeta` (Markdown для вставки в описание задачи в Jira).                                                                                                                                                                                 |
| **`README.md`**                  | Эта документация.                                                                                                                                                                                                                                                                                                     |

## Поведение плагина

- **Чистота репозитория:** в исходниках нет лишних `data-qa-*`; они появляются только в сборке/деве, когда флаг включён.
- **Выключено:** если `NEXT_PUBLIC_CLIPPER_QA_ENABLED` не равен строке `"true"`, плагин **ничего** не меняет (ни атрибутов, ни автоподключения виджета).
- **Повторная инъекция:** если в entry уже есть импорт или JSX с именем `ClipperQA`, плагин виджет не дублирует.

В приложении виджет нужно рендерить **только при том же флаге**, что и для Babel (например в `app/layout.tsx`: `{process.env.NEXT_PUBLIC_CLIPPER_QA_ENABLED === "true" ? <ClipperQA /> : null}`), иначе в проде останется мёртвый импорт без `data-qa-*`.

## Переменные окружения

| Переменная                                                              | Назначение                                                                                                                                                                                                                                                                                               |
| ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_CLIPPER_QA_ENABLED`                                        | **`"true"`** — Babel добавляет `data-qa-*`; в layout должен рендериться `<ClipperQA />`. Любое другое значение — QA-слой выключен.                                                                                                                                                                       |
| `NEXT_PUBLIC_CLIPPER_QA_ACTION_MODE`                                    | Режим нижней панели: не задано или `default` — при пустом списке **WELL DONE**, при клипах **SEND TO AI** (сейчас лог в консоль). **`copyinfo`** — при пустом списке кнопки нет; при клипах одна кнопка **«Скопировать»** (текст для Jira в буфер). Регистр значения не важен (`copyinfo` / `copyinfo`). |
| `NEXT_PUBLIC_CLIPPER_QA_STAND_URL`                                      | Явный URL тестового стенда в шапке экспорта; если пусто, при копировании подставляется `window.location.origin`.                                                                                                                                                                                         |
| `NEXT_PUBLIC_CLIPPER_QA_APP_NAME`, `NEXT_PUBLIC_CLIPPER_QA_APP_VERSION` | Имя и версия приложения в экспорте. В Next в корневом **`next.config.ts`** они подставляются из **`package.json`**, если не заданы в `.env`.                                                                                                                                                             |
| `NEXT_PUBLIC_CLIPPER_QA_GIT_BRANCH`                                     | Ветка в экспорте. В `next.config.ts`: если переменная не задана, используются `VERCEL_GIT_COMMIT_REF`, `GITHUB_HEAD_REF` или результат `git rev-parse --abbrev-ref HEAD` (без падения, если git недоступен).                                                                                             |

Пример `.env.local`:

```bash
NEXT_PUBLIC_CLIPPER_QA_ENABLED=true
NEXT_PUBLIC_CLIPPER_QA_ACTION_MODE=default
# NEXT_PUBLIC_CLIPPER_QA_ACTION_MODE=copyinfo
# NEXT_PUBLIC_CLIPPER_QA_STAND_URL=https://staging.example.com
# NEXT_PUBLIC_CLIPPER_QA_GIT_BRANCH=feature/qa-widget
```

Для **dev/build** переменные должны быть заданы в окружении процесса (`next dev` / `next build`), иначе Babel не увидит флаг — атрибуты не появятся.

## Экспорт в Jira (режим `copyinfo`)

Модуль **`formatBugsForJira.ts`** собирает **Markdown**: блок «Контекст» (стенд, package, ветка) и нумерованные секции по багам (компонент, файл, breakpoint, классы в code-block, описание). Подходит для вставки в описание задачи в Jira с поддержкой Markdown.

## Next.js — `.babelrc` в корне проекта

```json
{
  "presets": ["next/babel"],
  "plugins": ["./plugins/clipper-qa/index.js"]
}
```

Альтернатива — путь напрямую к реализации: `"./plugins/clipper-qa/babel-plugin-clipper-qa.js"` (эквивалентно `index.js`).

### Next.js 16 + `next dev` (Turbopack)

По умолчанию Turbopack может вести себя иначе, чем Webpack, относительно `.babelrc`. Для предсказуемой работы плагина используйте `next dev --webpack` или явно держите `<ClipperQA />` в `layout.tsx` (как в этом репозитории) и задавайте `NEXT_PUBLIC_CLIPPER_QA_ENABLED=true` при сборке.

## Vite — `vite.config.ts`

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [path.resolve(__dirname, 'plugins/clipper-qa/index.js')],
      },
    }),
  ],
})
```

Передавайте в окружение тот же `NEXT_PUBLIC_CLIPPER_QA_ENABLED=true`, что ожидает плагин. Путь — через `path.resolve`, чтобы одинаково работало на Windows и Unix.

## Зависимости для отдельной проверки Babel

```bash
npm install --save-dev @babel/core
```

(`path` — встроенный модуль Node.)

## Результат трансформации (фрагмент DOM при включённом ClipperQA)

```html
<div class="p-4 shadow" data-qa-component="Card" data-qa-file="src/components/Card.tsx">…</div>
```

## Интеграция в приложение

- Импорт из `plugins/clipper-qa/ClipperQA` (или обёртка в `src/components/clipper-qa/ClipperQA.tsx` с реэкспортом — удобно для алиасов `@/`).
- В **корневом layout** условный рендер по `NEXT_PUBLIC_CLIPPER_QA_ENABLED`, совпадающий с Babel.
- Для имени, версии и ветки в экспорте при Next — см. **`next.config.ts`** в корне репозитория (`env` + чтение `package.json` / git / CI).
