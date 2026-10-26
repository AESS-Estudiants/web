import { screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { renderWithRouter } from '~/test/render'
import { ErrorState } from './ErrorState'

it('shows the message as the page heading with a way back', () => {
  renderWithRouter(
    <ErrorState
      code="404"
      title="Ups! Pàgina no trobada"
      description="Sembla que la pàgina que busques no existeix."
      action={{ label: "Tornar a l'inici", to: '/' }}
    />,
  )
  expect(screen.getByRole('heading', { level: 1, name: 'Ups! Pàgina no trobada' })).toBeVisible()
  expect(screen.getByRole('link', { name: "Tornar a l'inici" })).toHaveAttribute('href', '/')
})
