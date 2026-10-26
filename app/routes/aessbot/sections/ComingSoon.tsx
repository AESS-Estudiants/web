import { Calendar } from 'lucide-react'
import { ContentButton } from '~/components/buttons'
import { Icon } from '~/components/icons'
import type { Aessbot } from '~/content/schemas'
import { SumoGame } from '~/features/sumo-game'
import styles from './ComingSoon.module.css'

export function ComingSoon({ content }: { content: Aessbot['comingSoon'] }) {
  const [name, year] = content.title
  return (
    <section className={styles.soon} aria-labelledby="aessbot-title">
      <div className={styles.inner}>
        <div className={styles.content}>
          <p className={styles.badge}>
            <Icon icon={Calendar} size={16} />
            {content.badge}
          </p>
          <h1 id="aessbot-title" className={styles.title}>
            {name} <span className={styles.year}>{year}</span>
          </h1>
          <p className={styles.text}>{content.description}</p>
          <div className={styles.actions}>
            {content.actions.map((action) => (
              <ContentButton key={action.label} action={action} className={styles.action} />
            ))}
          </div>
          {content.note && <p className={styles.note}>{content.note}</p>}
        </div>
        <div className={styles.game}>
          <SumoGame />
        </div>
      </div>
    </section>
  )
}
