import { query } from './breakpoints'

import type { Breakpoint } from './breakpoints'

export type GetImageSizesArg = (Partial<Record<Breakpoint, string>> & { default?: string }) | string

export const getImageSizes = (sizes: GetImageSizesArg) => {
  if (!sizes) return ''

  if (typeof sizes === 'string') return sizes

  return Object.entries(sizes ?? {})
    .map(([breakpoint, size]) => {
      if (breakpoint === 'default') return size
      return `${query[breakpoint as Breakpoint]} ${size}`
    })
    .join(', ')
}
