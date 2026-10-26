// Kept apart from seo.ts so the AESSBot content isn't bundled into every page
// The raw file, not the parsed content, so the end-to-end tests can import this module too
import aessbot from '../content/aessbot.json' with { type: 'json' }

/** The AESSBot registration page only exists for search engines while registration is open */
export const AESSBOT_REGISTRATION_INDEXED = aessbot.status === 'registration'

// Pages listed in the sitemap, in menu order
export const INDEXED_PATHS = [
  '/',
  '/aessbot',
  ...(AESSBOT_REGISTRATION_INDEXED ? ['/aessbot/inscripcio'] : []),
  '/cursos',
  '/projectes',
  '/uneix-te',
  '/contacte',
]
