import { z } from 'zod'
import aessbotData from './aessbot.json'
import contactData from './contact.json'
import coursesData from './courses.json'
import errorsData from './errors.json'
import homeData from './home.json'
import joinData from './join.json'
import projectsData from './projects.json'
import * as schemas from './schemas'
import siteData from './site.json'

const CONTENT = [
  ['site.json', schemas.site, siteData],
  ['home.json', schemas.home, homeData],
  ['aessbot.json', schemas.aessbot, aessbotData],
  ['contact.json', schemas.contact, contactData],
  ['courses.json', schemas.courses, coursesData],
  ['errors.json', schemas.errors, errorsData],
  ['join.json', schemas.join, joinData],
  ['projects.json', schemas.projects, projectsData],
] as const

/** Checks every content file against its schema; the build and the tests fail on any problem */
export function validateContent() {
  const problems: string[] = []
  for (const [file, schema, data] of CONTENT) {
    const result = schema.safeParse(data)
    if (!result.success) problems.push(`app/content/${file}\n${z.prettifyError(result.error)}`)
  }
  if (problems.length > 0) throw new Error(`Invalid content:\n\n${problems.join('\n\n')}`)
}
