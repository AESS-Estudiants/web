import { pageMeta } from '~/lib/seo'
import type { Route } from './+types/route'

export function meta(_: Route.MetaArgs) {
  return pageMeta({
    title: 'Contacte',
    description:
      'Tens alguna pregunta, suggeriment o vols col·laborar amb nosaltres? Omple el formulari i et respondrem el més aviat possible.',
    path: '/contacte',
  })
}

export default function ContactPage() {
  return (
    <section>
      <h1>Contacte</h1>
    </section>
  )
}
