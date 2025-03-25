import { version } from '../../package.json'

export const VERSION = version
export * from './core'
export { defaultTransitionEvents as transitionEvents } from './events'
export * from './hooks'
export * from './scheduler'
