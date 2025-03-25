import { Schedule, type Runnable as DirectedRunnable, type SingleOptionsObject } from 'directed'
import { useLayoutEffect } from 'react'

export type TransitionContext = {
  node: HTMLElement
  from: string | undefined
  to: string
}

export type TransitionScheduler = {
  enterSchedule: Schedule<TransitionContext>
  exitSchedule: Schedule<TransitionContext>
  hasScheduledEnter: () => boolean
  hasScheduledExit: () => boolean
  enter: (context: TransitionContext) => Promise<void>
  exit: (context: TransitionContext) => Promise<void>
}

export type TransitionSchedulerOptions = Omit<SingleOptionsObject<TransitionContext>, 'tag'> & {
  tag?: string
}

export type Runnable<T extends object> =
  | DirectedRunnable<T>
  | (DirectedRunnable<T> & {
      tag: string
    })

export type TransitionRunnable = (node: HTMLElement, from: string | undefined, to: string) => void | Promise<void>

export const createTransitionScheduler = (): TransitionScheduler => {
  const enterSchedule = new Schedule<TransitionContext>()
  const exitSchedule = new Schedule<TransitionContext>()

  return {
    enterSchedule,
    exitSchedule,
    hasScheduledEnter: () => {
      enterSchedule.build()
      return enterSchedule.dag.sorted.length > 0
    },
    hasScheduledExit: () => {
      exitSchedule.build()
      return exitSchedule.dag.sorted.length > 0
    },
    enter: (context: TransitionContext) => run(enterSchedule, context),
    exit: (context: TransitionContext) => run(exitSchedule, context),
  }
}

const _flush = (scheduler: Schedule<TransitionContext>) => {
  scheduler.dag.sorted.forEach((node) => {
    scheduler.remove(node)
  })
}

const _run = async (schedule: Schedule<TransitionContext>, context: TransitionContext) => {
  const sorted = schedule.dag.sorted as Runnable<TransitionContext>[] /* Overwrite type */

  const grouped: (Runnable<TransitionContext> | Runnable<TransitionContext>[])[] = []
  const groupIdxMap: Record<string, number> = {}

  for (let i = 0; i < sorted.length; i++) {
    const runnable = sorted[i]

    if ('tag' in runnable) {
      const tag = runnable.tag

      if (groupIdxMap[tag] === undefined) {
        grouped.push([runnable])
        groupIdxMap[tag] = grouped.length - 1
      } else {
        const group = grouped[groupIdxMap[tag]]

        if (Array.isArray(group)) {
          group.push(runnable)
        }
      }
    } else {
      grouped.push(runnable)
    }
  }

  for (let i = 0; i < grouped.length; i++) {
    const runnable = grouped[i]

    if (Array.isArray(runnable)) {
      const promises: Promise<void>[] = []

      for (let j = 0; j < runnable.length; j++) {
        const result = runnable[j](context)

        if (result instanceof Promise) {
          promises.push(result)
        }
      }

      await Promise.all(promises)
    } else {
      const result = runnable(context)

      if (result instanceof Promise) {
        await result
      }
    }
  }
}

const run = (scheduler: Schedule<TransitionContext>, context: TransitionContext) => {
  scheduler.build()

  return _run(scheduler, context).then(() => _flush(scheduler))
}

const addTagIfNotExists = (scheduler: Schedule<TransitionContext>, tag: string) => {
  if (scheduler.hasTag(tag)) {
    return
  }

  scheduler.createTag(tag)
}

export const useEntrance = (
  scheduler: TransitionScheduler,
  fn: TransitionRunnable,
  options?: TransitionSchedulerOptions
) => {
  useLayoutEffect(() => {
    const runnable = (context: TransitionContext) => fn(context.node, context.from, context.to)

    if (options?.tag) {
      addTagIfNotExists(scheduler.enterSchedule, options.tag)
      runnable.tag = options.tag
    }

    scheduler.enterSchedule.add(runnable, options)

    return () => {
      scheduler.enterSchedule.remove(runnable)
    }
  }, [scheduler, options])
}

export const useExit = (
  scheduler: TransitionScheduler,
  fn: TransitionRunnable,
  options?: TransitionSchedulerOptions
) => {
  useLayoutEffect(() => {
    const runnable = (context: TransitionContext) => fn(context.node, context.from, context.to)

    if (options?.tag) {
      addTagIfNotExists(scheduler.exitSchedule, options.tag)
      runnable.tag = options.tag
    }

    scheduler.exitSchedule.add(runnable, options)

    return () => {
      scheduler.exitSchedule.remove(runnable)
    }
  }, [scheduler, options])
}
