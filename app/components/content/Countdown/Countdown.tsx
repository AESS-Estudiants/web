import { Lock } from 'lucide-react'
import { Fragment, useEffect, useId, useState } from 'react'
import { Icon } from '~/components/icons'
import { cx } from '~/lib/cx'
import styles from './Countdown.module.css'

type CountdownProps = {
  /** ISO date and time when it reaches zero */
  deadline: string
  label: string
  /** Shown instead of the countdown once the deadline has passed */
  closedLabel: string
  className?: string
}

const MINUTE = 60_000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

type Remaining = { days: number; hours: number; minutes: number }

function remaining(deadline: number, now: number): Remaining | 'closed' {
  const left = deadline - now
  if (left <= 0) return 'closed'
  return {
    days: Math.floor(left / DAY),
    hours: Math.floor((left % DAY) / HOUR),
    minutes: Math.floor((left % HOUR) / MINUTE),
  }
}

// Days, hours and minutes left. The time is only known in the browser, so the prerendered page shows dashes
export function Countdown({ deadline, label, closedLabel, className }: CountdownProps) {
  const labelId = useId()
  const [left, setLeft] = useState<Remaining | 'closed' | null>(null)

  useEffect(() => {
    const end = new Date(deadline).getTime()
    const update = () => setLeft(remaining(end, Date.now()))
    update()
    const timer = setInterval(update, MINUTE)
    return () => clearInterval(timer)
  }, [deadline])

  if (left === 'closed') {
    return (
      <p className={cx(styles.closed, className)}>
        <Icon icon={Lock} size={16} />
        {closedLabel}
      </p>
    )
  }

  const units = [
    { label: 'dies', value: left ? String(left.days) : '--' },
    { label: 'hores', value: left ? String(left.hours).padStart(2, '0') : '--' },
    { label: 'min', value: left ? String(left.minutes).padStart(2, '0') : '--' },
  ]

  return (
    <div className={cx(styles.countdown, className)}>
      <p id={labelId} className={styles.label}>
        {label}
      </p>
      <div role="timer" aria-labelledby={labelId} className={styles.units}>
        {units.map((unit, index) => (
          <Fragment key={unit.label}>
            {index > 0 && (
              <span className={styles.separator} aria-hidden>
                :
              </span>
            )}
            <span className={styles.unit}>
              <span className={styles.box}>{unit.value}</span>{' '}
              <span className={styles.name}>{unit.label}</span>
            </span>
          </Fragment>
        ))}
      </div>
    </div>
  )
}
