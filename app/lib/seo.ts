import type { MetaDescriptor } from 'react-router'

export const SITE_URL = 'https://aessestudiants.org'
export const SITE_NAME = 'AESS Estudiants'

// Pages listed in the sitemap, in menu order
export const INDEXED_PATHS = ['/', '/aessbot', '/cursos', '/projectes', '/uneix-te', '/contacte']

type PageMeta = {
  title?: string
  description: string
  path: string
  noindex?: boolean
}

export function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).href
}

export function pageMeta({ title, description, path, noindex }: PageMeta): MetaDescriptor[] {
  const fullTitle = title ? `${title} · ${SITE_NAME}` : SITE_NAME
  const url = absoluteUrl(path)
  const meta: MetaDescriptor[] = [
    { title: fullTitle },
    { name: 'description', content: description },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: SITE_NAME },
    { property: 'og:locale', content: 'ca_ES' },
    { property: 'og:title', content: fullTitle },
    { property: 'og:description', content: description },
    { property: 'og:url', content: url },
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: fullTitle },
    { name: 'twitter:description', content: description },
  ]
  if (noindex) meta.push({ name: 'robots', content: 'noindex' })
  else meta.push({ tagName: 'link', rel: 'canonical', href: url })
  return meta
}

export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  alternateName: 'AESS',
  description:
    "Associació d'estudiants de l'ETSETB (UPC) dedicada a la robòtica, l'electrònica i la programació.",
  url: SITE_URL,
  logo: absoluteUrl('/images/logos/aess/Logo_aess_blanc.png'),
  email: 'aess.estudiants@upc.edu',
  telephone: '+34934137564',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Campus Nord UPC',
    addressLocality: 'Barcelona',
    addressCountry: 'ES',
  },
  sameAs: [
    'https://www.instagram.com/aessestudiants',
    'https://www.linkedin.com/company/aess-estudiants-upc',
  ],
}

export const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: 'ca',
}
