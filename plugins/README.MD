
# ClipperQA Transformer ✂️

**ClipperQA Transformer** — это универсальный Babel-плагин для автоматической разметки React-компонентов. Он предназначен для бесшовной интеграции UI-тестирования с ИИ-разработкой.

## 🚀 Как это работает

Трансформер автоматически внедряет метаданные в DOM-дерево во время сборки проекта. Это позволяет вашему QA-виджету мгновенно определять, какой файл и компонент нужно править, не загрязняя при этом исходный код проекта.

* **Чистота кода:** В вашем репозитории нет лишних `data-` атрибутов.
* **Автоматизация:** Пути к файлам и имена компонентов вычисляются компилятором.
* **Безопасность:** Метаданные добавляются только в режиме разработки (`development`).

---

## 📦 Установка

1. Создайте папку `plugins` в корне вашего проекта.
2. Сохраните файл [babel-plugin-clipper-log.js](./plugins/babel-plugin-clipper-log.js) в эту папку.
3. Установите необходимые зависимости:

```bash
npm install --save-dev @babel/core path
```

## ⚙️ Настройка

Трансформер универсален и работает как с Next.js, так и с Vite.

### 1. Подключение в Next.js
Создайте файл `.babelrc` в корне вашего проекта:

```json
{
  "presets": ["next/babel"],
  "plugins": ["./plugins/babel-plugin-clipper-log.js"]
}
```

### 2. Подключение в Vite
Отредактируйте ваш `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import clipperPlugin from './plugins/babel-plugin-clipper-log';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [clipperPlugin],
      },
    }),
  ],
});
```

---

## 🔍 Результат трансформации

**Ваш исходный код в VSCode:**
```tsx
// src/components/Card.tsx
export const Card = ({ children }) => {
  return <div className="p-4 shadow">{children}</div>;
};
```

**То, что видит ClipperQA в браузере (Dev Mode):**
```html
<div 
  class="p-4 shadow" 
  data-qa-component="Card" 
  data-qa-file="src/components/Card.tsx"
>
  ...
</div>
```

---

## 🛠 Интеграция с AI Workflow

Данный трансформер является ключевым звеном в цепочке:
1. **QA Widget:** Считывает `data-qa-file` при клике.
2. **GitLab Issue:** Формирует баг-репорт с точным указанием файла.
3. **AI Agent (Replit/Cursor):** Получает контекст и вносит правки в Tailwind-классы именно там, где это нужно.

---

## 🛡 Безопасность

Плагин автоматически проверяет переменную окружения:
`if (process.env.NODE_ENV !== 'development') return;`
Это гарантирует, что техническая информация о структуре вашего проекта не попадет в Production.

```
