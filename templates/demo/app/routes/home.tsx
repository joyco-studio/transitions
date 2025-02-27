import cn from '@/lib/utils/cn'
import { Link } from 'react-router'

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
        <h1 data-animate data-split className="font-sans text-6xl font-bold mb-7">
          HOMEPAGE
        </h1>
        <Paragraph>
          <span data-animate="paragraph" className="font-bold">
            What are you waiting for? -
          </span>{' '}
          <Link data-animate="paragraph" className="underline" to="/about">
            Change the page now!
          </Link>
        </Paragraph>
      </div>
    </div>
  )
}
