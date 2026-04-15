import type { ClippedBug } from './types'

/** Метаданные для префикса экспорта (стенд, сборка, ветка). */
export interface JiraExportMeta {
  standUrl: string
  appName: string
  appVersion: string
  gitBranch: string
}

function displayOrDash(v: string | undefined): string {
  const t = (v ?? '').trim()
  return t.length ? t : '—'
}

/**
 * Собирает meta из `process.env` и при необходимости `window` (URL стенда).
 * Вызывайте в браузере (например по клику «Скопировать»), чтобы `origin` был корректен.
 */
export function buildClipperExportMeta(): JiraExportMeta {
  const standEnv = (process.env.NEXT_PUBLIC_CLIPPER_QA_STAND_URL ?? '').trim()
  let standUrl = standEnv
  if (!standUrl && typeof window !== 'undefined') {
    standUrl = window.location.origin
  }

  return {
    standUrl: displayOrDash(standUrl),
    appName: displayOrDash(process.env.NEXT_PUBLIC_CLIPPER_QA_APP_NAME),
    appVersion: displayOrDash(process.env.NEXT_PUBLIC_CLIPPER_QA_APP_VERSION),
    gitBranch: displayOrDash(process.env.NEXT_PUBLIC_CLIPPER_QA_GIT_BRANCH),
  }
}

function codeBlock(label: string, body: string): string {
  const trimmed = body.trim()
  if (!trimmed) return `**${label}:** —\n`
  if (trimmed.includes('```')) {
    return `**${label}:**\n~~~text\n${trimmed}\n~~~\n`
  }
  return `**${label}:**\n\`\`\`text\n${trimmed}\n\`\`\`\n`
}

/**
 * Текст в Markdown для вставки в описание задачи Jira (новый редактор).
 */
export function formatBugsForJira(bugs: ClippedBug[], meta: JiraExportMeta): string {
  const lines: string[] = [
    '## Контекст',
    '',
    `- **Тестовый стенд:** ${meta.standUrl}`,
    `- **Проект (package):** ${meta.appName} @ ${meta.appVersion}`,
    `- **Ветка:** ${meta.gitBranch}`,
    '',
    '---',
    '',
    `## Баги (${bugs.length})`,
    '',
  ]

  bugs.forEach((b, i) => {
    const n = i + 1
    lines.push(`### ${n}. ${displayOrDash(b.component)}`)
    lines.push('')
    lines.push(`- **Файл:** \`${b.file || '—'}\``)
    lines.push(`- **Breakpoint:** ${b.breakpoint}`)
    lines.push('')
    lines.push(codeBlock('Классы DOM', b.classes))
    lines.push('')
    lines.push('**Описание:**')
    lines.push('')
    lines.push(b.description.trim() || '—')
    lines.push('')
    lines.push('---')
    lines.push('')
  })

  return lines.join('\n').trimEnd() + '\n'
}
