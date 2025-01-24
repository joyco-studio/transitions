import { useParams, type MetaFunction } from 'react-router'
import { Page } from 'components/page'

export const meta: MetaFunction = ({ params }) => {
  return [{ title: `Project ${params.slug}` }]
}

export default function Project() {
  const params = useParams()
  return <Page name={`Project ${params.slug}`} />
}
