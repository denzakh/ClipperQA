# ClipperQA (`plugins/clipper-qa`)

Набор для QA: Babel-трансформер помечает JSX и при необходимости вставляет виджет; сам виджет — React-компонент. Включается флагом **`NEXT_PUBLIC_CLIPPER_QA_ENABLED=true`** или **`VITE_CLIPPER_QA_ENABLED=true`** (логика **не** завязана на `NODE_ENV`). Рантайм читает оба варианта через **[`clipperQaEnv.ts`](clipperQaEnv.ts)**.

## Состав папки

| Файл                             | Назначение                                                                                                                                                                                                                                                                                                            |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`index.js`**                   | Точка входа для Babel: реэкспорт `babel-plugin-clipper-qa.js`. Подключайте в `.babelrc` / Vite именно его.                                                                                                                                                                                                            |
| **`babel-plugin-clipper-qa.js`** | Плагин: при `NEXT_PUBLIC_CLIPPER_QA_ENABLED=true` **или** `VITE_CLIPPER_QA_ENABLED=true` добавляет `data-qa-component` / `data-qa-file` на JSX (кроме `ClipperQA.tsx` в этой папке); для entry при отсутствии импорта/JSX `ClipperQA` вставляет импорт и `<ClipperQA />` в конец `<body>` или корня.                 |
| **`ClipperQA.tsx`**              | Клиентский виджет (`"use client"`): клипы, инспектор, LocalStorage; режим кнопок через `clipperQaActionModeRaw()` / `clipperQaEnv.ts`.                                                                                                                                                                                 |
| **`types.ts`**                   | Общие типы: `ClippedBug`, `ClipperQaActionMode`.                                                                                                                                                                                                                                                                      |
| **`formatBugsForJira.ts`**       | Экспорт в текст: `formatBugsForJira`, `buildClipperExportMeta`, тип `JiraExportMeta` (Markdown для вставки в описание задачи в Jira).                                                                                                                                                                                 |
| **`clipperQaEnv.ts`**            | Универсальный резолвер: для каждой настройки сначала `NEXT_PUBLIC_CLIPPER_QA_*`, иначе `import.meta.env.VITE_CLIPPER_QA_*` (Vite).                                                                                                                                                                                      |
| **`README.md`**                  | Эта документация.                                                                                                                                                                                                                                                                                                     |

## Поведение плагина

- **Чистота репозитория:** в исходниках нет лишних `data-qa-*`; они появляются только в сборке/деве, когда флаг включён.
- **Выключено:** если ни `NEXT_PUBLIC_CLIPPER_QA_ENABLED`, ни `VITE_CLIPPER_QA_ENABLED` не равны строке `"true"`, плагин **ничего** не меняет (ни атрибутов, ни автоподключения виджета).
- **Повторная инъекция:** если в entry уже есть импорт или JSX с именем `ClipperQA`, плагин виджет не дублирует.

В приложении виджет нужно рендерить **только при том же флаге**, что и для Babel (в этом репозитории: `clipperQaIsEnabled()` из `clipperQaEnv.ts`), иначе в проде останется мёртвый импорт без `data-qa-*`.

## Переменные окружения

Пары **Next** / **Vite**: в коде и в `buildClipperExportMeta` используется приоритет `NEXT_PUBLIC_*`, затем `VITE_*` (см. `clipperQaEnv.ts`). Для Babel в Node доступен только `process.env`, поэтому для трансформации задайте **`NEXT_PUBLIC_`** или **`VITE_`** в окружении процесса перед `vite build` / `next build`.

| Next (приоритет) | Vite (`import.meta.env`) | Назначение |
| ---------------- | ------------------------ | ---------- |
| `NEXT_PUBLIC_CLIPPER_QA_ENABLED` | `VITE_CLIPPER_QA_ENABLED` | **`"true"`** — Babel + виджет. |
| `NEXT_PUBLIC_CLIPPER_QA_ACTION_MODE` | `VITE_CLIPPER_QA_ACTION_MODE` | `default` или **`copyInfo`** (регистр не важен): режим нижних кнопок. |
| `NEXT_PUBLIC_CLIPPER_QA_STAND_URL` | `VITE_CLIPPER_QA_STAND_URL` | URL стенда в экспорте; иначе `window.location.origin`. |
| `NEXT_PUBLIC_CLIPPER_QA_APP_NAME` | `VITE_CLIPPER_QA_APP_NAME` | Имя приложения в экспорте. |
| `NEXT_PUBLIC_CLIPPER_QA_APP_VERSION` | `VITE_CLIPPER_QA_APP_VERSION` | Версия в экспорте. |
| `NEXT_PUBLIC_CLIPPER_QA_GIT_BRANCH` | `VITE_CLIPPER_QA_GIT_BRANCH` | Ветка в экспорте. |
| `NEXT_PUBLIC_CLIPPER_QA_SEND_TO_AI_URL` | `VITE_CLIPPER_QA_SEND_TO_AI_URL` | Режим **`default`**: POST с телом `{ bugs, context }` (см. ниже). |
| `NEXT_PUBLIC_CLIPPER_QA_WELL_DONE_URL` | `VITE_CLIPPER_QA_WELL_DONE_URL` | Режим **`default`**: POST с телом `{ done: true, context }`. |

В корневом **`next.config.ts`** для Next при сборке в `env` подставляются имя/версия из `package.json` и ветка (git / CI), если не заданы ни `NEXT_PUBLIC_*`, ни `VITE_*` для этих полей.

### API в режиме `default` (SEND TO AI / WELL DONE)

Запросы из браузера: **`fetch`**, `Content-Type: application/json`, успех по **`response.ok`** (2xx). Если URL не задан, виджет показывает подсказку и не вызывает сеть.

**CORS:** при другом origin у API нужны корректные заголовки (`Access-Control-Allow-Origin` и т.д.), иначе браузер заблокирует ответ.

**POST** `SEND_TO_AI_URL` — тело:

```json
{
  "bugs": [
    {
      "id": "string",
      "file": "string",
      "component": "string",
      "classes": "string",
      "description": "string",
      "breakpoint": "Mobile | Desktop"
    }
  ],
  "context": {
    "standUrl": "string",
    "appName": "string",
    "appVersion": "string",
    "gitBranch": "string"
  }
}
```

Поле `context` совпадает с результатом `buildClipperExportMeta()` (те же поля, что в Markdown для Jira). После успеха список багов в виджете очищается.

**POST** `WELL_DONE_URL` — тело:

```json
{
  "done": true,
  "context": {
    "standUrl": "string",
    "appName": "string",
    "appVersion": "string",
    "gitBranch": "string"
  }
}
```

Пример `.env.local`:

```bash
NEXT_PUBLIC_CLIPPER_QA_ENABLED=true
NEXT_PUBLIC_CLIPPER_QA_ACTION_MODE=default
# NEXT_PUBLIC_CLIPPER_QA_ACTION_MODE=copyinfo
# NEXT_PUBLIC_CLIPPER_QA_STAND_URL=https://staging.example.com
# NEXT_PUBLIC_CLIPPER_QA_GIT_BRANCH=feature/qa-widget
# NEXT_PUBLIC_CLIPPER_QA_SEND_TO_AI_URL=https://api.example.com/clipper/ai
# NEXT_PUBLIC_CLIPPER_QA_WELL_DONE_URL=https://api.example.com/clipper/done
```

Для **dev/build** флаг включения должен быть в **`process.env`** на момент запуска Babel (`next dev` / `next build` или `vite build`), иначе атрибуты не появятся. В Vite для клиента удобнее `.env` с префиксом **`VITE_`**; тогда для Babel в том же процессе задайте `VITE_CLIPPER_QA_ENABLED=true` или продублируйте `NEXT_PUBLIC_*`.

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

Передавайте в окружение процесса **`NEXT_PUBLIC_CLIPPER_QA_ENABLED=true`** или **`VITE_CLIPPER_QA_ENABLED=true`**, чтобы Babel увидел флаг. Клиентский резолвер подхватит оба варианта. Путь к плагину — через `path.resolve`, чтобы одинаково работало на Windows и Unix.

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
- В **корневом layout** условный рендер через **`clipperQaIsEnabled()`**, совпадающий с Babel.
- Для имени, версии и ветки в экспорте при Next — см. **`next.config.ts`** в корне репозитория (`env` + чтение `package.json` / git / CI).
