import data from './aessbot.json'
import { aessbot as schema } from './schemas'

export const aessbot = schema.parse(data)
