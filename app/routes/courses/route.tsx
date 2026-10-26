import { courses } from '~/content/courses'
import { pageMeta } from '~/lib/seo'
import type { Route } from './+types/route'
import { CourseList } from './sections/CourseList'
import { Hero } from './sections/Hero'
import { Intro } from './sections/Intro'

export function meta(_: Route.MetaArgs) {
  return pageMeta({
    title: 'Cursos',
    description:
      'Aprèn amb els nostres cursos pràctics en robòtica, electrònica i programació. Des de iniciació fins a nivell avançat, tenim el curs perfecte per a tu.',
    path: '/cursos',
  })
}

export default function CoursesPage() {
  return (
    <>
      <Hero hero={courses.hero} />
      <Intro intro={courses.intro} />
      <CourseList courses={courses} />
    </>
  )
}
