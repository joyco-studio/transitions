import { Link, type MetaFunction } from 'react-router'
import { Page } from '~/components/page'

export const meta: MetaFunction = () => {
  return [{ title: `Projects` }]
}

export default function Projects() {
  return (
    <Page name="Projects index">
      <div className="flex flex-col gap-4 mt-4">
        <Link to="/projects/project-1" className="text-blue-500 hover:underline">
          Project 1: Portfolio Website
        </Link>
        <Link to="/projects/project-2" className="text-blue-500 hover:underline">
          Project 2: E-commerce Platform
        </Link>
        <Link to="/projects/project-3" className="text-blue-500 hover:underline">
          Project 3: Weather App
        </Link>
        <Link to="/projects/project-4" className="text-blue-500 hover:underline">
          Project 4: Task Management System
        </Link>
        <Link to="/projects/project-5" className="text-blue-500 hover:underline">
          Project 5: Social Media Dashboard
        </Link>
        <Link to="/projects/project-5/not-found" className="text-red-500 hover:underline">
          Project ?: Not Found
        </Link>
      </div>
    </Page>
  )
}
