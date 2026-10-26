import data from './aessbot.json'
import type { Aessbot } from './schemas'

// Checked against its schema at build time (see validate.ts), so zod stays out of the browser
export const aessbot = data as Aessbot
