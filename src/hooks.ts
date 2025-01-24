import { DependencyList, EffectCallback, useLayoutEffect, useRef } from 'react'
import { useLoaderData } from 'react-router'

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
