import { useLocation } from 'react-router'

// Prerendering visits /cursos/ (with a slash) while the browser shows /cursos, so compare without it.
// A subpage such as /aessbot/inscripcio marks its section in the menu.
export function useIsCurrentPage() {
  const { pathname } = useLocation()
  const current = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
  return (to: string) => current === to || (to !== '/' && current.startsWith(`${to}/`))
}
