import { ArrowRight, LoaderCircle, type LucideIcon } from 'lucide-react'
import { Icon } from '~/components/icons'
import { cx } from '~/lib/cx'
import { Action, type ActionButtonProps, type ActionProps } from '../Action/Action'
import styles from './Button.module.css'

type ButtonOwnProps = {
  variant?: 'primary' | 'secondary'
  size?: 'large' | 'small'
  /** Icon before the label */
  icon?: LucideIcon
  /** Arrow after the label, for buttons that take you somewhere */
  arrow?: boolean
  /** Shows a spinner and blocks the button while an action runs */
  loading?: boolean
}

export type ButtonProps = ActionProps & ButtonOwnProps

export function Button({
  variant = 'primary',
  size = 'large',
  icon,
  arrow = false,
  loading = false,
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cx(styles.button, styles[variant], styles[size], className)
  const leading = loading ? LoaderCircle : icon
  const content = (
    <>
      {leading && <Icon icon={leading} className={loading ? styles.spinner : undefined} />}
      {children}
      {arrow && !loading && <Icon icon={ArrowRight} />}
    </>
  )

  if (!('to' in props) && !('href' in props)) {
    const { disabled, ...rest } = props as Omit<ActionButtonProps, 'className' | 'children'>
    return (
      <Action className={classes} disabled={disabled || loading} aria-busy={loading} {...rest}>
        {content}
      </Action>
    )
  }

  return (
    <Action className={classes} {...props}>
      {content}
    </Action>
  )
}
