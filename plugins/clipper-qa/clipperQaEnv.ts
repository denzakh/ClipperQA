/**
 * Универсальное чтение публичных переменных: Next (`NEXT_PUBLIC_CLIPPER_QA_*`)
 * или Vite (`import.meta.env.VITE_CLIPPER_QA_*`).
 *
 * Для каждого ключа явно перечислены оба источника — так Next может инлайнить
 * `process.env.NEXT_PUBLIC_*` на этапе сборки.
 */

type ImportMetaEnvLike = Record<string, string | boolean | undefined>

function getViteEnv(): ImportMetaEnvLike | undefined {
  if (typeof import.meta === 'undefined') return undefined
  const meta = import.meta as unknown as { env?: ImportMetaEnvLike }
  return meta.env
}

function viteString(key: string): string | undefined {
  const v = getViteEnv()?.[key]
  return typeof v === 'string' ? v : undefined
}

function trimOrEmpty(s: string | undefined): string {
  return (s ?? '').trim()
}

function firstNonEmpty(...candidates: (string | undefined)[]): string | undefined {
  for (const c of candidates) {
    const t = trimOrEmpty(c)
    if (t.length) return t
  }
  return undefined
}

/** Включён ли слой ClipperQA (Babel + виджет в типичной интеграции). */
export function clipperQaIsEnabled(): boolean {
  const next = trimOrEmpty(process.env.NEXT_PUBLIC_CLIPPER_QA_ENABLED).toLowerCase()
  const vite = trimOrEmpty(viteString('VITE_CLIPPER_QA_ENABLED')).toLowerCase()
  return next === 'true' || vite === 'true'
}

/** Сырое значение режима кнопок (`default`, `copyInfo`, …). */
export function clipperQaActionModeRaw(): string {
  return firstNonEmpty(
    process.env.NEXT_PUBLIC_CLIPPER_QA_ACTION_MODE,
    viteString('VITE_CLIPPER_QA_ACTION_MODE'),
  ) ?? ''
}

export function clipperQaStandUrlEnv(): string | undefined {
  return firstNonEmpty(
    process.env.NEXT_PUBLIC_CLIPPER_QA_STAND_URL,
    viteString('VITE_CLIPPER_QA_STAND_URL'),
  )
}

export function clipperQaAppNameEnv(): string | undefined {
  return firstNonEmpty(
    process.env.NEXT_PUBLIC_CLIPPER_QA_APP_NAME,
    viteString('VITE_CLIPPER_QA_APP_NAME'),
  )
}

export function clipperQaAppVersionEnv(): string | undefined {
  return firstNonEmpty(
    process.env.NEXT_PUBLIC_CLIPPER_QA_APP_VERSION,
    viteString('VITE_CLIPPER_QA_APP_VERSION'),
  )
}

export function clipperQaGitBranchEnv(): string | undefined {
  return firstNonEmpty(
    process.env.NEXT_PUBLIC_CLIPPER_QA_GIT_BRANCH,
    viteString('VITE_CLIPPER_QA_GIT_BRANCH'),
  )
}
