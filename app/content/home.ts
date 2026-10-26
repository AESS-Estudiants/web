import data from './home.json'
import type { Home } from './schemas'

// Checked against its schema at build time (see validate.ts), so zod stays out of the browser
export const home = data as Home
