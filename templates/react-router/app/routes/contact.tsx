import type { MetaFunction } from 'react-router'
import { Page } from 'components/page'

export const meta: MetaFunction = () => {
  return [{ title: 'Contact' }]
}

export default function Contact() {
  return <Page name="Contact" />
}
