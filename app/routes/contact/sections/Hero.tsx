import cube from '~/assets/images/aess-cube.svg'
import type { Contact } from '~/content/schemas'
import styles from './Hero.module.css'

export function Hero({ hero }: { hero: Contact['hero'] }) {
  return (
    <section className={styles.hero} aria-labelledby="contacte-title">
      <div className={styles.inner}>
        <div className={styles.text}>
          <h1 id="contacte-title" className={styles.title}>
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
