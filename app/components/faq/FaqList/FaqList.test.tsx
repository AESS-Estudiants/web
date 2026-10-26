import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it } from 'vitest'
import { FaqList } from './FaqList'

const items = [
  { question: 'Per què ser membre?', answer: 'Per aprendre.' },
  { question: 'Quant costa?', answer: 'És gratuït.' },
]

it('opens one question at a time', async () => {
  render(<FaqList items={items} />)
  const first = screen.getByRole('button', { name: 'Per què ser membre?' })
  const second = screen.getByRole('button', { name: 'Quant costa?' })
  expect(first).toHaveAttribute('aria-expanded', 'false')

  await userEvent.click(first)
  expect(first).toHaveAttribute('aria-expanded', 'true')
  expect(screen.getByText('Per aprendre.')).toBeVisible()

  await userEvent.click(second)
  expect(first).toHaveAttribute('aria-expanded', 'false')
  expect(second).toHaveAttribute('aria-expanded', 'true')
})

it('wraps each question in a heading', () => {
  render(<FaqList items={items} />)
  expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(2)
})
