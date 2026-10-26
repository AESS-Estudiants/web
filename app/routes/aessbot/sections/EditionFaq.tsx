import { SectionHeader } from '~/components/content'
import { FaqByTopic } from '~/components/faq'
import { ICONS } from '~/components/icons'
import { Section } from '~/components/layout'
import type { AessbotEdition } from '~/content/schemas'
import { SectionCta } from './SectionCta'

export function EditionFaq({ faq }: { faq: AessbotEdition['faq'] }) {
  return (
    <Section id="dubtes" labelledBy="dubtes-title">
      <SectionHeader id="dubtes-title" title={faq.title} subtitle={faq.subtitle} />
      <FaqByTopic
        topics={faq.topics.map((topic) => ({
          id: topic.id,
          title: topic.title,
          items: topic.items.map((item) => ({
            question: item.question,
            answer: <p>{item.answer}</p>,
            icon: item.icon ? ICONS[item.icon] : undefined,
          })),
        }))}
      />
      <SectionCta cta={faq.cta} />
    </Section>
  )
}
