import { ICONS, Icon } from '~/components/icons'
import { Section } from '~/components/layout'
import type { Join } from '~/content/schemas'
import styles from './Visit.module.css'

export function Visit({ visit }: { visit: Join['visit'] }) {
  return (
    <Section id="que-trobaras" labelledBy="que-trobaras-title">
      <div className={styles.panel}>
        <div className={styles.text}>
          <p className={styles.eyebrow}>{visit.eyebrow}</p>
          <h2 id="que-trobaras-title" className={styles.title}>
            {visit.title}
          </h2>
          <p className={styles.body}>{visit.body}</p>
        </div>
        <ul className={styles.list}>
          {visit.highlights.map((highlight) => (
            <li key={highlight.label} className={styles.item}>
              <Icon icon={ICONS[highlight.icon]} size={20} className={styles.icon} />
              {highlight.label}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
