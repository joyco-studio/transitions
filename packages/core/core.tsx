/* eslint-disable react-compiler/react-compiler */
import { createRef, useEffect, useMemo, useRef } from 'react'
import { SwitchTransition, Transition } from 'react-transition-group'
import { TinyEmitter } from 'tiny-emitter'
import { RouteConfigEntry } from '@react-router/dev/routes'
import { matchPath } from 'react-router'
import { nanoid } from 'nanoid'

type RouteTransitionManagerProps = {
  children: (nodeRef: React.RefObject<HTMLElement | null>) => React.ReactNode
  pathname: string
  mode?: 'out-in' | 'in-out'
  onEnter: Record<string | 'default', (node: HTMLElement) => Promise<void>>
  onExit: Record<string | 'default', (node: HTMLElement) => Promise<void>>
  onEntering?: Record<string | 'default', (node: HTMLElement) => void>
  onEntered?: Record<string | 'default', (node: HTMLElement) => void>
  onExiting?: Record<string | 'default', (node: HTMLElement) => void>
  onExited?: Record<string | 'default', (node: HTMLElement) => void>
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
  const pathnameRef = useRef(pathname)
  const transitions = useRef<Record<string, Promise<void> | undefined>>({})
  const navigationHash = useRef(navigationId())

  const routeNodeRefs = getRoutesFlatMap(routes)

  useEffect(() => {
    pathnameRef.current = pathname
    return () => {
      navigationHash.current = navigationId()
    }
  }, [pathname])

  const resolvedOnEnter = onEnter?.[pathname] ?? onEnter?.['default']
  const resolvedOnEntering = onEntering?.[pathname] ?? onEntering?.['default']
  const resolvedOnEntered = onEntered?.[pathname] ?? onEntered?.['default']
  const resolvedOnExit = onExit?.[pathname] ?? onExit?.['default']
  const resolvedOnExiting = onExiting?.[pathname] ?? onExiting?.['default']
  const resolvedOnExited = onExited?.[pathname] ?? onExited?.['default']

  const key = useMemo(() => pathname + `_${navigationHash.current}`, [pathname])
  const currentMatch = useMemo(() => routeNodeRefs.find((route) => matchPath(route.path, pathname)), [pathname])
  const nodeRef = currentMatch?.nodeRef ?? createRef()

  return (
    <SwitchTransition mode={mode}>
      <Transition
        appear={appear}
        key={key}
        nodeRef={nodeRef as React.RefObject<HTMLElement>}
        addEndListener={(done) => {
          transitions.current[pathname]?.then(done)
        }}
        onEnter={() => {
          if (!nodeRef?.current) {
            nodeRefWarning(pathname)
            return
          }
          transitionEvents.emit('enter', pathname)
          transitions.current[pathname] = resolvedOnEnter?.(nodeRef?.current)
        }}
        onExit={() => {
          if (!nodeRef?.current) {
            nodeRefWarning(pathname)
            return
          }
          transitionEvents.emit('exit', pathname)
          transitions.current[pathname] = resolvedOnExit?.(nodeRef?.current)
        }}
        onEntering={() => {
          if (!nodeRef?.current) {
            nodeRefWarning(pathname)
            return
          }
          transitionEvents.emit('entering', pathname)
          resolvedOnEntering?.(nodeRef?.current)
        }}
        onEntered={() => {
          if (!nodeRef?.current) {
            nodeRefWarning(pathname)
            return
          }
          transitionEvents.emit('entered', pathname)
          resolvedOnEntered?.(nodeRef?.current)
        }}
        onExiting={() => {
          if (!nodeRef?.current) {
            nodeRefWarning(pathname)
            return
          }
          transitionEvents.emit('exiting', pathname)
          resolvedOnExiting?.(nodeRef?.current)
        }}
        onExited={() => {
          if (!nodeRef?.current) {
            nodeRefWarning(pathname)
            return
          }
          transitionEvents.emit('exited', pathname)
          resolvedOnExited?.(nodeRef?.current)
        }}
      >
        {/* @ts-expect-error - Internal use only, I don't want to type this navigationHash.current */}
        {children(nodeRef, navigationHash.current)}
      </Transition>
    </SwitchTransition>
  )
}
