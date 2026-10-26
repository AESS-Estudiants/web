import { organizationJsonLd, pageMeta, websiteJsonLd } from '~/lib/seo'
import type { Route } from './+types/route'

export function meta(_: Route.MetaArgs) {
  return [
    ...pageMeta({
      description:
        "Associació d'estudiants de l'ETSETB (UPC) on aprenem construint: tallers, competicions i projectes de robòtica, electrònica i programació.",
      path: '/',
    }),
    { 'script:ld+json': organizationJsonLd },
    { 'script:ld+json': websiteJsonLd },
  ]
}

export default function HomePage() {
  return (
    <main>
      <h1>Inici</h1>
    </main>
  )
}
