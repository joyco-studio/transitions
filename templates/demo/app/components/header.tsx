import type { loader } from '@/root'
import routes from '@/routes'
import { usePreservedLoaderData } from '@joycostudio/transitions'
import { Link } from 'react-router'

export const Header = () => {
  const { mediaLinks } = usePreservedLoaderData<typeof loader>()

  return (
    <header className="fixed top-0 z-50 w-full items-center justify-between grid grid-cols-3 p-2 px-4 md:py-4 h-header">
      <div className="gap-3 contents">
        <Link key="logo" to="/" className="max-w-max justify-self-start">
          <img src="/logo.svg" alt="Rebels logo" className="h-4" />
        </Link>
        <nav className="flex items-center justify-center md:justify-self-center">
          <ul className="flex items-center gap-3 md:gap-6 font-mono uppercase">
            {routes.map((route, index) => (
              <li key={index} className="text-sm">
                <Link to={route.path ?? ''}>{route.path?.replace('/', '') ?? 'Home'}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <ul className="flex items-center gap-3 md:gap-6 font-mono uppercase justify-self-end">
        {mediaLinks.map((link, index) => (
          <li key={index} className="text-sm">
            <Link className="underline underline-offset-4" to={link.link} target="_blank" rel="noopener noreferrer">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </header>
  )
}
