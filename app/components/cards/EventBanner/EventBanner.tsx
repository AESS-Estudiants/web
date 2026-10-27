import type { ReactNode } from 'react'
import { Tag } from '~/components/content'
import { cx } from '~/lib/cx'
import styles from './EventBanner.module.css'

type EventBannerProps = {
  tag: string
  title: string
  children: ReactNode
  /** Poster image, cropped to fill its slot */
  poster: ReactNode
  /** Key figures, usually a <Stats /> */
  stats?: ReactNode
  /** Buttons */
  actions?: ReactNode
  as?: 'h2' | 'h3'
  className?: string
}

export function EventBanner({
  tag,
  title,
  children,
  poster,
  stats,
  actions,
  as: Heading = 'h2',
  className,
}: EventBannerProps) {
  return (
    <article className={cx(styles.banner, className)}>
      <div className={styles.poster}>{poster}</div>
      <div className={styles.content}>
        <Tag>{tag}</Tag>
        <Heading className={styles.title}>{title}</Heading>
        <div className={styles.body}>{children}</div>
        {stats}
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
    </article>
  )
}
