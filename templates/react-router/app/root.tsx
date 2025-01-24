import {
  isRouteErrorResponse,
  Links,
  matchPath,
  Meta,
  Scripts,
  ScrollRestoration,
  useLocation,
  useOutlet,
} from 'react-router'

import type { Route } from './+types/root'
import stylesheet from './app.css?url'
import { RouteTransitionManager } from '@joycostudio/transitions'
import { createRef, useMemo } from 'react'
import type { RouteConfigEntry } from '@react-router/dev/routes'
import routesConfig from './routes'
import { Navigation } from 'components/navigation'

export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
  { rel: 'stylesheet', href: stylesheet },
]

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <Navigation />
      </body>
    </html>
  )
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

const routeNodeRefs = getRoutesFlatMap(routesConfig)
console.log(routeNodeRefs)

export default function App() {
  const element = useOutlet()

  const location = useLocation()

  const currentMatch = useMemo(
    () => routeNodeRefs.find((route) => matchPath(route.path, location.pathname)),
    [location.pathname]
  )

  console.log('MATCH', currentMatch)
  console.log('PATH', location.pathname)
  console.log('NODES', routeNodeRefs)

  return (
    <RouteTransitionManager
      appear
      nodeRef={currentMatch?.nodeRef ?? createRef()} /* If nothing matches create a dummy ref, so 404 kicks in */
      pathname={location.pathname}
      onEnter={{
        default: (node) => {
          return new Promise((resolve) => {
            console.log('enter', node)
            node.classList.add('fade-in')
            node.addEventListener('animationend', () => resolve(), { once: true })
          })
        },
      }}
      onExit={{
        default: (node) => {
          return new Promise((resolve) => {
            console.log('exit', node)
            node.classList.add('fade-out')
            node.addEventListener('animationend', () => resolve(), { once: true })
          })
        },
      }}
    >
      <main
        className="overflow-y-clip flex flex-col min-h-svh opacity-0"
        data-pathname={location.pathname}
        ref={currentMatch?.nodeRef}
      >
        {element}
        <footer className="flex container mx-auto py-10 justify-between">
          <p>
            {'<'}Footer{'/>'}
          </p>
          <p>This should fade out with the page</p>
        </footer>
      </main>
    </RouteTransitionManager>
  )
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!'
  let details = 'An unexpected error occurred.'
  let stack: string | undefined

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error'
    details = error.status === 404 ? 'The requested page could not be found.' : error.statusText || details
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message
    stack = error.stack
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  )
}
