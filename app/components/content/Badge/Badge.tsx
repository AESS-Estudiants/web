import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Icon } from '~/components/icons'
import { cx } from '~/lib/cx'
import styles from './Badge.module.css'

type BadgeProps = { icon?: LucideIcon; className?: string; children: ReactNode }

// Highlighted note, such as the date of the next open day
export function Badge({ icon, className, children }: BadgeProps) {
  return (
    <p className={cx(styles.badge, className)}>
      {icon && <Icon icon={icon} size={16} />}
      {children}
    </p>
  )
}
