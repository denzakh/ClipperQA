/**
 * Unified reading of public env vars: Next (`NEXT_PUBLIC_CLIPPER_QA_*`)
 * or Vite (`import.meta.env.VITE_CLIPPER_QA_*`).
 *
 * For each key both sources are listed explicitly so Next can inline
 * `process.env.NEXT_PUBLIC_*` at build time.
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

/** Whether the ClipperQA layer is enabled (Babel + widget in a typical setup). */
export function clipperQaIsEnabled(): boolean {
  const next = trimOrEmpty(process.env.NEXT_PUBLIC_CLIPPER_QA_ENABLED).toLowerCase()
  const vite = trimOrEmpty(viteString('VITE_CLIPPER_QA_ENABLED')).toLowerCase()
  return next === 'true' || vite === 'true'
}

/** Raw footer action mode (`default`, `copyInfo`, …). */
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

/** POST endpoint for default mode: bugs + context to AI. */
export function clipperQaSendToAiUrl(): string | undefined {
  return firstNonEmpty(
    process.env.NEXT_PUBLIC_CLIPPER_QA_SEND_TO_AI_URL,
    viteString('VITE_CLIPPER_QA_SEND_TO_AI_URL'),
  )
}

/** POST endpoint for default mode: WELL DONE command + context. */
export function clipperQaWellDoneUrl(): string | undefined {
  return firstNonEmpty(
    process.env.NEXT_PUBLIC_CLIPPER_QA_WELL_DONE_URL,
    viteString('VITE_CLIPPER_QA_WELL_DONE_URL'),
  )
}
