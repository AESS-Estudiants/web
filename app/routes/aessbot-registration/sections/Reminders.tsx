import { SectionHeader } from '~/components/content'
import { Section } from '~/components/layout'
import type { AessbotRegistration } from '~/content/schemas'
import { CardGrid } from '~/routes/aessbot/sections/CardGrid'

// First section of the page, so its title is the h1
export function Reminders({ reminders }: { reminders: AessbotRegistration['reminders'] }) {
  return (
    <Section id="recordatoris" labelledBy="recordatoris-title">
      <SectionHeader
        as="h1"
        id="recordatoris-title"
        title={reminders.title}
        subtitle={reminders.subtitle}
      />
      <CardGrid cards={reminders.cards} />
    </Section>
  )
}
