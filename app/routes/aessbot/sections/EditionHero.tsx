import { ContentButton } from '~/components/buttons'
import { Countdown, Stats } from '~/components/content'
import { ICONS } from '~/components/icons'
import { Picture } from '~/components/media'
import type { AessbotEdition } from '~/content/schemas'
import { picture } from '~/lib/images'
import styles from './EditionHero.module.css'

type EditionHeroProps = {
  hero: AessbotEdition['hero']
  /** Registration button and countdown, only while registration is open */
  registration?: AessbotEdition['registration']
}

export function EditionHero({ hero, registration }: EditionHeroProps) {
  const [name, year] = hero.title
  return (
    <section className={styles.hero} aria-labelledby="aessbot-title">
      <div className={styles.inner}>
        <div className={styles.text}>
          <h1 id="aessbot-title" className={styles.title}>
            {name} {year}
          </h1>
          <p className={styles.description}>{hero.description}</p>
          {registration && (
            <div className={styles.registration}>
              <ContentButton action={registration.action} className={styles.action} />
              <Countdown
                deadline={registration.deadline}
                label={registration.countdownLabel}
                closedLabel={registration.closedLabel}
              />
            </div>
          )}
          <Stats stats={hero.stats.map((stat) => ({ ...stat, icon: ICONS[stat.icon] }))} />
        </div>
        <div className={styles.poster}>
          <Picture
            src={picture(hero.poster.src)}
            alt={hero.poster.alt}
            sizes="(min-width: 1024px) 380px, 100vw"
            priority
          />
        </div>
      </div>
    </section>
  )
}
