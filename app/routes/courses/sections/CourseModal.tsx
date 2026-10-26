import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from '~/components/buttons'
import { RichText, Tag } from '~/components/content'
import { Modal, ModalClose } from '~/components/feedback'
import { ICONS, Icon } from '~/components/icons'
import type { Course, Courses } from '~/content/schemas'
import { CourseLogo } from './CourseLogo'
import styles from './CourseModal.module.css'

type CourseModalProps = {
  course: Course | null
  labels: Courses['labels']
  text: Courses['modal']
  onClose: () => void
  /** Moves focus back to the button that opened the dialog */
  onCloseAutoFocus: (event: Event) => void
}

function Part({ icon, title, children }: { icon: LucideIcon; title: string; children: ReactNode }) {
  return (
    <section className={styles.part}>
      <h3 className={styles.partTitle}>
        <Icon icon={icon} className={styles.icon} />
        {title}
      </h3>
      {children}
    </section>
  )
}

export function CourseModal({ course, labels, text, onClose, onCloseAutoFocus }: CourseModalProps) {
  const facts = course
    ? [
        { icon: ICONS.clock, label: labels.duration, value: course.duration },
        { icon: ICONS.calendar, label: labels.date, value: course.date },
        { icon: ICONS.euro, label: labels.price, value: course.price },
        { icon: ICONS.award, label: labels.credits, value: course.credits },
      ]
    : []

  return (
    <Modal
      open={course !== null}
      onOpenChange={(open) => !open && onClose()}
      onCloseAutoFocus={onCloseAutoFocus}
      title={course?.name}
      media={
        course && (
          <span className={styles.logo}>
            <CourseLogo logo={course.logo} sizes="88px" />
          </span>
        )
      }
      meta={course && <Tag>{course.level}</Tag>}
      footer={
        <ModalClose asChild>
          <Button variant="secondary" size="small">
            {text.close}
          </Button>
        </ModalClose>
      }
    >
      {course && (
        <>
          <Part icon={ICONS.info} title={text.description}>
            <p className={styles.text}>{course.description}</p>
          </Part>
          <Part icon={ICONS.list} title={text.content}>
            <p className={styles.text}>{course.content ?? text.contentPending}</p>
          </Part>
          <Part icon={ICONS['circle-check']} title={text.requirements}>
            <p className={styles.text}>{course.requirements}</p>
          </Part>
          <Part icon={ICONS.laptop} title={text.materials}>
            {course.materials.length > 0 ? (
              <ul className={styles.materials}>
                {course.materials.map((item) => (
                  <li key={item} className={styles.material}>
                    <span className={styles.iconWrap}>
                      <Icon icon={ICONS.check} size={16} className={styles.icon} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.text}>{text.noMaterials}</p>
            )}
          </Part>
          <ul className={styles.facts}>
            {facts.map((fact) => (
              <li key={fact.label} className={styles.fact}>
                <Icon icon={fact.icon} className={styles.icon} />
                <span className={styles.factText}>
                  <span className={styles.factLabel}>{fact.label}</span>
                  <span className={styles.factValue}>{fact.value}</span>
                </span>
              </li>
            ))}
          </ul>
          <Part icon={ICONS['user-plus']} title={text.registration}>
            <p className={styles.text}>
              <RichText>{text.registrationText}</RichText>
            </p>
          </Part>
        </>
      )}
    </Modal>
  )
}
