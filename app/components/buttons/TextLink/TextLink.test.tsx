import { screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { renderWithRouter } from '~/test/render'
import { TextLink } from './TextLink'

it('renders a link with an optional arrow', () => {
  const { container } = renderWithRouter(
    <TextLink to="/projectes" arrow>
      Tots els projectes
    </TextLink>,
  )
  expect(screen.getByRole('link', { name: 'Tots els projectes' })).toHaveAttribute(
    'href',
    '/projectes',
  )
  expect(container.querySelector('svg')).toBeInTheDocument()
})
