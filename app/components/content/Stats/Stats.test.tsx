import { render, screen } from '@testing-library/react'
import { Award, Trophy } from 'lucide-react'
import { expect, it } from 'vitest'
import { Stats } from './Stats'

it('pairs every value with its label', () => {
  render(
    <Stats
      stats={[
        { icon: Trophy, value: 'Més de 1.000€', label: 'En premis' },
        { icon: Award, value: '1 ECTS', label: 'Per arribar a la final' },
      ]}
    />,
  )
  const terms = screen.getAllByRole('term').map((term) => term.textContent)
  const definitions = screen.getAllByRole('definition').map((value) => value.textContent)
  expect(terms).toEqual(['En premis', 'Per arribar a la final'])
  expect(definitions).toEqual(['Més de 1.000€', '1 ECTS'])
})
