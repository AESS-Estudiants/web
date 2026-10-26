import data from './errors.json'
import type { Errors } from './schemas'

// Checked against its schema at build time (see validate.ts), so zod stays out of the browser
export const errors = data as Errors
