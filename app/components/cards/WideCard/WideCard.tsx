import type { LucideIcon } from 'lucide-react'
import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { Icon } from '~/components/icons'
import { cx } from '~/lib/cx'
import card from '../card.module.css'
import styles from './WideCard.module.css'

type WideCardProps = {
  icon: LucideIcon
  eyebrow: string
  title: string
  children: ReactNode
  /** Link at the bottom; the whole card becomes clickable */
  link?: { label: string; to: string }
  as?: 'h2' | 'h3'
  className?: string
}

export function WideCard({
  icon,
  eyebrow,
  title,
  children,
  link,
  as: Heading = 'h2',
  className,
}: WideCardProps) {
  return (
    <article className={cx(styles.card, link && card.interactive, className)}>
      <span className={card.iconBox}>
        <Icon icon={icon} size={22} />
      </span>
      <p className={card.eyebrow}>{eyebrow}</p>
      <Heading className={styles.title}>{title}</Heading>
      <div className={cx(card.body, styles.body)}>{children}</div>
      {link && (
        <Link to={link.to} className={cx(styles.link, card.stretched)}>
          {link.label}
          <Icon icon={ArrowRight} size={16} />
        </Link>
      )}
    </article>
  )
}
