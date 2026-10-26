import type { Route } from './+types/route'

export function meta(_: Route.MetaArgs) {
  return [{ title: 'Cursos · AESS Estudiants' }]
}

export default function CoursesPage() {
  return (
    <main>
      <h1>Cursos</h1>
    </main>
  )
}
