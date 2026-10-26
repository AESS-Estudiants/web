import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it } from 'vitest'
import { FaqByTopic } from './FaqByTopic'

const topics = [
  {
    id: 'competition',
    title: 'La competició',
    items: [{ question: 'Què és AESSBot?', answer: 'Una competició.' }],
  },
  {
    id: 'teams',
    title: 'Inscripció i equips',
    items: [
      { question: 'Quants som per equip?', answer: 'Tres.' },
      { question: 'Quan acaba la inscripció?', answer: 'Al febrer.' },
    ],
  },
]

it('shows only the selected topic', async () => {
  render(<FaqByTopic topics={topics} />)
  expect(screen.getByRole('tab', { name: 'La competició 1 preguntes' })).toHaveAttribute(
    'aria-selected',
    'true',
  )
  expect(screen.getByRole('heading', { name: 'La competició' })).toBeInTheDocument()
  expect(screen.queryByText('Quants som per equip?')).not.toBeInTheDocument()

  await userEvent.click(screen.getByRole('tab', { name: 'Inscripció i equips 2 preguntes' }))
  expect(screen.getByRole('heading', { name: 'Inscripció i equips' })).toBeInTheDocument()
  expect(screen.queryByText('Què és AESSBot?')).not.toBeInTheDocument()
  expect(screen.getByText('Tres.')).toBeVisible()
})
