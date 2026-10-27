import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { AessbotStatus } from '~/content/schemas'
import { renderWithRouter } from '~/test/render'
import RegistrationPage from '../aessbot-registration/route'
import AessbotPage, { meta } from './route'

// The status is read from the content file, so each test sets it here
const content = vi.hoisted(() => ({ status: 'coming-soon' as AessbotStatus }))

vi.mock('~/content/aessbot', async (importOriginal) => {
  const { aessbot } = await importOriginal<typeof import('~/content/aessbot')>()
  return {
    aessbot: {
      ...aessbot,
      get status() {
        return content.status
      },
    },
  }
})

// Photos are only processed by the Vite build, and the game and the carousel need a real browser
vi.mock('~/lib/images', () => ({
  picture: (path: string) => ({ img: { src: `/assets/${path}`, w: 100, h: 100 }, sources: {} }),
}))
vi.mock('~/features/sumo-game', () => ({ SumoGame: () => null }))
vi.mock('~/components/carousel', () => ({
  Carousel: ({ slides }: { slides: ReactNode[] }) => <div>{slides}</div>,
}))

function jsonLdTypes() {
  return meta({} as never)
    .filter((tag) => 'script:ld+json' in tag)
    .map((tag) => (tag as { 'script:ld+json': { '@type': string } })['script:ld+json']['@type'])
}

describe('/aessbot', () => {
  beforeEach(() => {
    content.status = 'coming-soon'
  })

  it('shows the coming soon page before the edition is announced', () => {
    renderWithRouter(<AessbotPage />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('AESSBot 2027')
    expect(screen.queryByRole('link', { name: 'Inscriu-te' })).not.toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
    expect(jsonLdTypes()).toEqual(['BreadcrumbList'])
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows the edition with the registration button while registration is open', () => {
    content.status = 'registration'
    // A day before registration closes
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-02-10T23:00:00+01:00'))
    renderWithRouter(<AessbotPage />)
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('AESSBot 2026')
    expect(screen.getByRole('link', { name: 'Inscriu-te' })).toHaveAttribute(
      'href',
      '/aessbot/inscripcio',
    )
    expect(screen.getByRole('timer')).toHaveTextContent(/1 dies.*00 hores.*59 min/)
    expect(screen.getByRole('table')).toBeInTheDocument()
    expect(screen.getByRole('tablist', { name: 'Temes' })).toBeInTheDocument()
    expect(jsonLdTypes()).toEqual(['BreadcrumbList', 'Event'])
  })

  it('says registration is closed once the deadline has passed', () => {
    content.status = 'registration'
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-02-12T00:00:00+01:00'))
    renderWithRouter(<AessbotPage />)
    expect(screen.queryByRole('timer')).not.toBeInTheDocument()
    expect(screen.getByText('Inscripcions tancades')).toBeInTheDocument()
  })

  it('shows the edition without registration once it is over', () => {
    content.status = 'finished'
    renderWithRouter(<AessbotPage />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('AESSBot 2026')
    expect(screen.queryByRole('link', { name: 'Inscriu-te' })).not.toBeInTheDocument()
    expect(screen.queryByRole('timer')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Calendari' })).toBeInTheDocument()
    expect(jsonLdTypes()).toEqual(['BreadcrumbList', 'Event'])
  })
})

describe('/aessbot/inscripcio', () => {
  function renderAt(path: string) {
    const router = createMemoryRouter(
      [
        { path: '/aessbot', element: <p>AESSBot</p> },
        { path: '/aessbot/inscripcio', element: <RegistrationPage /> },
      ],
      { initialEntries: [path] },
    )
    render(<RouterProvider router={router} />)
    return router
  }

  it('sends you to /aessbot before the edition is announced', async () => {
    content.status = 'coming-soon'
    const router = renderAt('/aessbot/inscripcio')
    expect(await screen.findByText('AESSBot')).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/aessbot')
  })

  it('loads the Google Form only after a click while registration is open', async () => {
    content.status = 'registration'
    renderAt('/aessbot/inscripcio')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Recordatoris Importants')
    expect(document.querySelector('iframe')).toBeNull()
    screen.getByRole('button', { name: 'Carrega el formulari' }).click()
    const frame = await screen.findByTitle("Formulari d'inscripció AESSBot")
    expect(frame.getAttribute('src')).toMatch(
      /^https:\/\/docs\.google\.com\/forms\/.+embedded=true$/,
    )
  })
})
