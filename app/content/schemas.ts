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

// AESSBot page

const youtubeVideo = z.object({
  youtubeId: z.string().regex(/^[\w-]{11}$/, 'A YouTube video id'),
  title: z.string().min(1),
  caption: z.string().optional(),
})

/** Text with **bold** and [links](/path) inline */
const richText = z.string().min(1)

const iconCard = z.object({ icon: iconName, title: z.string().min(1), body: richText })

const cta = z.object({ text: z.string().min(1), action })

/** Date and time with its offset, as in 2026-05-06T11:00:00+02:00 */
const dateTime = z.iso.datetime({ offset: true })

/** Logo in public/, shown as is */
const logo = z.object({
  src: z.string().regex(/^\/images\/.+\.svg$/, 'An SVG logo in public/images'),
  alt: z.string().min(1),
  /** Drawn in the text colour, for dark logos that would not show on the dark page */
  monochrome: z.boolean().default(false),
})

const edition = z.object({
  /** Facts for the Event JSON-LD of the edition */
  event: z.object({
    name: z.string().min(1),
    /** Also the meta description of the page */
    description: z.string().min(50).max(160),
    startDate: dateTime,
    endDate: dateTime,
    location: z.object({ name: z.string().min(1), address: z.string().min(1) }),
  }),
  hero: z.object({
    title: z.tuple([z.string().min(1), z.string().min(1)]),
    description: z.string().min(1),
    poster: image,
    stats: z.array(stat).max(4),
  }),
  /** Only shown while the status is registration */
  registration: z.object({
    action,
    deadline: dateTime,
    countdownLabel: z.string().min(1),
    closedLabel: z.string().min(1),
  }),
  competition: z.object({
    title: z.string().min(1),
    subtitle: z.string().optional(),
    gallery: z.object({ label: z.string().min(1), images: z.array(image).min(1) }).optional(),
  }),
  info: z.object({
    title: z.string().min(1),
    subtitle: z.string().optional(),
    cards: z.array(iconCard).min(1),
  }),
  schedule: z.object({
    title: z.string().min(1),
    subtitle: z.string().optional(),
    columns: z.object({
      date: z.string().min(1),
      time: z.string().min(1),
      event: z.string().min(1),
      location: z.string().min(1),
    }),
    items: z
      .array(
        z.object({
          date: z.string().min(1),
          time: z.string().min(1),
          icon: iconName,
          title: z.string().min(1),
          description: z.string().min(1),
          location: z.string().min(1),
          /** The final, highlighted in the accent colour */
          highlight: z.boolean().default(false),
        }),
      )
      .min(1),
  }),
  rules: z.object({
    title: z.string().min(1),
    subtitle: z.string().optional(),
    action,
    note: z.string().optional(),
  }),
  sponsors: z.object({
    title: z.string().min(1),
    subtitle: z.string().optional(),
    groups: z
      .array(
        z.object({
          title: z.string().min(1),
          size: z.enum(['large', 'small']),
          logos: z.array(logo).min(1),
        }),
      )
      .min(1),
    cta,
  }),
  faq: z.object({
    title: z.string().min(1),
    subtitle: z.string().optional(),
    topics: z
      .array(
        z.object({
          id: z.string().regex(/^[a-z0-9-]+$/, 'A slug'),
          title: z.string().min(1),
          items: z.array(faqItem).min(1),
        }),
      )
      .min(1),
    cta,
  }),
})

const registration = z.object({
  meta: z.object({ title: z.string().min(1), description: z.string().min(50).max(160) }),
  reminders: z.object({
    title: z.string().min(1),
    subtitle: z.string().optional(),
    cards: z.array(iconCard).min(1),
  }),
  form: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    /** Google Form URL ending in /viewform; the page adds ?embedded=true */
    url: z.url().regex(/^https:\/\/docs\.google\.com\/forms\/.+\/viewform$/, 'A Google Form'),
    frameTitle: z.string().min(1),
  }),
  steps: z.object({
    title: z.string().min(1),
    subtitle: z.string().optional(),
    items: z.array(iconCard).min(1),
    cta,
  }),
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
  /** The full edition page, shown while the status is registration or finished */
  edition,
  /** The registration page at /aessbot/inscripcio */
  registration,
})

export type Site = z.infer<typeof site>
export type Aessbot = z.infer<typeof aessbot>
export type AessbotEdition = Aessbot['edition']
export type AessbotRegistration = Aessbot['registration']
export type AessbotStatus = Aessbot['status']
export type Home = z.infer<typeof home>
export type Action = z.infer<typeof action>
export type ImageContent = z.infer<typeof image>
export type Stat = z.infer<typeof stat>
export type FaqItemContent = z.infer<typeof faqItem>
