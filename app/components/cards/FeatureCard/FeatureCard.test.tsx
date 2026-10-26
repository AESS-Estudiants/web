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

it('leaves out the eyebrow when it has none', () => {
  const { container } = renderWithRouter(
    <FeatureCard icon={Cpu} title="Xerrades">
      <p>Text</p>
    </FeatureCard>,
  )
  expect(container.querySelectorAll('p')).toHaveLength(1)
})

it('links the title when it has a route', () => {
  renderWithRouter(
    <FeatureCard icon={Cpu} eyebrow="Projectes" title="Fem robots" to="/projectes">
      <p>Text</p>
    </FeatureCard>,
  )
  expect(screen.getByRole('link', { name: 'Fem robots' })).toHaveAttribute('href', '/projectes')
})
