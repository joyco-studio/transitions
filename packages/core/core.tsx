/* eslint-disable react-compiler/react-compiler */
import { createRef, useEffect, useMemo, useRef } from 'react'
import { SwitchTransition, Transition } from 'react-transition-group'
import { TinyEmitter } from 'tiny-emitter'
import { RouteConfigEntry } from '@react-router/dev/routes'
import { matchPath } from 'react-router'
import { nanoid } from 'nanoid'
import { useTransitionState } from './hooks'

type RouteTransitionManagerProps = {
  children: (nodeRef: React.RefObject<HTMLElement | null>) => React.ReactNode
  pathname: string
  mode?: 'out-in' | 'in-out'
  onEnter: (node: HTMLElement, from: string | undefined, to: string) => Promise<void>
  onExit: (node: HTMLElement, from: string | undefined, to: string) => Promise<void>
  onEntering?: (node: HTMLElement, from: string | undefined, to: string) => void
  onEntered?: (node: HTMLElement, from: string | undefined, to: string) => void
  onExiting?: (node: HTMLElement, from: string | undefined, to: string) => void
  onExited?: (node: HTMLElement, from: string | undefined, to: string) => void
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

const navigationId = () => nanoid(5)

export const RouteTransitionManager = ({
  routes,
  onEnter,
  onEntering,
  onEntered,
  onExit,
  onExiting,
  onExited,
  children,
  pathname,
  mode = 'out-in',
  appear = false,
}: RouteTransitionManagerProps) => {
  const prevPathnameRef = useRef<string>()
  const pathnameRef = useRef(pathname)
  const transitions = useRef<Record<string, Promise<void> | undefined>>({})
  const navigationHash = useRef(navigationId())

  const routeNodeRefs = getRoutesFlatMap(routes)

  useEffect(() => {
    return () => {
      prevPathnameRef.current = pathname
      navigationHash.current = navigationId()
    }
  }, [pathname])

  const key = useMemo(() => pathname + `_${navigationHash.current}`, [pathname])
  const currentMatch = useMemo(() => routeNodeRefs.find((route) => matchPath(route.path, pathname)), [pathname])
  const nodeRef = currentMatch?.nodeRef ?? createRef()

  pathnameRef.current = pathname

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
          transitions.current[pathname] = onEnter?.(nodeRef?.current, prevPathnameRef.current, pathnameRef.current)
        }}
        onEntering={() => {
          if (!nodeRef?.current) {
            nodeRefWarning(pathname)
            return
          }
          transitionEvents.emit('entering', pathname)
          onEntering?.(nodeRef?.current, prevPathnameRef.current, pathnameRef.current)
        }}
        onEntered={() => {
          if (!nodeRef?.current) {
            nodeRefWarning(pathname)
            return
          }
          transitionEvents.emit('entered', pathname)
          onEntered?.(nodeRef?.current, prevPathnameRef.current, pathnameRef.current)
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
        {children(nodeRef, navigationHash.current)}
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
