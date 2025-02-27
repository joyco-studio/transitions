import { Link } from 'react-router'
import cn from '@/lib/utils/cn'

const Paragraph = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <p
      className={cn(
        'font-mono text-primary text-opacity-50 text-pretty whitespace-pre-wrap text-xs leading-relaxed font-medium uppercase mt-2 max-w-prose',
        className
      )}
    >
      {children}
    </p>
  )
}

export default function About() {
  return (
    <div className="flex selection:bg-primary selection:text-accent flex-col items-center h-screen bg-accent">
      <div className="flex-1 flex flex-col justify-center items-center px-4">
        <h1 data-animate data-split className="font-sans text-6xl font-bold mb-7">
          ABOUT
        </h1>
        <Paragraph>
          <span data-animate="paragraph" className="font-bold">
            Hey!
          </span>{' '}
          <span data-animate="paragraph" className="font-bold">
            - You are not supposed to be here.
          </span>{' '}
          <Link data-animate="paragraph" className="underline" to="/">
            Go back to the homepage!
          </Link>
        </Paragraph>
      </div>
    </div>
  )
}
