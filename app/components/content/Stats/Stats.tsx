import type { LucideIcon } from 'lucide-react'
import { Icon } from '~/components/icons'
import { cx } from '~/lib/cx'
import styles from './Stats.module.css'

export type Stat = { icon: LucideIcon; value: string; label: string }

type StatsProps = { stats: Stat[]; className?: string }

// Key figures in a row on desktop and a two-column grid on mobile
export function Stats({ stats, className }: StatsProps) {
  return (
    <dl className={cx(styles.stats, className)}>
      {stats.map((stat) => (
        <div key={stat.label} className={styles.item}>
          <Icon icon={stat.icon} className={styles.icon} />
          <dt className={styles.label}>{stat.label}</dt>
          <dd className={styles.value}>{stat.value}</dd>
        </div>
      ))}
    </dl>
  )
}
