import { DependencyList, EffectCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useLoaderData } from 'react-router'
import { transitionEvents } from './core'

export type SerializeFrom<T> = ReturnType<typeof useLoaderData<T>>

export function usePreservedLoaderData<T>(): SerializeFrom<T> {
  const loaderData = useLoaderData<T>()
  const loaderDataRef = useRef<SerializeFrom<T>>(loaderData)

  useIsomorphicLayoutEffect(() => {
    loaderDataRef.current = loaderData
  }, [])

  // eslint-disable-next-line react-compiler/react-compiler
  return loaderDataRef.current
}

function useIsomorphicLayoutEffect(effect: EffectCallback, deps?: DependencyList) {
  return useLayoutEffect(effect, deps)
}

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
