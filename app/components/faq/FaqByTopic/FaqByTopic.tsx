import * as Tabs from '@radix-ui/react-tabs'
import { cx } from '~/lib/cx'
import { type FaqItem, FaqList } from '../FaqList/FaqList'
import styles from './FaqByTopic.module.css'

export type FaqTopic = { id: string; title: string; items: FaqItem[] }

type FaqByTopicProps = { topics: FaqTopic[]; className?: string }

// Topic index on the left (chips on mobile); only the selected topic is shown
export function FaqByTopic({ topics, className }: FaqByTopicProps) {
  const [first] = topics
  if (!first) return null

  return (
    <Tabs.Root
      defaultValue={first.id}
      orientation="vertical"
      className={cx(styles.root, className)}
    >
      <div className={styles.index}>
        <p className={styles.indexTitle} aria-hidden>
          Temes
        </p>
        <Tabs.List aria-label="Temes" className={styles.tabs}>
          {topics.map((topic) => (
            <Tabs.Trigger key={topic.id} value={topic.id} className={styles.tab}>
              <span className={styles.topic}>{topic.title}</span>{' '}
              <span className={styles.count}>
                {topic.items.length} <span className="visually-hidden">preguntes</span>
              </span>
            </Tabs.Trigger>
          ))}
        </Tabs.List>
      </div>

      {topics.map((topic) => (
        <Tabs.Content key={topic.id} value={topic.id} className={styles.panel}>
          <div className={styles.group}>
            <h3 className={styles.groupTitle}>{topic.title}</h3>
            <p className={styles.groupCount}>{topic.items.length} preguntes</p>
          </div>
          <FaqList items={topic.items} headingLevel="h4" defaultOpen={0} />
        </Tabs.Content>
      ))}
    </Tabs.Root>
  )
}
