import type { Route } from './+types/route'

export function meta(_: Route.MetaArgs) {
  return [{ title: 'AESSBot · AESS Estudiants' }]
}

export default function AessbotPage() {
  return (
    <main>
      <h1>AESSBot</h1>
    </main>
  )
}
