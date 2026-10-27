import type { Route } from './+types/route'

export function meta(_: Route.MetaArgs) {
  return [{ title: 'Inici · AESS Estudiants' }]
}

export default function HomePage() {
  return (
    <main>
      <h1>Inici</h1>
    </main>
  )
}
