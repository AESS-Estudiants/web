import type { Site } from './schemas'
import data from './site.json'

// Checked against its schema at build time (see validate.ts), so zod stays out of the browser
export const site = data as Site

export type SocialNetwork = (typeof site.socials)[number]['network']
