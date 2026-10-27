import { Check } from 'lucide-react'
import type { ComponentPropsWithRef, ReactNode } from 'react'
import { Icon } from '~/components/icons'
import { cx } from '~/lib/cx'
import styles from './Checkbox.module.css'

type CheckboxProps = Omit<ComponentPropsWithRef<'input'>, 'type' | 'className' | 'children'> & {
  children: ReactNode
  className?: string
}

export function Checkbox({ children, className, ...props }: CheckboxProps) {
  return (
    <label className={cx(styles.option, className)}>
      <span className={styles.box}>
        <input type="checkbox" className={styles.input} {...props} />
        <Icon icon={Check} size={16} className={styles.mark} />
      </span>
      <span className={styles.label}>{children}</span>
    </label>
  )
}
