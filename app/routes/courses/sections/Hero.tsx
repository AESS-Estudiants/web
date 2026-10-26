import { Stats } from '~/components/content'
import { ICONS } from '~/components/icons'
import { Picture } from '~/components/media'
import type { Courses } from '~/content/schemas'
import { picture } from '~/lib/images'
import styles from './Hero.module.css'

export function Hero({ hero }: { hero: Courses['hero'] }) {
  return (
    <section className={styles.hero} aria-labelledby="cursos-title">
      <div className={styles.inner}>
        <div className={styles.text}>
          <h1 id="cursos-title" className={styles.title}>
            {hero.title}
          </h1>
          <p className={styles.description}>{hero.description}</p>
          <Stats stats={hero.stats.map((stat) => ({ ...stat, icon: ICONS[stat.icon] }))} />
        </div>
        <Picture
          src={picture(hero.poster.src)}
          alt={hero.poster.alt}
          sizes="(min-width: 1024px) 380px, 100vw"
          priority
          className={styles.poster}
        />
      </div>
    </section>
  )
}
