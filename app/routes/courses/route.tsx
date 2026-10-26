import { pageMeta } from '~/lib/seo'
import type { Route } from './+types/route'

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
    <main>
      <h1>Cursos</h1>
    </main>
  )
}
