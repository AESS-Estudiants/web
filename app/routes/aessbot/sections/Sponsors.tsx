import { SectionHeader } from '~/components/content'
import { Section } from '~/components/layout'
import type { AessbotEdition } from '~/content/schemas'
import { cx } from '~/lib/cx'
import { SectionCta } from './SectionCta'
import styles from './Sponsors.module.css'

export function Sponsors({ sponsors }: { sponsors: AessbotEdition['sponsors'] }) {
  return (
    <Section tone="alt" id="patrocinadors" labelledBy="patrocinadors-title">
      <SectionHeader id="patrocinadors-title" title={sponsors.title} subtitle={sponsors.subtitle} />
      <div className={styles.groups}>
        {sponsors.groups.map((group) => (
          <div key={group.title} className={styles.group}>
            <h3 className={styles.groupTitle}>{group.title}</h3>
            <ul className={styles.logos}>
              {group.logos.map((logo) => (
                <li key={logo.src} className={cx(styles.logo, styles[group.size])}>
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    loading="lazy"
                    decoding="async"
                    className={cx(logo.monochrome && styles.monochrome)}
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <SectionCta cta={sponsors.cta} large />
    </Section>
  )
}
