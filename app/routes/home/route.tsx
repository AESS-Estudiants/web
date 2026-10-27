import { home } from '~/content/home'
import { faqJsonLd, organizationJsonLd, pageMeta, websiteJsonLd } from '~/lib/seo'
import type { Route } from './+types/route'
import { About } from './sections/About'
import { Events } from './sections/Events'
import { Faq } from './sections/Faq'
import { Hero } from './sections/Hero'

export function meta(_: Route.MetaArgs) {
  return [
    ...pageMeta({
      description:
        "Associació d'estudiants de l'ETSETB (UPC) on aprenem construint: tallers, competicions i projectes de robòtica, electrònica i programació.",
      path: '/',
    }),
    { 'script:ld+json': organizationJsonLd },
    { 'script:ld+json': websiteJsonLd },
    { 'script:ld+json': faqJsonLd(home.faq.items) },
  ]
}

export default function HomePage() {
  return (
    <>
      <Hero hero={home.hero} />
      <About about={home.about} />
      <Events events={home.events} />
      <Faq faq={home.faq} />
    </>
  )
}
