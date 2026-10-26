import data from './contact.json'
import { contact as schema } from './schemas'

export const contact = schema.parse(data)
