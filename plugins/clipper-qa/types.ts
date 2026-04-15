export interface ClippedBug {
  id: string
  file: string
  component: string
  classes: string
  description: string
  breakpoint: 'Mobile' | 'Desktop'
}

/** Режим нижних кнопок; значения можно расширять. */
export type ClipperQaActionMode = 'default' | 'copyinfo'
