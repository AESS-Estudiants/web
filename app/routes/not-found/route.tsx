import { pageMeta } from '~/lib/seo'
import type { Route } from './+types/route'

export function meta(_: Route.MetaArgs) {
  return pageMeta({
    title: 'Pàgina no trobada',
    description: 'La pàgina que cerques no existeix o ha estat moguda.',
    path: '/404',
    noindex: true,
  })
}

export default function NotFoundPage() {
  return (
    <section>
      <h1>Pàgina no trobada</h1>
    </section>
  )
}
