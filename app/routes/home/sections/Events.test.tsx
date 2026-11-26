import { screen } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { home } from '~/content/home'
import type { AessbotStatus } from '~/content/schemas'
import { renderWithRouter } from '~/test/render'
import { Events } from './Events'

// The status is read from the content file, so each test sets it here
const content = vi.hoisted(() => ({ status: 'registration' as AessbotStatus }))

vi.mock('~/content/aessbot-registration', async (importOriginal) => {
  const original = await importOriginal<typeof import('~/content/aessbot-registration')>()
  return {
    ...original,
    aessbotRegistration: {
      registrationDeadline: '2026-11-26T23:59:59+01:00',
      get status() {
        return content.status
      },
    },
  }
})

vi.mock('~/lib/images', () => ({
  picture: (path: string) => ({ img: { src: `/assets/${path}`, w: 100, h: 100 }, sources: {} }),
}))

beforeEach(() => {
  content.status = 'registration'
  vi.useFakeTimers({ toFake: ['Date'] })
})
afterEach(() => vi.useRealTimers())

function signUp() {
  return screen.queryByRole('link', { name: 'Inscriu-te!' })
}

it('links to the AESSBot registration while it is open', () => {
  vi.setSystemTime(new Date('2026-11-25T23:00:00+01:00'))
  renderWithRouter(<Events events={home.events} />)
  expect(signUp()).toHaveAttribute('href', '/aessbot/inscripcio')
  expect(screen.getByRole('link', { name: 'Més informació' })).toBeInTheDocument()
})

it('drops the sign-up button once the deadline has passed', () => {
  vi.setSystemTime(new Date('2026-11-27T00:00:00+01:00'))
  renderWithRouter(<Events events={home.events} />)
  expect(signUp()).not.toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'Més informació' })).toBeInTheDocument()
})

it('drops the sign-up button once the edition is over', () => {
  content.status = 'finished'
  vi.setSystemTime(new Date('2026-11-25T23:00:00+01:00'))
  renderWithRouter(<Events events={home.events} />)
  expect(signUp()).not.toBeInTheDocument()
})
