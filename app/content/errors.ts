import data from './errors.json'
import { errors as schema } from './schemas'

export const errors = schema.parse(data)
