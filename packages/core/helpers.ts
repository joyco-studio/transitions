import { RouteConfigEntry } from '@react-router/dev/routes'
import { customAlphabet } from 'nanoid'
import { createRef } from 'react'

export const nodeRefWarning = (pathname: string) => {
  console.warn(`${pathname} - nodeRef is null`)
}

export const getRoutesFlatMap = (routes: RouteConfigEntry[]) => {
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

export const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', 5)
