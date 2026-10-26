import { SectionHeader } from '~/components/content'
import { Section } from '~/components/layout'
import { EditionsPlayer } from '~/components/media'
import type { Aessbot } from '~/content/schemas'

export function Editions({ editions }: { editions: Aessbot['editions'] }) {
  return (
    <Section tone="alt" id="edicions" labelledBy="edicions-title">
      <SectionHeader id="edicions-title" title={editions.title} subtitle={editions.subtitle} />
      <EditionsPlayer editions={editions.items} />
    </Section>
  )
}
