import { ContentButton } from '~/components/buttons'
import { SectionHeader } from '~/components/content'
import { FaqList } from '~/components/faq'
import { ICONS } from '~/components/icons'
import { Section } from '~/components/layout'
import type { Home } from '~/content/schemas'
import styles from './Faq.module.css'

export function Faq({ faq }: { faq: Home['faq'] }) {
  return (
    <Section tone="alt" id="dubtes" labelledBy="dubtes-title">
      <SectionHeader id="dubtes-title" title={faq.title} subtitle={faq.subtitle} />
      <FaqList
        defaultOpen={0}
        items={faq.items.map((item) => ({
          question: item.question,
          answer: <p>{item.answer}</p>,
          icon: item.icon ? ICONS[item.icon] : undefined,
        }))}
      />
      <div className={styles.cta}>
        <p>{faq.cta.text}</p>
        <ContentButton action={faq.cta.action} size="small" />
      </div>
    </Section>
  )
}
