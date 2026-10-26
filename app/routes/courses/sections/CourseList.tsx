import { useEffect, useRef, useState } from 'react'
import { Button } from '~/components/buttons'
import { CourseCard } from '~/components/cards'
import { ICONS } from '~/components/icons'
import { Section } from '~/components/layout'
import type { Course, Courses } from '~/content/schemas'
import styles from './CourseList.module.css'
import { CourseLogo } from './CourseLogo'
import { CourseModal } from './CourseModal'

/** Search param with the open course, so the dialog can be shared: /cursos?curs=<slug> */
export const COURSE_PARAM = 'curs'

const triggerId = (slug: string) => `curs-${slug}`

// Reflects the open course in the address bar without a navigation
function setCourseParam(slug: string | null) {
  const url = new URL(window.location.href)
  if (slug) url.searchParams.set(COURSE_PARAM, slug)
  else url.searchParams.delete(COURSE_PARAM)
  window.history.replaceState(window.history.state, '', url)
}

export function CourseList({ courses }: { courses: Courses }) {
  const { labels } = courses
  const [openSlug, setOpenSlug] = useState<string | null>(null)
  const course = courses.items.find((item) => item.slug === openSlug) ?? null
  // The last course opened, still known while the dialog closes
  const lastSlug = useRef<string | null>(null)

  // The page is prerendered, so the shared link is read once it runs in the browser
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get(COURSE_PARAM)
    if (!courses.items.some((item) => item.slug === slug)) return
    lastSlug.current = slug
    setOpenSlug(slug)
  }, [courses.items])

  const open = (slug: string) => {
    lastSlug.current = slug
    setOpenSlug(slug)
    setCourseParam(slug)
  }

  const close = () => {
    setOpenSlug(null)
    setCourseParam(null)
  }

  // Focus goes back to the button of the course, also when it was opened from a link
  const returnFocus = (event: Event) => {
    const trigger = lastSlug.current && document.getElementById(triggerId(lastSlug.current))
    if (!trigger) return
    event.preventDefault()
    trigger.focus()
  }

  const details = (item: Course) => [
    { icon: ICONS.euro, label: labels.price, value: item.price },
    { icon: ICONS.award, label: labels.credits, value: item.credits },
    { icon: ICONS['circle-check'], label: labels.requirements, value: item.requirements },
    { icon: ICONS['map-pin'], label: labels.location, value: item.location },
    { icon: ICONS.clock, label: labels.duration, value: item.duration },
    { icon: ICONS.calendar, label: labels.date, value: item.date },
    { icon: ICONS.signal, label: labels.level, value: item.level },
  ]

  return (
    <Section id="llista-de-cursos">
      <div className={styles.grid}>
        {courses.items.map((item) => (
          <CourseCard
            key={item.slug}
            logo={<CourseLogo logo={item.logo} sizes="(min-width: 1024px) 278px, 100vw" />}
            title={item.name}
            details={details(item)}
            actions={
              <>
                <Button
                  id={triggerId(item.slug)}
                  size="small"
                  icon={ICONS.info}
                  aria-haspopup="dialog"
                  onClick={() => open(item.slug)}
                >
                  {labels.moreInfo} <span className="visually-hidden">sobre {item.name}</span>
                </Button>
                <Button
                  href={courses.enrollLink}
                  variant="secondary"
                  size="small"
                  icon={ICONS['user-plus']}
                >
                  {labels.enroll} <span className="visually-hidden">a {item.name}</span>
                </Button>
              </>
            }
          >
            <p>{item.description}</p>
          </CourseCard>
        ))}
      </div>
      <CourseModal
        course={course}
        labels={labels}
        text={courses.modal}
        onClose={close}
        onCloseAutoFocus={returnFocus}
      />
    </Section>
  )
}
