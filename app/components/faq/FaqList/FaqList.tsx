import * as Accordion from '@radix-ui/react-accordion'
import { type LucideIcon, Minus, Plus } from 'lucide-react'
import type { ReactNode } from 'react'
import { Icon } from '~/components/icons'
import { cx } from '~/lib/cx'
import styles from './FaqList.module.css'

export type FaqItem = {
  question: string
  answer: ReactNode
  icon?: LucideIcon
}

type FaqListProps = {
  items: FaqItem[]
  /** Heading level of each question, h3 by default */
  headingLevel?: 'h3' | 'h4'
  /** Index of the question open at first */
  defaultOpen?: number
  className?: string
}

// One question open at a time; opening another closes the previous one
export function FaqList({ items, headingLevel = 'h3', defaultOpen, className }: FaqListProps) {
  const Heading = headingLevel
  return (
    <Accordion.Root
      type="single"
      collapsible
      defaultValue={defaultOpen === undefined ? undefined : String(defaultOpen)}
      className={cx(styles.list, className)}
    >
      {items.map((item, index) => (
        <Accordion.Item key={item.question} value={String(index)} className={styles.item}>
          <Accordion.Header asChild>
            <Heading className={styles.heading}>
              <Accordion.Trigger className={styles.trigger}>
                {item.icon && <Icon icon={item.icon} size={20} className={styles.icon} />}
                <span className={styles.question}>{item.question}</span>
                <Icon icon={Plus} size={20} className={cx(styles.toggle, styles.plus)} />
                <Icon icon={Minus} size={20} className={cx(styles.toggle, styles.minus)} />
              </Accordion.Trigger>
            </Heading>
          </Accordion.Header>
          <Accordion.Content className={styles.content}>
            <div className={styles.answer}>{item.answer}</div>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  )
}
