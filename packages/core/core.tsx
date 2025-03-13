/* eslint-disable react-compiler/react-compiler */
import { createRef, useEffect, useMemo, useRef } from 'react'
import { SwitchTransition, Transition } from 'react-transition-group'
import { TinyEmitter } from 'tiny-emitter'
import { RouteConfigEntry } from '@react-router/dev/routes'
import { matchPath } from 'react-router'
import { customAlphabet } from 'nanoid'
import { useTransitionState } from './hooks'

type RouteTransitionManagerProps = {
  children: (nodeRef: React.RefObject<HTMLElement | HTMLDivElement>) => React.ReactNode
  pathname: string
  mode?: 'out-in' | 'in-out'
  onEnter: (node: HTMLElement, from: string | undefined, to: string) => Promise<void>
  onExit: (node: HTMLElement, from: string | undefined, to: string) => Promise<void>
  onEntering?: (node: HTMLElement, from: string | undefined, to: string) => void
  onEntered?: (node: HTMLElement, from: string | undefined, to: string) => void
  onExiting?: (node: HTMLElement, from: string | undefined, to: string) => void
  onExited?: (node: HTMLElement, from: string | undefined, to: string) => void
  preventTransition?: (from: string | undefined, to: string) => boolean
  appear?: boolean
  routes: RouteConfigEntry[]
}

export const transitionEvents = new TinyEmitter()

const nodeRefWarning = (pathname: string) => {
  console.warn(`${pathname} - nodeRef is null`)
}

const getRoutesFlatMap = (routes: RouteConfigEntry[]) => {
  /* Traverse routes and their .children */
  const routeNodeRefs: { path: string; nodeRef: React.RefObject<HTMLElement | null> }[] = []

  const traverseRoutes = (_routes: RouteConfigEntry[]) => {
    for (const route of _routes) {
      routeNodeRefs.push({
        path: route.path ?? '/',
        nodeRef: createRef<HTMLElement | null>(),
      })

      if (route.children) {
        traverseRoutes(route.children)
      }
    }
  }

  traverseRoutes(routes)

  return routeNodeRefs
}

const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', 5)

export const RouteTransitionManager = ({
  routes,
  onEnter,
  onEntering,
  onEntered,
  onExit,
  onExiting,
  onExited,
  preventTransition,
  children,
  pathname,
  mode = 'out-in',
  appear = false,
}: RouteTransitionManagerProps) => {
  const callbackTimePrevPathnameRef = useRef<string>()
  const renderTimePrevPathnameRef = useRef<string>()
  const pathnameRef = useRef(pathname)
  const transitions = useRef<Record<string, Promise<void> | undefined>>({})
  const prevKeyRef = useRef<string>()
  const preventTransitionRef = useRef(preventTransition)
  const routeNodeRefs = getRoutesFlatMap(routes)

  useEffect(() => {
    return () => {
      callbackTimePrevPathnameRef.current = pathname
    }
  }, [pathname])

  const currentMatch = useMemo(() => routeNodeRefs.find((route) => matchPath(route.path, pathname)), [pathname])
  const nodeRef = currentMatch?.nodeRef ?? createRef()

  pathnameRef.current = pathname
  preventTransitionRef.current = preventTransition

  /**
   * Key changes on every pathname change. BUT 👇
   *
   * If preventTransition returns true, the key will not change. And will use the previous key. Why would you want to do this?
   * If you have nested <RouteTransitionManager />, the parent manager will prevent the child manager from preserve it's exiting child on the DOM
   * if the parent manager changes it's key. So you have to decide if you want to prevent the transition on the parent manager or not.
   */
  const key = useMemo(() => {
    let nextKey

    if (preventTransitionRef.current?.(renderTimePrevPathnameRef.current, pathname)) {
      nextKey = prevKeyRef.current
    }

    return nextKey ?? nanoid()
  }, [pathname])

  prevKeyRef.current = key
  /**
   * Why this here and in useLayoutEffect?
   *
   * We need this at render time to get the previous pathname on the memoized key function.
   * But we also need to set it again in the cleanup funtion to get the right value into the transition event callbacks eg: onEnter(node, prevPathname, pathname).
   * Otherwise onEnter will get the updated pathname and not the previous one.
   */
  renderTimePrevPathnameRef.current = pathname

  return (
    <SwitchTransition mode={mode}>
      <Transition
        appear={appear}
        key={key}
        nodeRef={nodeRef as React.RefObject<HTMLElement>}
        addEndListener={(done) => {
          transitions.current[pathname]?.then(done)
        }}
        /* ENTER EVENTS */
        onEnter={() => {
          if (!nodeRef?.current) {
            nodeRefWarning(pathname)
            return
          }
          transitionEvents.emit('enter', pathname)
          transitions.current[pathname] = onEnter?.(nodeRef?.current, callbackTimePrevPathnameRef.current, pathname)
        }}
        onEntering={() => {
          if (!nodeRef?.current) {
            nodeRefWarning(pathname)
            return
          }
          transitionEvents.emit('entering', pathname)
          onEntering?.(nodeRef?.current, callbackTimePrevPathnameRef.current, pathname)
        }}
        onEntered={() => {
          if (!nodeRef?.current) {
            nodeRefWarning(pathname)
            return
          }
          transitionEvents.emit('entered', pathname)
          onEntered?.(nodeRef?.current, callbackTimePrevPathnameRef.current, pathname)
        }}
        /* EXIT EVENTS */
        onExit={() => {
          if (!nodeRef?.current) {
            nodeRefWarning(pathname)
            return
          }
          transitionEvents.emit('exit', pathname)
          transitions.current[pathname] = onExit?.(nodeRef?.current, pathname, pathnameRef.current)
        }}
        onExiting={() => {
          if (!nodeRef?.current) {
            nodeRefWarning(pathname)
            return
          }
          transitionEvents.emit('exiting', pathname)
          onExiting?.(nodeRef?.current, pathname, pathnameRef.current)
        }}
        onExited={() => {
          if (!nodeRef?.current) {
            nodeRefWarning(pathname)
            return
          }
          transitionEvents.emit('exited', pathname)
          onExited?.(nodeRef?.current, pathname, pathnameRef.current)
        }}
      >
        {/* @ts-expect-error - Internal use only, I don't want to type this navigationHash.current */}
        {children(nodeRef, key)}
      </Transition>
    </SwitchTransition>
  )
}

export const DocumentTransitionState = () => {
  const { state } = useTransitionState()

  useEffect(() => {
    document.documentElement.setAttribute('data-transition-state', state)
  }, [state])

  return <></>
}
