export type BreakpointMin = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
export type BreakpointMax = 'max-sm' | 'max-md' | 'max-lg' | 'max-xl' | 'max-2xl' | 'max-3xl'
export type Breakpoint = BreakpointMin | BreakpointMax

export const breakpoints = {
  sm: { min: 640, max: 767 },
  md: { min: 768, max: 1023 },
  lg: { min: 1024, max: 1279 },
  xl: { min: 1280, max: 1535 },
  '2xl': { min: 1536, max: 1919 },
  '3xl': { min: 1920, max: Infinity },
}

export const query: Record<Breakpoint, string> = {
  sm: `(min-width: ${breakpoints.sm.min}px)`,
  md: `(min-width: ${breakpoints.md.min}px)`,
  lg: `(min-width: ${breakpoints.lg.min}px)`,
  xl: `(min-width: ${breakpoints.xl.min}px)`,
  '2xl': `(min-width: ${breakpoints['2xl'].min}px)`,
  '3xl': `(min-width: ${breakpoints['3xl'].min}px)`,
  'max-sm': `(max-width: ${breakpoints.sm.max}px)`,
  'max-md': `(max-width: ${breakpoints.md.max}px)`,
  'max-lg': `(max-width: ${breakpoints.lg.max}px)`,
  'max-xl': `(max-width: ${breakpoints.xl.max}px)`,
  'max-2xl': `(max-width: ${breakpoints['2xl'].max}px)`,
  'max-3xl': `(max-width: ${breakpoints['3xl'].max}px)`,
}

export const getCurrBreakpoint = (max?: boolean): Breakpoint | 'base' => {
  const breakpointEntries = Object.entries(breakpoints).reverse()
  for (const [breakpoint, { min: minValue, max: maxValue }] of breakpointEntries)
    if (max) {
      if (window.innerWidth <= maxValue) return `max-${breakpoint}` as BreakpointMax
    } else if (window.innerWidth >= minValue) return breakpoint as BreakpointMin

  return 'sm'
}
