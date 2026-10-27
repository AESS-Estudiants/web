import data from './contact.json'
import type { Contact } from './schemas'

// Checked against its schema at build time (see validate.ts), so zod stays out of the browser
export const contact = data as Contact
