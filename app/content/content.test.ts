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
