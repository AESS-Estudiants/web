import { writeFileSync } from 'node:fs'
import { buildCss, readTokens, TOKENS_CSS } from './tokens.mjs'

writeFileSync(TOKENS_CSS, buildCss(readTokens('design-tokens')))
console.log(`Wrote ${TOKENS_CSS}`)
