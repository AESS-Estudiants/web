import { pageMeta } from '~/lib/seo'
import type { Route } from './+types/route'

export function meta(_: Route.MetaArgs) {
  return pageMeta({
    title: 'Projectes',
    description:
      'Descobreix les iniciatives en robòtica i electrònica que impulsem des del taller.',
    path: '/projectes',
  })
}

export default function ProjectsPage() {
  return (
    <main>
      <h1>Projectes</h1>
    </main>
  )
}
