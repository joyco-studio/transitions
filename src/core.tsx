import { useEffect, useRef } from 'react'
import { SwitchTransition, Transition } from 'react-transition-group'
import { TinyEmitter } from 'tiny-emitter'

type RouteTransitionManagerProps = {
  children: React.ReactNode
  nodeRef: React.RefObject<HTMLElement | null>
  pathname: string
  mode?: 'out-in' | 'in-out'
  onEnter: Record<string | 'default', (node: HTMLElement) => Promise<void>>
  onExit: Record<string | 'default', (node: HTMLElement) => Promise<void>>
  onEntering?: Record<string | 'default', (node: HTMLElement) => void>
  onEntered?: Record<string | 'default', (node: HTMLElement) => void>
  onExiting?: Record<string | 'default', (node: HTMLElement) => void>
  onExited?: Record<string | 'default', (node: HTMLElement) => void>
  appear?: boolean
}

export const transitionEvents = new TinyEmitter()

const nodeRefWarning = (pathname: string) => {
  console.warn(`${pathname} - nodeRef is null`)
}

export const RouteTransitionManager = ({
  onEnter,
  onEntering,
  onEntered,
  onExit,
  onExiting,
  onExited,
  children,
  nodeRef,
  pathname,
  mode = 'out-in',
  appear = false,
}: RouteTransitionManagerProps) => {
  const pathnameRef = useRef(pathname)
  const transitions = useRef<Record<string, Promise<void> | undefined>>({})

  useEffect(() => {
    pathnameRef.current = pathname
  }, [pathname])

  const resolvedOnEnter = onEnter?.[pathname] ?? onEnter?.['default']
  const resolvedOnEntering = onEntering?.[pathname] ?? onEntering?.['default']
  const resolvedOnEntered = onEntered?.[pathname] ?? onEntered?.['default']
  const resolvedOnExit = onExit?.[pathname] ?? onExit?.['default']
  const resolvedOnExiting = onExiting?.[pathname] ?? onExiting?.['default']
  const resolvedOnExited = onExited?.[pathname] ?? onExited?.['default']

  return (
    <SwitchTransition mode={mode}>
      <Transition
        appear={appear}
        key={pathname}
        nodeRef={nodeRef}
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
        {children}
      </Transition>
    </SwitchTransition>
  )
}
