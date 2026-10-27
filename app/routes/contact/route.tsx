import { contact } from '~/content/contact'
import { breadcrumbJsonLd, pageMeta } from '~/lib/seo'
import type { Route } from './+types/route'
import { ContactForm } from './sections/ContactForm'
import { Hero } from './sections/Hero'
import { Location } from './sections/Location'

export function meta(_: Route.MetaArgs) {
  return [
    ...pageMeta({
      title: 'Contacte',
      description:
        'Tens alguna pregunta, suggeriment o vols col·laborar amb nosaltres? Omple el formulari i et respondrem el més aviat possible.',
      path: '/contacte',
    }),
    { 'script:ld+json': breadcrumbJsonLd('Contacte', '/contacte') },
  ]
}

export default function ContactPage() {
  return (
    <>
      <Hero hero={contact.hero} />
      <Location location={contact.location} />
      <ContactForm form={contact.form} />
    </>
  )
}
