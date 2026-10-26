import { globSync, readFileSync } from 'node:fs'
import { buildCss, findViolations, readTokens, TOKENS_CSS } from './tokens.mjs'

const tokensCss = readFileSync(TOKENS_CSS, 'utf8')
const problems = []

if (tokensCss !== buildCss(readTokens('design-tokens'))) {
  problems.push(`${TOKENS_CSS} is out of date, run \`pnpm tokens\``)
}

const files = globSync('app/**/*.css')
  .filter((path) => path !== TOKENS_CSS)
  .map((path) => ({ path, content: readFileSync(path, 'utf8') }))
problems.push(...findViolations(files, tokensCss))

if (problems.length > 0) {
  console.error(problems.join('\n'))
  process.exit(1)
}
