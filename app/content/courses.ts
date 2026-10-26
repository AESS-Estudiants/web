import data from './courses.json'
import { courses as schema } from './schemas'

export const courses = schema.parse(data)
