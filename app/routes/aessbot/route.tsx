import '@fontsource/squada-one/latin-400.css'
import squadaOne from '@fontsource/squada-one/files/squada-one-latin-400-normal.woff2?url'
import { aessbot } from '~/content/aessbot'
import { picture } from '~/lib/images'
import { breadcrumbJsonLd, eventJsonLd, pageMeta } from '~/lib/seo'
import type { Route } from './+types/route'
import { ComingSoon } from './sections/ComingSoon'
import { EditionPage } from './sections/EditionPage'
import { Editions } from './sections/Editions'

const PATH = '/aessbot'
const BREADCRUMB = { 'script:ld+json': breadcrumbJsonLd('AESSBot', PATH) }

export const links: Route.LinksFunction = () => [
  { rel: 'preload', href: squadaOne, as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
]

export function meta(_: Route.MetaArgs) {
  if (aessbot.status === 'coming-soon') {
    return [
      ...pageMeta({
        title: 'AESSBot 2027',
        description:
          "Estem preparant l'AESSBot 2027, la competició de robots minisumo de l'ETSETB. En breus tindreu tota la informació de la nova edició.",
        path: PATH,
      }),
      BREADCRUMB,
    ]
  }

  const { event, hero, registration } = aessbot.edition
  return [
    ...pageMeta({ title: event.name, description: event.description, path: PATH }),
    BREADCRUMB,
    {
      'script:ld+json': eventJsonLd({
        ...event,
        path: PATH,
        image: picture(hero.poster.src).img.src,
        registration:
          aessbot.status === 'registration'
            ? { path: registration.action.to ?? PATH, deadline: registration.deadline }
            : undefined,
      }),
    },
  ]
}

// The status in app/content/aessbot.json picks the page: coming soon, or the edition with or without registration
export default function AessbotPage() {
  if (aessbot.status === 'coming-soon') {
    return (
      <>
        <ComingSoon content={aessbot.comingSoon} />
        <Editions editions={aessbot.editions} />
      </>
    )
  }
  return <EditionPage content={aessbot} registrationOpen={aessbot.status === 'registration'} />
}
