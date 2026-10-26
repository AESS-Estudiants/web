import { site as schema } from './schemas'
import data from './site.json'

// Validated at import, so a broken content file fails the build
export const site = schema.parse(data)

export type SocialNetwork = (typeof site.socials)[number]['network']
