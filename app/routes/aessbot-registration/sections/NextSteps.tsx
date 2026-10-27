import { RichText, SectionHeader } from '~/components/content'
import { ICONS, Icon } from '~/components/icons'
import { Section } from '~/components/layout'
import type { AessbotRegistration } from '~/content/schemas'
import { SectionCta } from '~/routes/aessbot/sections/SectionCta'
import styles from './NextSteps.module.css'

export function NextSteps({ steps }: { steps: AessbotRegistration['steps'] }) {
  return (
    <Section id="despres-inscripcio" labelledBy="despres-inscripcio-title">
      <SectionHeader id="despres-inscripcio-title" title={steps.title} subtitle={steps.subtitle} />
      <ol className={styles.timeline}>
        {steps.items.map((step) => (
          <li key={step.title} className={styles.step}>
            <span className={styles.marker}>
              <Icon icon={ICONS[step.icon]} size={22} />
            </span>
            <div className={styles.content}>
              <h3 className={styles.title}>{step.title}</h3>
              <p className={styles.body}>
                <RichText>{step.body}</RichText>
              </p>
            </div>
          </li>
        ))}
      </ol>
      <SectionCta cta={steps.cta} large />
    </Section>
  )
}
