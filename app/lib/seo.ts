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

// Default share image, 1200 × 630
const SHARE_IMAGE = {
  url: '/images/og/aess-estudiants.png',
  width: '1200',
  height: '630',
  alt: "AESS Estudiants: robòtica, electrònica i programació a l'ETSETB (UPC)",
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
    { property: 'og:image', content: absoluteUrl(SHARE_IMAGE.url) },
    { property: 'og:image:width', content: SHARE_IMAGE.width },
    { property: 'og:image:height', content: SHARE_IMAGE.height },
    { property: 'og:image:alt', content: SHARE_IMAGE.alt },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: fullTitle },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: absoluteUrl(SHARE_IMAGE.url) },
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

/** Breadcrumb from the home page to an inner page */
export function breadcrumbJsonLd(name: string, path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inici', item: absoluteUrl('/') },
      { '@type': 'ListItem', position: 2, name, item: absoluteUrl(path) },
    ],
  }
}

/** Questions and answers shown on a page, for rich results */
export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }
}

/** Courses offered by the association */
export function coursesJsonLd(items: { name: string; description: string; slug: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((course, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Course',
        name: course.name,
        description: course.description,
        url: absoluteUrl(`/cursos?curs=${course.slug}`),
        inLanguage: 'ca',
        provider: { '@type': 'Organization', name: SITE_NAME, sameAs: SITE_URL },
      },
    })),
  }
}
