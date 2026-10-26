import { readFileSync } from 'node:fs'
import { join } from 'node:path'

export const TOKENS_CSS = 'app/styles/tokens.css'

const FONT_STACKS = {
  Inter: "'Inter Variable', system-ui, -apple-system, 'Segoe UI', sans-serif",
  'Departure Mono': "ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace",
}

const ROOT_FONT_SIZE = 16

export function readTokens(dir) {
  const read = (name) => JSON.parse(readFileSync(join(dir, `${name}.json`), 'utf8'))
  return {
    primitives: read('primitives'),
    semantic: read('semantic'),
    spacing: read('spacing'),
    typography: read('typography'),
    elevation: read('elevation'),
  }
}

// Walks a DTCG tree and yields [path, token] for every leaf that has a $value
function* leaves(tree, path = []) {
  for (const [key, node] of Object.entries(tree)) {
    if (key.startsWith('$')) continue
    if (node && typeof node === 'object' && '$value' in node) yield [[...path, key], node]
    else yield* leaves(node, [...path, key])
  }
}

function resolveAlias(value, primitives) {
  const match = /^\{(.+)\}$/.exec(value)
  if (!match) return { value }
  const path = match[1].split('.')
  const target = path.reduce((node, key) => node?.[key], primitives)
  if (!target?.$value) throw new Error(`Unknown token reference ${value}`)
  return { value: target.$value, source: path.join('-') }
}

function rem(px) {
  return `${Number.parseFloat(px) / ROOT_FONT_SIZE}rem`
}

function hex(value) {
  return value.toLowerCase()
}

export function buildCss({ primitives, semantic, spacing, typography, elevation }) {
  const lines = []
  const section = (title) => lines.push('', `  /* ${title} */`)

  section('Colour (semantic only, primitives are resolved)')
  for (const [path, token] of leaves(semantic)) {
    const { value, source } = resolveAlias(token.$value, primitives)
    lines.push(`  --${path.join('-')}: ${hex(value)};${source ? ` /* ${source} */` : ''}`)
  }

  section('Font families')
  lines.push(`  --font-sans: ${FONT_STACKS.Inter};`)
  lines.push(`  --font-mono: ${FONT_STACKS['Departure Mono']};`)

  section('Typography: font shorthand plus tracking')
  for (const [path, token] of leaves(typography)) {
    const name = path.join('-')
    const { fontFamily, fontWeight, fontSize, lineHeight, letterSpacing } = token.$value
    const family = fontFamily === 'Inter' ? 'var(--font-sans)' : 'var(--font-mono)'
    lines.push(`  --font-${name}: ${fontWeight} ${rem(fontSize)}/${lineHeight} ${family};`)
    lines.push(`  --tracking-${name}: ${letterSpacing === '0em' ? '0' : letterSpacing};`)
  }

  section('Spacing and radius')
  for (const [path, token] of leaves(spacing)) lines.push(`  --${path.join('-')}: ${token.$value};`)

  section('Elevation')
  for (const [path, token] of leaves(elevation)) {
    const { offsetX, offsetY, blur, spread, color } = token.$value
    lines.push(
      `  --shadow-${path.join('-')}: ${offsetX} ${offsetY} ${blur} ${spread} ${hex(color)};`,
    )
  }

  return [
    '/* Generated from design-tokens/ by `pnpm tokens`. Do not edit by hand. */',
    '',
    ':root {',
    ...lines.slice(1),
    '}',
    '',
  ].join('\n')
}

const COLOUR_LITERAL = /#[0-9a-f]{3,8}\b|\b(?:rgba?|hsla?|oklch|oklab|lab|lch)\(/i
const VAR_USE = /var\(\s*(--[\w-]+)/g
const VAR_DECLARATION = /(--[\w-]+)\s*:/g
// Variables that libraries set at runtime
const RUNTIME_VARIABLE = /^--radix-/

// Returns the problems found in a set of stylesheets: hardcoded colours and unknown variables
export function findViolations(files, tokensCss) {
  const defined = new Set([...tokensCss.matchAll(VAR_DECLARATION)].map((m) => m[1]))
  for (const { content } of files) {
    for (const m of content.matchAll(VAR_DECLARATION)) defined.add(m[1])
  }

  const problems = []
  for (const { path, content } of files) {
    const lines = content.replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, ' ')).split('\n')
    lines.forEach((line, i) => {
      const where = `${path}:${i + 1}`
      const colour = COLOUR_LITERAL.exec(line)
      if (colour) problems.push(`${where} hardcoded colour "${colour[0]}", use a semantic token`)
      for (const m of line.matchAll(VAR_USE)) {
        if (!defined.has(m[1]) && !RUNTIME_VARIABLE.test(m[1]))
          problems.push(`${where} unknown variable ${m[1]}`)
      }
    })
  }
  return problems
}
