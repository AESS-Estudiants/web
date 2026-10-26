import { describe, expect, it } from 'vitest'
import { buildCss, findViolations, readTokens } from './tokens.mjs'

const css = buildCss(readTokens('design-tokens'))

describe('buildCss', () => {
  it('resolves semantic colours to their primitive value', () => {
    expect(css).toContain('--bg-page: #0f1020; /* ink-950 */')
    expect(css).toContain('--accent-tint-10: #a9bdd11a; /* alpha-blue-300-10 */')
  })

  it('does not expose primitives', () => {
    expect(css).not.toMatch(/--ink-\d/)
    expect(css).not.toMatch(/--steel-\d/)
  })

  it('writes typography as a font shorthand in rem plus tracking', () => {
    expect(css).toContain('--font-display-hero: 900 6rem/1 var(--font-sans);')
    expect(css).toContain('--tracking-display-hero: -0.03em;')
    expect(css).toContain('--tracking-body-default: 0;')
  })

  it('writes spacing, radius and shadows', () => {
    expect(css).toContain('--space-16: 16px;')
    expect(css).toContain('--radius-lg: 16px;')
    expect(css).toContain('--shadow-floating: 0px 8px 24px 0px #00000059;')
  })
})

describe('findViolations', () => {
  const tokens = ':root { --bg-page: #0f1020; }'
  const check = (content) => findViolations([{ path: 'a.css', content }], tokens)

  it('accepts semantic tokens and locally declared variables', () => {
    expect(check('.a { --size: 4px; color: var(--bg-page); width: var(--size); }')).toEqual([])
  })

  it('rejects hardcoded colours', () => {
    expect(check('.a { color: #fff; }')).toEqual([
      'a.css:1 hardcoded colour "#fff", use a semantic token',
    ])
    expect(check('.a {\n  background: rgba(0, 0, 0, 0.5);\n}')).toHaveLength(1)
  })

  it('rejects unknown variables', () => {
    expect(check('.a { color: var(--ink-950); }')).toEqual(['a.css:1 unknown variable --ink-950'])
  })

  it('accepts variables set at runtime by Radix', () => {
    expect(check('.a { height: var(--radix-accordion-content-height); }')).toEqual([])
  })

  it('ignores comments', () => {
    expect(check('/* #fff var(--nope) */ .a { color: var(--bg-page); }')).toEqual([])
  })
})
