import { pageMeta } from '~/lib/seo'
import type { Route } from './+types/route'

export function meta(_: Route.MetaArgs) {
  return pageMeta({
    title: 'AESSBot',
    description:
      'La competició de robòtica més esperada de la UPC. Consulta les edicions anteriors, els patrocinadors i les preguntes freqüents.',
    path: '/aessbot',
  })
}

export default function AessbotPage() {
  return (
    <section>
      <h1>AESSBot</h1>
    </section>
  )
}
