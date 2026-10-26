import type { ReactNode } from 'react'
import { TextLink } from '~/components/buttons'
import { cx } from '~/lib/cx'
import styles from './SectionHeader.module.css'

type SectionHeaderProps = {
  title: ReactNode
  subtitle?: ReactNode
  /** Optional "see all" link on the right */
  link?: { label: string; to: string }
  /** Heading level, h2 by default */
  as?: 'h1' | 'h2' | 'h3'
  id?: string
  className?: string
}

export function SectionHeader({
  title,
  subtitle,
  link,
  as: Heading = 'h2',
  id,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cx(styles.header, className)}>
      <div className={styles.text}>
        <Heading id={id} className={styles.title}>
          {title}
        </Heading>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      {link && (
        <TextLink to={link.to} arrow className={styles.link}>
          {link.label}
        </TextLink>
      )}
    </div>
  )
}
