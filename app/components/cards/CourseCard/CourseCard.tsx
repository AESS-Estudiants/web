import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Icon } from '~/components/icons'
import { cx } from '~/lib/cx'
import styles from './CourseCard.module.css'

export type CourseDetail = { icon: LucideIcon; label: string; value: string }

type CourseCardProps = {
  /** Logo of the course, shown whole inside a framed box */
  logo: ReactNode
  title: string
  /** Short description, one or more paragraphs */
  children: ReactNode
  /** Key facts, each with its icon and a bold label */
  details: CourseDetail[]
  /** Buttons at the bottom, stacked and full width */
  actions: ReactNode
  as?: 'h2' | 'h3'
  className?: string
}

export function CourseCard({
  logo,
  title,
  children,
  details,
  actions,
  as: Heading = 'h3',
  className,
}: CourseCardProps) {
  return (
    <article className={cx(styles.card, className)}>
      <div className={styles.logo}>{logo}</div>
      <div className={styles.text}>
        <Heading className={styles.title}>{title}</Heading>
        <div className={styles.description}>{children}</div>
      </div>
      <ul className={styles.details}>
        {details.map((detail) => (
          <li key={detail.label} className={styles.detail}>
            <span className={styles.iconWrap}>
              <Icon icon={detail.icon} size={16} className={styles.icon} />
            </span>
            <p>
              <strong className={styles.label}>{detail.label}:</strong> {detail.value}
            </p>
          </li>
        ))}
      </ul>
      <div className={styles.actions}>{actions}</div>
    </article>
  )
}
