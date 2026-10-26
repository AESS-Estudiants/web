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
