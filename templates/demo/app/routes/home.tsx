import cn from '@/lib/utils/cn'
import type { SVGProps } from 'react'
import { Link } from 'react-router'

export function loader() {
  const stack = [
    {
      label: 'react-router v7',
      link: 'https://reactrouter.com/start/framework/installation',
    },
    {
      label: 'react 19 + compiler',
      link: 'https://react.dev/reference/react',
    },
    {
      label: 'tailwindcss',
      link: 'https://tailwindcss.com/docs/installation/using-vite',
    },
    {
      label: 'gsap',
      link: 'https://gsap.com/docs/v3/gsap-core/',
    },
    {
      label: 'eslint + prettier',
      link: 'https://eslint.org/docs/latest/use/getting-started',
    },
    {
      label: 'page transitions',
      link: 'https://www.npmjs.com/package/@joycostudio/transitions',
    },
    {
      label: '+ 1000 aura',
      link: 'https://www.youtube.com/watch?v=0v1BJEqO6h0',
    },
  ]
  return { stack }
}

const Paragraph = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <p
      className={cn(
        'text-center font-mono text-primary text-opacity-50 text-pretty whitespace-pre-wrap text-xs leading-relaxed font-medium uppercase mt-2 max-w-prose',
        className
      )}
    >
      {children}
    </p>
  )
}

export default function Home() {
  return (
    <div className="flex selection:bg-primary selection:text-accent flex-col items-center h-screen bg-accent">
      <div className="flex-1 flex flex-col justify-center items-center px-4">
        <h1 className="font-sans text-6xl font-bold mb-7">HOMEPAGE</h1>
        <Paragraph>
          <span className="font-bold">What are you waiting for?</span> -{' '}
          <Link className="underline" to="/about">
            Change the page now!
          </Link>
        </Paragraph>
      </div>
    </div>
  )
}

const GithubIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" {...props}>
    <path
      fill="#0344DC"
      d="M12 1.95c5.525 0 10 4.476 10 10a10.016 10.016 0 0 1-6.813 9.488c-.5.1-.687-.212-.687-.475 0-.337.012-1.412.012-2.75 0-.937-.312-1.537-.675-1.85 2.226-.25 4.563-1.1 4.563-4.937 0-1.1-.387-1.988-1.025-2.688.1-.25.45-1.275-.1-2.65 0 0-.837-.275-2.75 1.025a9.28 9.28 0 0 0-2.5-.337c-.85 0-1.7.112-2.5.337-1.913-1.287-2.75-1.025-2.75-1.025-.55 1.375-.2 2.4-.1 2.65-.638.7-1.025 1.6-1.025 2.688 0 3.825 2.325 4.687 4.55 4.937-.287.25-.55.688-.637 1.338-.575.262-2.013.687-2.913-.825-.188-.3-.75-1.038-1.538-1.025-.837.012-.337.475.013.662.425.238.912 1.125 1.025 1.413.2.562.85 1.637 3.362 1.175 0 .837.013 1.625.013 1.862 0 .263-.188.563-.688.475A9.994 9.994 0 0 1 2 11.951c0-5.525 4.475-10 10-10Z"
    />
  </svg>
)
