import { FeatureCard } from '~/components/cards'
import { SectionHeader } from '~/components/content'
import { ICONS } from '~/components/icons'
import { Section } from '~/components/layout'
import type { Projects } from '~/content/schemas'
import styles from './sections.module.css'

export function Active({ active }: { active: Projects['active'] }) {
  return (
    <Section id="en-curs" labelledBy="en-curs-title">
      <SectionHeader
        id="en-curs-title"
        title={active.title}
        subtitle={active.subtitle}
        className={styles.header}
      />
      <div className={styles.grid}>
        {active.items.map((project) => (
          <FeatureCard
            key={project.title}
            icon={ICONS[project.icon]}
            eyebrow={project.status}
            title={project.title}
          >
            <p>{project.body}</p>
            <p>
              <strong className={styles.state}>{project.state.label}</strong> {project.state.value}
            </p>
          </FeatureCard>
        ))}
      </div>
    </Section>
  )
}
