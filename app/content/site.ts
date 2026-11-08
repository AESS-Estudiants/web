import type { Site } from './schemas'
import data from './site.json'

// Checked against its schema at build time (see validate.ts), so zod stays out of the browser
export const site = data as Site

export type SocialNetwork = (typeof site.socials)[number]['network']

/** Whether a link leads to a page switched off in site.json (hiddenPaths) */
export function isHiddenPath(to: string) {
  const [path = ''] = to.split(/[?#]/)
  return site.hiddenPaths.includes(path)
}

/** Menu entries, without the pages switched off for now */
export const navigation = site.navigation.filter((link) => !isHiddenPath(link.to))
