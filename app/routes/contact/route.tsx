import type { Route } from './+types/route'

export function meta(_: Route.MetaArgs) {
  return [{ title: 'Contacte · AESS Estudiants' }]
}

export default function ContactPage() {
  return (
    <main>
      <h1>Contacte</h1>
    </main>
  )
}
