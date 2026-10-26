import { courses } from '~/content/courses'
import { preloadPicture } from '~/lib/images'
import { breadcrumbJsonLd, coursesJsonLd, pageMeta } from '~/lib/seo'
import type { Route } from './+types/route'
import { CourseList } from './sections/CourseList'
import { HERO_POSTER_SIZES, Hero } from './sections/Hero'
import { Intro } from './sections/Intro'

export const links: Route.LinksFunction = () => [
  preloadPicture(courses.hero.poster.src, HERO_POSTER_SIZES),
]

export function meta(_: Route.MetaArgs) {
  return [
    ...pageMeta({
      title: 'Cursos',
      description:
        'Aprèn amb els nostres cursos pràctics en robòtica, electrònica i programació. Des de iniciació fins a nivell avançat, tenim el curs perfecte per a tu.',
      path: '/cursos',
    }),
    { 'script:ld+json': breadcrumbJsonLd('Cursos', '/cursos') },
    { 'script:ld+json': coursesJsonLd(courses.items) },
  ]
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
