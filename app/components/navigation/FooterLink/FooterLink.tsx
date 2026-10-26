import { Action, type ActionProps } from '~/components/buttons/Action/Action'
import { cx } from '~/lib/cx'
import styles from './FooterLink.module.css'

export type FooterLinkProps = ActionProps & { size?: 'default' | 'small' }

export function FooterLink({ size = 'default', className, ...props }: FooterLinkProps) {
  return <Action className={cx(styles.link, styles[size], className)} {...props} />
}
