import { z } from 'zod'
import { ICON_NAMES } from '~/components/icons/registry'

// Shared pieces

export const iconName = z.enum(ICON_NAMES)

/** Internal route, starting with a slash */
export const route = z.string().regex(/^\/[\w\-/]*$/, 'An internal route starts with /')

/** Internal route, absolute URL, mailto, tel or a file in public/ */
export const href = z.string().regex(/^(\/|https:\/\/|mailto:|tel:)/, 'Not a valid link')

export const link = z.object({ label: z.string().min(1), to: route })

export const externalLink = z.object({ label: z.string().min(1), href })

export const stat = z.object({ icon: iconName, value: z.string().min(1), label: z.string().min(1) })

/** Button or link: `to` for a page or a section (#id), `href` for anything else */
export const action = z
  .object({
    label: z.string().min(1),
    variant: z.enum(['primary', 'secondary']).default('primary'),
    icon: iconName.optional(),
    arrow: z.boolean().default(false),
    to: z.string().regex(/^[/#]/, 'A route starts with / or #').optional(),
    href: href.optional(),
  })
  .refine((value) => Boolean(value.to) !== Boolean(value.href), 'Use either to or href')

/** Photo in app/assets/images, by its path there */
export const image = z.object({
  src: z.string().regex(/\.(jpe?g|png)$/, 'A photo in app/assets/images'),
  alt: z.string().min(1),
})

/** Text split in paragraphs */
export const paragraphs = z.array(z.string().min(1)).min(1)

/** Text with bold fragments: plain strings and `{ "strong": "..." }` pieces */
export const richText = z
  .array(z.union([z.string().min(1), z.object({ strong: z.string().min(1) })]))
  .min(1)

/** Logo: a PNG or JPEG in app/assets/images, or an SVG in public/ by its URL */
export const logo = z.object({
  src: z
    .string()
    .regex(/^([\w-]+\/)*[\w-]+\.(jpe?g|png)$|^\/images\/[\w/-]+\.svg$/, 'A photo or an SVG'),
  alt: z.string().min(1),
})

export const faqItem = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
  icon: iconName.optional(),
})

// Site-wide content: navigation, contact details, social networks and legal documents

export const site = z.object({
  name: z.string().min(1),
  description: z.string().min(1).max(160),
  navigation: z.array(link).min(1),
  join: link,
  contact: z.object({
    email: z.email(),
    phone: z.string().regex(/^\+\d+$/, 'Phone in international format, without spaces'),
    phoneLabel: z.string().min(1),
    address: z.string().min(1),
  }),
  socials: z.array(
    z.object({
      network: z.enum(['instagram', 'linkedin', 'github']),
      label: z.string().min(1),
      url: z.url(),
    }),
  ),
  legal: z.array(externalLink),
})

// Home page

export const home = z.object({
  hero: z.object({
    badge: z.object({ icon: iconName, label: z.string().min(1) }).optional(),
    title: z.tuple([z.string().min(1), z.string().min(1)]),
    description: z.string().min(1),
    actions: z.array(action).max(2),
  }),
  about: z.object({
    title: z.string().min(1),
    link: link.optional(),
    intro: z.object({
      icon: iconName,
      eyebrow: z.string().min(1),
      title: z.string().min(1),
      body: paragraphs,
      link,
    }),
    cards: z.array(
      z.object({
        icon: iconName,
        eyebrow: z.string().min(1),
        title: z.string().min(1),
        body: paragraphs,
        to: route.optional(),
      }),
    ),
    gallery: z.object({ label: z.string().min(1), images: z.array(image).min(1) }),
  }),
  events: z.object({
    title: z.string().min(1),
    items: z.array(
      z.object({
        tag: z.string().min(1),
        title: z.string().min(1),
        body: z.string().min(1),
        poster: image,
        stats: z.array(stat).max(4),
        actions: z.array(action).max(2),
      }),
    ),
  }),
  faq: z.object({
    title: z.string().min(1),
    subtitle: z.string().optional(),
    items: z.array(faqItem).min(1),
    cta: z.object({ text: z.string().min(1), action }),
  }),
})

// Courses page

export const courses = z.object({
  hero: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    stats: z.array(stat).max(4),
    poster: image,
  }),
  intro: z.object({
    title: z.string().min(1),
    subtitle: richText,
    gallery: z.object({ label: z.string().min(1), images: z.array(image).min(1) }),
  }),
  enrollLink: z.url(),
  /** Labels of the facts on the card and in the course dialog */
  labels: z.object({
    price: z.string().min(1),
    credits: z.string().min(1),
    requirements: z.string().min(1),
    location: z.string().min(1),
    duration: z.string().min(1),
    date: z.string().min(1),
    level: z.string().min(1),
    moreInfo: z.string().min(1),
    enroll: z.string().min(1),
  }),
  modal: z.object({
    description: z.string().min(1),
    content: z.string().min(1),
    contentPending: z.string().min(1),
    requirements: z.string().min(1),
    materials: z.string().min(1),
    noMaterials: z.string().min(1),
    registration: z.string().min(1),
    registrationText: richText,
    close: z.string().min(1),
  }),
  items: z
    .array(
      z.object({
        /** Used in the link to the open course, /cursos?curs=<slug> */
        slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Lowercase words joined by hyphens'),
        name: z.string().min(1),
        logo,
        level: z.string().min(1),
        description: z.string().min(1),
        content: z.string().min(1).optional(),
        materials: z.array(z.string().min(1)),
        duration: z.string().min(1),
        date: z.string().min(1),
        price: z.string().min(1),
        credits: z.string().min(1),
        requirements: z.string().min(1),
        location: z.string().min(1),
      }),
    )
    .min(1)
    .refine(
      (items) => new Set(items.map((item) => item.slug)).size === items.length,
      'Every course needs its own slug',
    ),
})

// AESSBot page

const youtubeVideo = z.object({
  youtubeId: z.string().regex(/^[\w-]{11}$/, 'A YouTube video id'),
  title: z.string().min(1),
  caption: z.string().optional(),
})

export const aessbot = z.object({
  /** Which version of the page is shown: before the edition is announced, while registration is open or after it */
  status: z.enum(['coming-soon', 'registration', 'finished']),
  comingSoon: z.object({
    badge: z.string().min(1),
    title: z.tuple([z.string().min(1), z.string().min(1)]),
    description: z.string().min(1),
    actions: z.array(action).max(2),
    note: z.string().optional(),
  }),
  editions: z.object({
    title: z.string().min(1),
    subtitle: z.string().optional(),
    items: z
      .array(z.object({ year: z.number().int(), video: youtubeVideo.optional() }))
      .refine((items) => items.some((item) => item.video), 'At least one edition has a video'),
  }),
})

// Missing page and unexpected error

const errorState = z.object({
  code: z.string().optional(),
  title: z.string().min(1),
  description: z.string().min(1),
  action: link,
})

export const errors = z.object({ notFound: errorState, unexpected: errorState })

export type Site = z.infer<typeof site>
export type Aessbot = z.infer<typeof aessbot>
export type Home = z.infer<typeof home>
export type Courses = z.infer<typeof courses>
export type Course = Courses['items'][number]
export type RichTextContent = z.infer<typeof richText>
export type LogoContent = z.infer<typeof logo>
export type Action = z.infer<typeof action>
export type ImageContent = z.infer<typeof image>
export type Stat = z.infer<typeof stat>
export type FaqItemContent = z.infer<typeof faqItem>
