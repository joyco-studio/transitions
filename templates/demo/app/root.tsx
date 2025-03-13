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
import { nanoid } from 'nanoid'

const split = (node: HTMLElement) => {
  const text = node.textContent || ''
  node.textContent = ''
  const charSpans = Array.from(text).map((char) => {
    const span = document.createElement('span')
    // span.style.display = 'inline-block'
    span.textContent = char
    node.appendChild(span)
    return span
  })
  return charSpans
}

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
    { label: 'github', link: 'https://github.com/joyco-studio/transitions' },
  ]
  return { rebelLog: WATERMARK, mediaLinks }
}

export const meta: MetaFunction<typeof loader> = () => {
  const meta = generateMeta({
    strict: true,
    title: 'JOYCO | Transitions',
    description: 'Plug & Play page transitions for React Router.',
    url: SITE_URL,
    siteName: 'JOYCO | Transitions',
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
      onEntering={() => {
        window.scrollTo({ top: 0 })
      }}
      onEnter={(node, from, to) => {
        console.log('[onEnter]', { from, to })

        return promisifyGsap(
          gsap
            .timeline({
              onComplete: () => {
                gsap.set(node, { clearProps: 'all' })
              },
            })
            .fromTo(node, { opacity: 0 }, { opacity: 1, duration: 1 })
        )
      }}
      onExit={(node, from, to) => {
        console.log('[onExit]', { from, to })

        const animateElements = node.querySelectorAll<HTMLElement>('[data-animate]')

        const groupedChunks: { [key: string]: HTMLSpanElement[] } = {}

        animateElements.forEach((element) => {
          let dataAnimate = element.getAttribute('data-animate')
          const dataSplit = element.getAttribute('data-split') === 'true'

          if (dataAnimate === 'true') {
            dataAnimate = nanoid(10)
          }

          if (dataAnimate) {
            if (!groupedChunks[dataAnimate]) {
              groupedChunks[dataAnimate] = []
            }

            if (dataSplit) {
              groupedChunks[dataAnimate].push(...split(element))
            } else {
              groupedChunks[dataAnimate].push(element)
            }
          }
        })

        const tl = gsap.timeline()
        const factor = 0.5

        Object.values(groupedChunks).forEach((chunks, idx) => {
          tl.fromTo(
            chunks,
            { opacity: 1 },
            {
              opacity: 0,
              duration: 0.7 * factor,
              ease: 'sine.out',
              stagger: {
                each: 0.1 * factor,
                ease: 'none',
              },
            },
            idx * 0.5
          )
        })

        tl.fromTo(node, { opacity: 1 }, { opacity: 0, duration: 0.5 }, `>-=${0.2 * factor}`)

        return promisifyGsap(tl)
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
