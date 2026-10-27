import cube from '~/assets/images/aess-cube.svg'
import { ContentButton } from '~/components/buttons'
import { Badge } from '~/components/content'
import { ICONS } from '~/components/icons'
import type { Home } from '~/content/schemas'
import styles from './Hero.module.css'

export function Hero({ hero }: { hero: Home['hero'] }) {
  const [accent, rest] = hero.title
  return (
    <section className={styles.hero} aria-labelledby="inici-title">
      <div className={styles.inner}>
        <div className={styles.text}>
          {hero.badge && <Badge icon={ICONS[hero.badge.icon]}>{hero.badge.label}</Badge>}
          <h1 id="inici-title" className={styles.title}>
            <span className={styles.accent}>{accent}</span> <span>{rest}</span>
          </h1>
          <p className={styles.description}>{hero.description}</p>
          <div className={styles.actions}>
            {hero.actions.map((action) => (
              <ContentButton key={action.label} action={action} className={styles.action} />
            ))}
          </div>
        </div>
        <div className={styles.visual} aria-hidden>
          <span className={styles.logo} style={{ maskImage: `url(${cube})` }} />
        </div>
      </div>
    </section>
  )
}
