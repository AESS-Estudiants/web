import type { Route } from './+types/route'

export function meta(_: Route.MetaArgs) {
  return [{ title: 'Pàgina no trobada · AESS Estudiants' }]
}

export default function NotFoundPage() {
  return (
    <main>
      <h1>Pàgina no trobada</h1>
    </main>
  )
}
