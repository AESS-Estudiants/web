import { describe, expect, it } from 'vitest'
import { site as schema } from './schemas'
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

describe('join content', () => {
  it('matches its schema and every option leads somewhere outside the site', async () => {
    const { join } = await import('./join')
    expect(join.options.items.length).toBeGreaterThan(0)
    for (const option of join.options.items) expect(option.action.href).toMatch(/^https:\/\//)
  })

  it('gives each option either steps or details', async () => {
    const { join } = await import('./join')
    for (const option of join.options.items) {
      expect(Boolean(option.steps?.length) || Boolean(option.details?.length)).toBe(true)
    }
  })
})
