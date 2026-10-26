import { SectionHeader } from '~/components/content'
import { Section } from '~/components/layout'
import type { AessbotEdition } from '~/content/schemas'
import { CardGrid } from './CardGrid'

export function Info({ info }: { info: AessbotEdition['info'] }) {
  return (
    <Section id="informacio" labelledBy="informacio-title">
      <SectionHeader id="informacio-title" title={info.title} subtitle={info.subtitle} />
      <CardGrid cards={info.cards} />
    </Section>
  )
}
