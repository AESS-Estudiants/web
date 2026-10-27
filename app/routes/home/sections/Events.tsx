import { ContentButton } from '~/components/buttons'
import { EventBanner } from '~/components/cards'
import { SectionHeader, Stats } from '~/components/content'
import { ICONS } from '~/components/icons'
import { Section } from '~/components/layout'
import { Picture } from '~/components/media'
import type { Home } from '~/content/schemas'
import { picture } from '~/lib/images'
import styles from './Events.module.css'

export function Events({ events }: { events: Home['events'] }) {
  return (
    <Section id="esdeveniments" labelledBy="esdeveniments-title">
      <SectionHeader id="esdeveniments-title" title={events.title} />
      <div className={styles.list}>
        {events.items.map((event) => (
          <EventBanner
            key={event.title}
            tag={event.tag}
            title={event.title}
            as="h3"
            poster={
              <Picture
                src={picture(event.poster.src)}
                alt={event.poster.alt}
                sizes="(min-width: 1024px) 260px, 100vw"
              />
            }
            stats={
              <Stats stats={event.stats.map((stat) => ({ ...stat, icon: ICONS[stat.icon] }))} />
            }
            actions={event.actions.map((action) => (
              <ContentButton key={action.label} action={action} size="small" />
            ))}
          >
            <p>{event.body}</p>
          </EventBanner>
        ))}
      </div>
    </Section>
  )
}
