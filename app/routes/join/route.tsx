import { pageMeta } from '~/lib/seo'
import type { Route } from './+types/route'

export function meta(_: Route.MetaArgs) {
  return pageMeta({
    title: 'Uneix-te',
    description:
      'Vols conèixer AESS, veure el taller o participar en projectes? Pots acostar-te al teu ritme o apuntar-te a una jornada de portes obertes.',
    path: '/uneix-te',
  })
}

export default function JoinPage() {
  return (
    <section>
      <h1>Uneix-te</h1>
    </section>
  )
}
