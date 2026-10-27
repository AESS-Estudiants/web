import data from './join.json'
import type { Join } from './schemas'

// Checked against its schema at build time (see validate.ts), so zod stays out of the browser
export const join = data as Join
