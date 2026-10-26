import { ArrowRight } from 'lucide-react'
import { Icon } from '~/components/icons'
import { cx } from '~/lib/cx'
import { Action, type ActionProps } from '../Action/Action'
import styles from './TextLink.module.css'

export type TextLinkProps = ActionProps & {
  /** Arrow after the label, for "see all" style links */
  arrow?: boolean
}

export function TextLink({ arrow = false, className, children, ...props }: TextLinkProps) {
  return (
    <Action className={cx(styles.link, className)} {...props}>
      {children}
      {arrow && <Icon icon={ArrowRight} size={16} />}
    </Action>
  )
}
