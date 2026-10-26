import { FeatureCard } from '~/components/cards'
import { SectionHeader } from '~/components/content'
import { ICONS } from '~/components/icons'
import { Section } from '~/components/layout'
import type { Projects } from '~/content/schemas'
import styles from './sections.module.css'

export function Activities({ activities }: { activities: Projects['activities'] }) {
  return (
    <Section tone="alt" id="tambe-participem" labelledBy="tambe-participem-title">
      <SectionHeader
        id="tambe-participem-title"
        title={activities.title}
        subtitle={activities.subtitle}
        className={styles.header}
      />
      <div className={styles.pair}>
        {activities.items.map((activity) => (
          <FeatureCard key={activity.title} icon={ICONS[activity.icon]} title={activity.title}>
            <p>{activity.body}</p>
          </FeatureCard>
        ))}
      </div>
    </Section>
  )
}
