import data from './courses.json'
import type { Courses } from './schemas'

// Checked against its schema at build time (see validate.ts), so zod stays out of the browser
export const courses = data as Courses
