import data from './projects.json'
import { projects as schema } from './schemas'

export const projects = schema.parse(data)
