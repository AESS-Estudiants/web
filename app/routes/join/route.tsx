import { join } from '~/content/join'
import { pageMeta } from '~/lib/seo'
import type { Route } from './+types/route'
import { Hero } from './sections/Hero'
import { Options } from './sections/Options'
import { Visit } from './sections/Visit'

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
    <>
      <Hero hero={join.hero} />
      <Options options={join.options} />
      <Visit visit={join.visit} />
    </>
  )
}
