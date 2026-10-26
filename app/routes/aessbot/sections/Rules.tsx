import { ContentButton } from '~/components/buttons'
import { SectionHeader } from '~/components/content'
import { Section } from '~/components/layout'
import type { AessbotEdition } from '~/content/schemas'
import styles from './Rules.module.css'

export function Rules({ rules }: { rules: AessbotEdition['rules'] }) {
  return (
    <Section id="normativa" labelledBy="normativa-title">
      <SectionHeader id="normativa-title" title={rules.title} subtitle={rules.subtitle} />
      <div className={styles.download}>
        <ContentButton action={rules.action} />
        {rules.note && <p className={styles.note}>{rules.note}</p>}
      </div>
    </Section>
  )
}
