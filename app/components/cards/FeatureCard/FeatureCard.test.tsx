import { screen } from '@testing-library/react'
import { Cpu } from 'lucide-react'
import { expect, it } from 'vitest'
import { renderWithRouter } from '~/test/render'
import { FeatureCard } from './FeatureCard'

it('is a plain card without a route', () => {
  renderWithRouter(
    <FeatureCard icon={Cpu} eyebrow="Projectes" title="Fem robots">
      <p>Text</p>
    </FeatureCard>,
  )
  expect(screen.getByRole('heading', { level: 3, name: 'Fem robots' })).toBeInTheDocument()
  expect(screen.queryByRole('link')).not.toBeInTheDocument()
})

it('links the title when it has a route', () => {
  renderWithRouter(
    <FeatureCard icon={Cpu} eyebrow="Projectes" title="Fem robots" to="/projectes">
      <p>Text</p>
    </FeatureCard>,
  )
  expect(screen.getByRole('link', { name: 'Fem robots' })).toHaveAttribute('href', '/projectes')
})
