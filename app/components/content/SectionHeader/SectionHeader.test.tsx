import { screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { renderWithRouter } from '~/test/render'
import { SectionHeader } from './SectionHeader'

it('renders a level two heading with an optional subtitle and link', () => {
  renderWithRouter(
    <SectionHeader
      title="Projectes"
      subtitle="El que fem al taller"
      link={{ label: 'Tots els projectes', to: '/projectes' }}
    />,
  )
  expect(screen.getByRole('heading', { level: 2, name: 'Projectes' })).toBeInTheDocument()
  expect(screen.getByText('El que fem al taller')).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'Tots els projectes' })).toHaveAttribute(
    'href',
    '/projectes',
  )
})

it('can change the heading level', () => {
  renderWithRouter(<SectionHeader as="h1" title="Cursos" />)
  expect(screen.getByRole('heading', { level: 1, name: 'Cursos' })).toBeInTheDocument()
})
