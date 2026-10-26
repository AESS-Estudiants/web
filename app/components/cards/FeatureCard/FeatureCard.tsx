import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { Icon } from '~/components/icons'
import { cx } from '~/lib/cx'
import card from '../card.module.css'
import styles from './FeatureCard.module.css'

type FeatureCardProps = {
  icon: LucideIcon
  eyebrow: string
  title: string
  /** One or more paragraphs */
  children: ReactNode
  /** Makes the whole card a link to this route */
  to?: string
  as?: 'h2' | 'h3'
  className?: string
}

export function FeatureCard({
  icon,
  eyebrow,
  title,
  children,
  to,
  as: Heading = 'h3',
  className,
}: FeatureCardProps) {
  return (
    <article className={cx(styles.card, to && card.interactive, className)}>
      <span className={card.iconBox}>
        <Icon icon={icon} size={22} />
      </span>
      <p className={card.eyebrow}>{eyebrow}</p>
      <Heading className={styles.title}>
        {to ? (
          <Link to={to} className={card.stretched}>
            {title}
          </Link>
        ) : (
          title
        )}
      </Heading>
      <div className={cx(card.body, styles.body)}>{children}</div>
    </article>
  )
}
