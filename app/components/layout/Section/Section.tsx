import type { ReactNode } from 'react'
import { cx } from '~/lib/cx'
import styles from './Section.module.css'

type SectionProps = {
  /** Alternate bands use the slightly lighter background */
  tone?: 'page' | 'alt'
  id?: string
  /** Id of the heading that names the section */
  labelledBy?: string
  className?: string
  children: ReactNode
}

// Full-width band with the page column inside, like every section in Figma
export function Section({ tone = 'page', id, labelledBy, className, children }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cx(styles.section, tone === 'alt' && styles.alt)}
    >
      <div className={cx(styles.inner, className)}>{children}</div>
    </section>
  )
}
