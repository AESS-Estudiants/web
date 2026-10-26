import { SectionHeader } from '~/components/content'
import { ICONS, Icon } from '~/components/icons'
import { Section } from '~/components/layout'
import { MapEmbed } from '~/components/media'
import type { Contact } from '~/content/schemas'
import styles from './Location.module.css'

export function Location({ location }: { location: Contact['location'] }) {
  return (
    <Section tone="alt" id="com-arribar" labelledBy="com-arribar-title">
      <SectionHeader id="com-arribar-title" title={location.title} subtitle={location.subtitle} />
      <div className={styles.content}>
        <ul className={styles.cards}>
          {location.cards.map((card) => (
            <li key={card.title} className={styles.card}>
              <span className={styles.iconBox}>
                <Icon icon={ICONS[card.icon]} size={22} />
              </span>
              <div className={styles.text}>
                <h3 className={styles.title}>{card.title}</h3>
                <p className={styles.body}>
                  {card.lines.map((line, index) => (
                    <span key={typeof line === 'string' ? line : line.label}>
                      {index > 0 && <br />}
                      {typeof line === 'string' ? (
                        line
                      ) : (
                        <>
                          <strong className={styles.strong}>{line.label}</strong> {line.text}
                        </>
                      )}
                    </span>
                  ))}
                </p>
              </div>
            </li>
          ))}
        </ul>
        <MapEmbed
          src={location.map.src}
          title={location.map.title}
          label={location.map.label}
          className={styles.map}
        />
      </div>
    </Section>
  )
}
