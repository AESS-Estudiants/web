import { screen } from '@testing-library/react'
import { Menu } from 'lucide-react'
import { expect, it } from 'vitest'
import { renderWithRouter } from '~/test/render'
import { IconButton } from './IconButton'

it('uses the label as the accessible name', () => {
  renderWithRouter(<IconButton icon={Menu} label="Obre el menú" />)
  expect(screen.getByRole('button', { name: 'Obre el menú' })).toBeInTheDocument()
})

it('can be a link', () => {
  renderWithRouter(<IconButton icon={Menu} label="Contacte" to="/contacte" />)
  expect(screen.getByRole('link', { name: 'Contacte' })).toHaveAttribute('href', '/contacte')
})
