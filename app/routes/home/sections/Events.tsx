import { ContentButton } from '~/components/buttons'
import { EventBanner } from '~/components/cards'
import { SectionHeader, Stats } from '~/components/content'
import { ICONS } from '~/components/icons'
import { Section } from '~/components/layout'
import { Picture } from '~/components/media'
import {
  AESSBOT_REGISTRATION_PATH,
  aessbotRegistration,
  useRegistrationOpen,
} from '~/content/aessbot-registration'
import type { Home } from '~/content/schemas'
import { isHiddenPath } from '~/content/site'
import { picture } from '~/lib/images'
import styles from './Events.module.css'

type Action = Home['events']['items'][number]['actions'][number]

/** An event whose page is switched off in site.json (hiddenPaths) is left out with it */
function linksToHiddenPage(event: Home['events']['items'][number]) {
  return event.actions.some((action) => action.to !== undefined && isHiddenPath(action.to))
}

function linksToRegistration(action: Action) {
  return action.to?.split(/[?#]/)[0] === AESSBOT_REGISTRATION_PATH
}

export function Events({ events }: { events: Home['events'] }) {
  // A button to the AESSBot registration page only shows while registration is open
  const registrationOpen = useRegistrationOpen(aessbotRegistration)
  const items = events.items.filter((event) => !linksToHiddenPage(event))
  if (items.length === 0) return null

  return (
    <Section id="esdeveniments" labelledBy="esdeveniments-title">
      <SectionHeader id="esdeveniments-title" title={events.title} />
      <div className={styles.list}>
        {items.map((event) => (
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
            actions={event.actions
              .filter((action) => registrationOpen || !linksToRegistration(action))
              .map((action) => <ContentButton key={action.label} action={action} size="small" />)}
          >
            <p>{event.body}</p>
          </EventBanner>
        ))}
      </div>
    </Section>
  )
}
