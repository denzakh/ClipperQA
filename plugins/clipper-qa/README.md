# ClipperQA (Babel + widget)

Self-contained dev-only tooling: a Babel plugin injects `data-qa-*` attributes and mounts `<ClipperQA />` at the app entry. The React widget lives in `ClipperQA.tsx` next to the plugin.

## Files

| Path | Role |
|------|------|
| `plugins/clipper-qa/index.js` | Babel plugin (attributes + entry injection) |
| `plugins/clipper-qa/ClipperQA.tsx` | Floating QA widget (`"use client"`) |

## Next.js — `.babelrc`

```json
{
  "presets": ["next/babel"],
  "plugins": ["./plugins/clipper-qa/index.js"]
}
```

The plugin runs only when `process.env.NODE_ENV === "development"`. Production `next build` does not add imports, JSX, or `data-qa-*` attributes.

Injection uses `Program.enter` so it runs **before** `next/babel` rewrites `export default` in the same traversal (root `plugins` run before preset-expanded plugins).

### Next.js 16 + `next dev` (Turbopack)

По умолчанию `next dev` использует **Turbopack**, который **не применяет** ваш `.babelrc` так же, как классический Webpack. В итоге атрибуты из плагина могут вести себя непредсказуемо, а **инъекция `<ClipperQA />` в `layout.tsx` часто не выполняется**.

**Решение:** запускать dev-сервер с Webpack:

```json
"scripts": {
  "dev": "next dev --webpack"
}
```

Альтернатива: явно подключить `<ClipperQA />` в `layout.tsx` (только для разработки, если не хотите `--webpack`).

## Vite — `vite.config.ts` (example)

Install: `npm i -D vite @vitejs/plugin-react`

```ts
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

Use `path.resolve` so the plugin resolves the same way on Windows and Unix. For a Vite app whose entry is `src/App.tsx`, the plugin injects there automatically.

## Entry files recognized

- `src/app/layout.tsx` / `.jsx` (Next.js App Router)
- `app/layout.tsx` / `.jsx` (without `src/`)
- `src/App.tsx` / `.jsx` (typical Vite/CRA-style root)

Injection adds:

1. `import { ClipperQA } from '<relative>/plugins/clipper-qa/ClipperQA'` (extension omitted; path is relative to the entry file).
2. `<ClipperQA />` as the last child inside `<body>` when the root JSX is `<html>…</html>`, otherwise as the last child of the returned root element or fragment.

If you already import or render `ClipperQA`, the plugin skips injection.

## How to verify (auto widget, no manual import)

1. Remove any manual `import { ClipperQA }` and `<ClipperQA />` from `layout.tsx` / `App.tsx`.
2. Run `npm run dev` and open the app: the widget should appear (bottom-right).
3. Inspect DOM: elements should include `data-qa-file` and `data-qa-component` in development.
4. Run `npm run build && npm start` (production): the widget and `data-qa-*` attributes must **not** appear in compiled output for app components.

Optional quick Babel check from the repo root (Next may lower `import` to `require`; look for the path or `_jsx` usage):

```bash
NODE_ENV=development node -e "const p=require('path');const b=require('@babel/core');const r=b.transformFileSync('src/app/layout.tsx',{configFile:'.babelrc',filename:p.resolve('src/app/layout.tsx')});console.log('clipper module',/clipper-qa\\/ClipperQA/.test(r.code));console.log('jsx',/_jsx\\([^,]+\\.ClipperQA/.test(r.code)||r.code.includes('<ClipperQA'));"
```

(Use Git Bash or WSL on Windows for `NODE_ENV=development` one-liner, or set the variable in PowerShell first.)
