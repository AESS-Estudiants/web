import { ContentButton } from '~/components/buttons'
import { SectionHeader } from '~/components/content'
import { ICONS, Icon } from '~/components/icons'
import { Section } from '~/components/layout'
import type { Join } from '~/content/schemas'
import styles from './Options.module.css'

export function Options({ options }: { options: Join['options'] }) {
  return (
    <Section tone="alt" id="com-comencar" labelledBy="com-comencar-title">
      <SectionHeader
        id="com-comencar-title"
        title={options.title}
        subtitle={options.subtitle}
        className={styles.header}
      />
      <div className={styles.grid}>
        {options.items.map((option) => (
          <article key={option.title} className={styles.card}>
            <span className={styles.iconBox}>
              <Icon icon={ICONS[option.icon]} size={22} />
            </span>
            <p className={styles.eyebrow}>{option.eyebrow}</p>
            <h3 className={styles.title}>{option.title}</h3>
            <p className={styles.body}>{option.body}</p>
            <div className={styles.details}>
              {option.steps && (
                <ol className={styles.list}>
                  {option.steps.map((step, index) => (
                    <li key={step} className={styles.row}>
                      <span className={styles.number} aria-hidden>
                        {index + 1}.
                      </span>
                      <span className={styles.text}>{step}</span>
                    </li>
                  ))}
                </ol>
              )}
              {option.details && (
                <ul className={styles.list}>
                  {option.details.map((detail) => (
                    <li key={detail.label} className={styles.row}>
                      <span className={styles.detailIcon}>
                        <Icon icon={ICONS[detail.icon]} size={18} />
                      </span>
                      <span className={styles.detail}>{detail.label}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <ContentButton action={option.action} size="small" className={styles.action} />
          </article>
        ))}
      </div>
    </Section>
  )
}
