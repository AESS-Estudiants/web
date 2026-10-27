import cube from '~/assets/images/aess-cube.svg'
import { Badge } from '~/components/content'
import type { Join } from '~/content/schemas'
import styles from './Hero.module.css'

export function Hero({ hero }: { hero: Join['hero'] }) {
  return (
    <section className={styles.hero} aria-labelledby="uneix-te-title">
      <div className={styles.inner}>
        <div className={styles.text}>
          {hero.badge && <Badge>{hero.badge}</Badge>}
          <h1 id="uneix-te-title" className={styles.title}>
            {hero.title}
          </h1>
          <p className={styles.description}>{hero.description}</p>
        </div>
        <div className={styles.visual} aria-hidden>
          <span className={styles.logo} style={{ maskImage: `url(${cube})` }} />
        </div>
      </div>
    </section>
  )
}
