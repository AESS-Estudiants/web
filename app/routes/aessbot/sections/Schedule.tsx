import { Calendar, Clock, MapPin, Wrench } from 'lucide-react'
import { SectionHeader } from '~/components/content'
import { ICONS, Icon } from '~/components/icons'
import { Section } from '~/components/layout'
import type { AessbotEdition } from '~/content/schemas'
import { cx } from '~/lib/cx'
import styles from './Schedule.module.css'

// A table on desktop; on mobile each row is a card and the cells carry their own icon
export function Schedule({ schedule }: { schedule: AessbotEdition['schedule'] }) {
  const { columns } = schedule
  return (
    <Section tone="alt" id="calendari" labelledBy="calendari-title">
      <SectionHeader id="calendari-title" title={schedule.title} subtitle={schedule.subtitle} />
      <table className={styles.table}>
        <thead className={styles.head}>
          <tr>
            {[
              { icon: Calendar, label: columns.date },
              { icon: Clock, label: columns.time },
              { icon: Wrench, label: columns.event },
              { icon: MapPin, label: columns.location },
            ].map((column) => (
              <th key={column.label} scope="col">
                <span className={styles.heading}>
                  <Icon icon={column.icon} size={16} />
                  {column.label}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={styles.body}>
          {schedule.items.map((item) => (
            <tr key={item.title} className={cx(styles.row, item.highlight && styles.highlight)}>
              <td className={styles.date}>
                <Icon icon={Calendar} size={16} className={styles.cellIcon} />
                {item.date}
              </td>
              <td className={styles.time}>
                <Icon icon={Clock} size={16} className={styles.cellIcon} />
                {item.time}
              </td>
              <td className={styles.event}>
                <span className={styles.title}>
                  <Icon icon={ICONS[item.icon]} size={18} />
                  {item.title}
                </span>
                <span className={styles.description}>{item.description}</span>
              </td>
              <td className={styles.location}>
                <Icon icon={MapPin} size={16} className={styles.cellIcon} />
                {item.location}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Section>
  )
}
