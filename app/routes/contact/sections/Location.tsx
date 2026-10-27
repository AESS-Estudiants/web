import { ArrowUpRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { SectionHeader } from '~/components/content'
import { ICONS, Icon } from '~/components/icons'
import { Section } from '~/components/layout'
import { MapEmbed } from '~/components/media'
import type { Contact } from '~/content/schemas'
import { cx } from '~/lib/cx'
import styles from './Location.module.css'

export function Location({ location }: { location: Contact['location'] }) {
  return (
    <Section tone="alt" id="com-arribar" labelledBy="com-arribar-title">
      <SectionHeader id="com-arribar-title" title={location.title} subtitle={location.subtitle} />
      <div className={styles.content}>
        <ul className={styles.cards}>
          {location.cards.map((card) => (
            <li key={card.title}>
              <CardFrame href={card.href}>
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
                {card.href && <Icon icon={ArrowUpRight} size={20} className={styles.external} />}
              </CardFrame>
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

// A card with a link opens it in a new tab, so the whole card works as a button
function CardFrame({ href, children }: { href?: string; children: ReactNode }) {
  if (!href) return <div className={styles.card}>{children}</div>
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cx(styles.card, styles.cardLink)}
    >
      {children}
      <span className="visually-hidden">, s'obre a Google Maps en una pestanya nova</span>
    </a>
  )
}
