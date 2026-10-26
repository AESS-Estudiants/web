import data from './projects.json'
import type { Projects } from './schemas'

// Checked against its schema at build time (see validate.ts), so zod stays out of the browser
export const projects = data as Projects
