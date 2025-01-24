import type { MetaFunction } from 'react-router'
import { Page } from 'components/page'

export const meta: MetaFunction = () => {
  return [{ title: 'About' }]
}

export default function About() {
  return <Page name="About" />
}
