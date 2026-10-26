import { cx } from '~/lib/cx'
import { Skeleton, SkeletonText } from '../Skeleton/Skeleton'
import styles from './SkeletonCard.module.css'

type SkeletonCardProps = { type: 'feature' | 'faq' | 'event'; className?: string }

// Loading version of the cards, with the same size as the real ones
export function SkeletonCard({ type, className }: SkeletonCardProps) {
  if (type === 'faq') {
    return (
      <span className={cx(styles.card, styles.faq, className)} aria-hidden>
        <Skeleton width={20} height={20} radius="full" />
        <SkeletonText lines={[60]} className={styles.grow} />
        <Skeleton width={20} height={20} radius="xs" />
      </span>
    )
  }

  if (type === 'event') {
    return (
      <span className={cx(styles.card, styles.event, className)} aria-hidden>
        <Skeleton radius="xs" className={styles.poster} />
        <span className={styles.body}>
          <Skeleton width={140} height={27} />
          <SkeletonText lines={[40]} />
          <SkeletonText lines={[100, 90, 60]} />
          <span className={styles.actions}>
            <Skeleton width={150} height={40} radius="md" />
            <Skeleton width={110} height={40} radius="md" />
          </span>
        </span>
      </span>
    )
  }

  return (
    <span className={cx(styles.card, styles.feature, className)} aria-hidden>
      <Skeleton width={52} height={52} radius="md" />
      <SkeletonText lines={[30]} size={13} />
      <SkeletonText lines={[90, 60]} />
      <SkeletonText lines={[100, 100, 95, 70]} size={15} />
    </span>
  )
}
