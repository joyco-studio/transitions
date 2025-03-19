import { DependencyList, EffectCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useLoaderData, useRouteLoaderData } from 'react-router'
import { transitionEvents } from './core'

export type SerializeFrom<T> = ReturnType<typeof useLoaderData<T>>

/**
 * Returns a frozen version of the loader data to prevent data change while the transition is happening
 */
export function usePreservedLoaderData<T>(): SerializeFrom<T> {
  const loaderData = useLoaderData<T>()
  const loaderDataRef = useRef<SerializeFrom<T>>(loaderData)

  useIsomorphicLayoutEffect(() => {
    loaderDataRef.current = loaderData
  }, [])

  // eslint-disable-next-line react-compiler/react-compiler
  return loaderDataRef.current
}

export function usePreservedRouteLoaderData<T>(routeId: string): SerializeFrom<T> | undefined {
  const routeLoaderData = useRouteLoaderData<T>(routeId)
  const routeLoaderDataRef = useRef<SerializeFrom<T> | undefined>(routeLoaderData)

  useIsomorphicLayoutEffect(() => {
    routeLoaderDataRef.current = routeLoaderData
  }, [])

  // eslint-disable-next-line react-compiler/react-compiler
  return routeLoaderDataRef.current
}

function useIsomorphicLayoutEffect(effect: EffectCallback, deps?: DependencyList) {
  return useLayoutEffect(effect, deps)
}

/**
 * Returns the current transition state.
 * These are `entering`, `exiting`, and `idle`.
 */
export const useTransitionState = () => {
  const [state, setState] = useState<'entering' | 'exiting' | 'idle'>('idle')

  useEffect(() => {
    const onEnter = () => setState('entering')
    const onExit = () => setState('exiting')
    const onIdle = () => setState('idle')

    transitionEvents.on('entering', onEnter)
    transitionEvents.on('exiting', onExit)
    transitionEvents.on('entered', onIdle)

    return () => {
      transitionEvents.off('entering', onEnter)
      transitionEvents.off('exiting', onExit)
      transitionEvents.off('entered', onIdle)
    }
  }, [])

  return { state, isEntering: state === 'entering', isExiting: state === 'exiting', isIdle: state === 'idle' }
}
