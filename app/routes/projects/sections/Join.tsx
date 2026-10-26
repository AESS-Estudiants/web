import { ContentButton } from '~/components/buttons'
import { Badge } from '~/components/content'
import { ICONS } from '~/components/icons'
import { Section } from '~/components/layout'
import type { Projects } from '~/content/schemas'
import styles from './Join.module.css'

export function Join({ join }: { join: Projects['join'] }) {
  return (
    <Section id="participa" labelledBy="participa-title">
      <div className={styles.card}>
        <Badge icon={ICONS[join.badge.icon]}>{join.badge.label}</Badge>
        <div className={styles.text}>
          <h2 id="participa-title" className={styles.title}>
            {join.title}
          </h2>
          <p className={styles.body}>{join.body}</p>
        </div>
        <ContentButton action={join.action} className={styles.action} />
      </div>
    </Section>
  )
}
