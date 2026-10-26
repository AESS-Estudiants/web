import { cx } from '~/lib/cx'
import { Skeleton, SkeletonText } from '../Skeleton/Skeleton'
import styles from './SkeletonCard.module.css'

type SkeletonCardProps = { type: 'feature' | 'faq' | 'event' | 'course'; className?: string }

// Width of the detail rows of the course card, in percent of the text column
const COURSE_DETAILS = [80, 60, 100, 100, 80, 80, 60]

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

  if (type === 'course') {
    return (
      <span className={cx(styles.card, styles.course, className)} aria-hidden>
        <Skeleton height={150} radius="lg" />
        <span className={styles.text}>
          <SkeletonText lines={[60]} />
          <SkeletonText lines={[100, 100, 100, 100, 60]} size={15} />
        </span>
        <span className={styles.details}>
          {COURSE_DETAILS.map((width, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: rows are static
            <span key={index} className={styles.detail}>
              <Skeleton width={20} height={20} radius="full" />
              <SkeletonText lines={[width]} size={15} className={styles.grow} />
            </span>
          ))}
        </span>
        <span className={styles.stack}>
          <Skeleton height={40} radius="md" />
          <Skeleton height={40} radius="md" />
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
