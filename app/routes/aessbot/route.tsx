import '@fontsource/squada-one/latin-400.css'
import { aessbot } from '~/content/aessbot'
import { pageMeta } from '~/lib/seo'
import type { Route } from './+types/route'
import { ComingSoon } from './sections/ComingSoon'
import { Editions } from './sections/Editions'

export function meta(_: Route.MetaArgs) {
  return pageMeta({
    title: 'AESSBot 2027',
    description:
      "Estem preparant l'AESSBot 2027, la competició de robots minisumo de l'ETSETB. En breus tindreu tota la informació de la nova edició.",
    path: '/aessbot',
  })
}

export default function AessbotPage() {
  return (
    <>
      <ComingSoon content={aessbot.comingSoon} />
      <Editions editions={aessbot.editions} />
    </>
  )
}
