import { Link } from 'react-router'
import cube from '~/assets/images/aess-cube.svg'
import { cx } from '~/lib/cx'
import styles from './Logo.module.css'

type LogoProps = { className?: string }

export function Logo({ className }: LogoProps) {
  return (
    <Link to="/" className={cx(styles.logo, className)}>
      <span className={styles.cube} style={{ maskImage: `url(${cube})` }} aria-hidden />
      <span className={styles.wordmark}>
        <span className={styles.name}>AESS</span> <span className={styles.sub}>Estudiants</span>
        <span className="visually-hidden">, inici</span>
      </span>
    </Link>
  )
}
