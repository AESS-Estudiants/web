import { screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { Button } from '~/components/buttons'
import { renderWithRouter } from '~/test/render'
import { EventBanner } from './EventBanner'

it('shows the tag, title, text and actions', () => {
  renderWithRouter(
    <EventBanner
      tag="Competició anual"
      title="AESSBot 2026"
      poster={<img src="/poster.jpg" alt="Cartell" />}
      actions={<Button to="/aessbot">Més informació</Button>}
    >
      <p>La competició de robòtica</p>
    </EventBanner>,
  )
  expect(screen.getByText('Competició anual')).toBeInTheDocument()
  expect(screen.getByRole('heading', { level: 2, name: 'AESSBot 2026' })).toBeInTheDocument()
  expect(screen.getByRole('img', { name: 'Cartell' })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'Més informació' })).toHaveAttribute('href', '/aessbot')
})
