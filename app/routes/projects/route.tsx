import type { Route } from './+types/route'

export function meta(_: Route.MetaArgs) {
  return [{ title: 'Projectes · AESS Estudiants' }]
}

export default function ProjectsPage() {
  return (
    <main>
      <h1>Projectes</h1>
    </main>
  )
}
