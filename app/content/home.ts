import data from './home.json'
import { home as schema } from './schemas'

export const home = schema.parse(data)
