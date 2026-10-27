import type { ReactNode } from 'react'
import { cx } from '~/lib/cx'
import styles from './Tag.module.css'

type TagProps = { className?: string; children: ReactNode }

export function Tag({ className, children }: TagProps) {
  return <span className={cx(styles.tag, className)}>{children}</span>
}
