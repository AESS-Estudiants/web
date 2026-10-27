import data from './join.json'
import { join as schema } from './schemas'

export const join = schema.parse(data)
