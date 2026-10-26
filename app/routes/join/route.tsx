import type { Route } from './+types/route'

export function meta(_: Route.MetaArgs) {
  return [{ title: 'Uneix-te · AESS Estudiants' }]
}

export default function JoinPage() {
  return (
    <main>
      <h1>Uneix-te</h1>
    </main>
  )
}
