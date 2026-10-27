import type { LucideIcon } from 'lucide-react'
import { Icon } from '~/components/icons'
import { cx } from '~/lib/cx'
import { Action, type ActionProps, type DistributiveOmit } from '../Action/Action'
import styles from './IconButton.module.css'

export type IconButtonProps = DistributiveOmit<ActionProps, 'children'> & {
  icon: LucideIcon
  /** Accessible name, the button has no visible text */
  label: string
  size?: 44 | 40
}

export function IconButton({ icon, label, size = 44, className, ...props }: IconButtonProps) {
  return (
    <Action
      className={cx(styles.button, size === 40 && styles.small, className)}
      aria-label={label}
      {...(props as DistributiveOmit<ActionProps, 'children'>)}
    >
      <Icon icon={icon} />
    </Action>
  )
}
