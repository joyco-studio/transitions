import {
  isRouteErrorResponse,
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  useLocation,
  useOutlet,
  type MetaFunction,
} from 'react-router'

import type { Route } from './+types/root'
import stylesheet from './app.css?url'
import { RouteTransitionManager } from '@joycostudio/transitions'
import routes from './routes'
import { promisifyGsap } from './lib/gsap'
import gsap from 'gsap'
import { Header } from './components/header'
import Footer from './components/footer'
import { SITE_URL, WATERMARK } from './lib/utils/constants'
import { generateMeta } from './lib/utils/meta'
import { generateLinks } from './lib/utils/links'

export const links: Route.LinksFunction = () =>
  generateLinks({
    stylesheets: [stylesheet, 'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700&display=swap'],
    favicon: {
      '32x32': '/favicon-32x32.png',
      '16x16': '/favicon-16x16.png',
      'apple-touch-icon': '/apple-touch-icon.png',
    },
    manifest: '/site.webmanifest',
    preconnect: [
      { href: 'https://fonts.googleapis.com' },
      { href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
    ],
    preload: [
      {
        href: 'https://fonts.gstatic.com/s/barlowcondensed/v12/HTxwL3I-JCGChYJ8VI-L6OO_au7B46r2z3bWuYMBYro.woff2',
        as: 'font',
        type: 'font/woff2',
        crossOrigin: 'anonymous',
      },
    ],
  })

export const loader = () => {
  const mediaLinks = [
    { label: 'x', link: 'https://x.com/joyco_studio' },
    { label: 'github', link: 'https://github.com/joyco-studio/rrv7-starter' },
  ]
  return { rebelLog: WATERMARK, mediaLinks }
}

export const meta: MetaFunction<typeof loader> = () => {
  const meta = generateMeta({
    strict: true,
    title: 'Rebels starter',
    description:
      'A react-router v7 starter made by rebels for rebels. Featuring: react-router v7, react 19 + compiler, tailwindcss, gsap, eslint + prettier, page transitions, + 1000 aura.',
    url: SITE_URL,
    siteName: 'Rebels starter',
    image: { url: `${SITE_URL}/opengraph-image.png`, width: 1200, height: 630, type: 'image/png' },
  })

  return meta
}

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
        <Header />
        {children}
        <Footer />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  const element = useOutlet()

  const location = useLocation()

  return (
    <RouteTransitionManager
      appear
      routes={routes}
      pathname={location.pathname}
      onEntering={{
        default: () => {
          window.scrollTo({ top: 0 })
        },
      }}
      onEnter={{
        default: (node) => {
          return promisifyGsap(
            gsap
              .timeline({
                onComplete: () => {
                  gsap.set(node, { clearProps: 'all' })
                },
              })
              .fromTo(node, { opacity: 0 }, { opacity: 1, duration: 1 })
          )
        },
      }}
      onExit={{
        default: (node) => {
          return promisifyGsap(gsap.timeline().fromTo(node, { opacity: 1 }, { opacity: 0, duration: 0.5 }, 0))
        },
      }}
    >
      {(ref) => (
        <main
          style={{ opacity: 0 }}
          className="overflow-y-clip flex flex-col min-h-svh"
          data-pathname={location.pathname}
          ref={ref}
        >
          {element}
        </main>
      )}
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
