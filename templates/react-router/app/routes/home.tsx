import { Page } from '~/components/page'
import type { MetaFunction } from 'react-router'

export const meta: MetaFunction = () => {
  return [{ title: 'Home' }]
}

export default function Home() {
  return <Page name="Home" />
}
