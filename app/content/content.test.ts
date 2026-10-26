import { existsSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import aessbotData from './aessbot.json'
import { aessbot as aessbotSchema, site as schema } from './schemas'
import data from './site.json'

describe('site content', () => {
  it('matches its schema', () => {
    expect(() => schema.parse(data)).not.toThrow()
  })

  it('only links to existing routes in the navigation', () => {
    const routes = ['/', '/aessbot', '/cursos', '/projectes', '/uneix-te', '/contacte']
    for (const link of [...data.navigation, data.join]) expect(routes).toContain(link.to)
  })
})

describe('schemas', () => {
  it('rejects a route without a leading slash', () => {
    const broken = { ...data, join: { label: 'Fes-te membre', to: 'uneix-te' } }
    expect(schema.safeParse(broken).success).toBe(false)
  })
})

describe('home content', () => {
  it('matches its schema and only uses existing photos', async () => {
    const { home } = await import('./home')
    const { IMAGE_PATHS } = await import('~/lib/images')
    const photos = [
      ...home.about.gallery.images,
      ...home.events.items.map((event) => event.poster),
    ].map((image) => image.src)
    for (const photo of photos) expect(IMAGE_PATHS).toContain(photo)
  })
})

describe('aessbot content', () => {
  it('matches its schema and only uses existing photos and logos', async () => {
    const { aessbot } = await import('./aessbot')
    const { IMAGE_PATHS } = await import('~/lib/images')
    const { edition } = aessbot
    const photos = [edition.hero.poster, ...(edition.competition.gallery?.images ?? [])]
    for (const photo of photos) expect(IMAGE_PATHS).toContain(photo.src)
    const logos = edition.sponsors.groups.flatMap((group) => group.logos)
    for (const logo of logos) expect(existsSync(`public${logo.src}`)).toBe(true)
  })

  it('links the registration button to its page and the rules to an existing file', async () => {
    const { aessbot } = await import('./aessbot')
    expect(aessbot.edition.registration.action.to).toBe('/aessbot/inscripcio')
    expect(existsSync(`public${aessbot.edition.rules.action.href}`)).toBe(true)
  })

  it('gives every FAQ topic its own id', async () => {
    const { aessbot } = await import('./aessbot')
    const ids = aessbot.edition.faq.topics.map((topic) => topic.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('rejects a registration form that is not a Google Form', () => {
    const broken = {
      ...aessbotData,
      registration: {
        ...aessbotData.registration,
        form: { ...aessbotData.registration.form, url: 'https://example.com/form' },
      },
    }
    expect(aessbotSchema.safeParse(broken).success).toBe(false)
  })
})
