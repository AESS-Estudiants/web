import { ContentButton } from '~/components/buttons'
import type { Action } from '~/content/schemas'
import { cx } from '~/lib/cx'
import styles from './SectionCta.module.css'

type SectionCtaProps = {
  cta: { text: string; action: Action }
  /** Larger text, as under the sponsors and the registration steps */
  large?: boolean
}

// Sentence and button that close a section
export function SectionCta({ cta, large = false }: SectionCtaProps) {
  return (
    <div className={cx(styles.cta, large && styles.large)}>
      <p>{cta.text}</p>
      <ContentButton action={cta.action} size="small" />
    </div>
  )
}
