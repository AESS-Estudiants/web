import { act, fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, expect, it, vi } from 'vitest'
import { ScrollToTopButton } from './ScrollToTopButton'

beforeEach(() => {
  window.scrollTo = vi.fn()
  window.matchMedia = vi.fn().mockReturnValue({ matches: false })
})

function scrollTo(y: number) {
  act(() => {
    Object.defineProperty(window, 'scrollY', { value: y, configurable: true })
    fireEvent.scroll(window)
  })
}

it('stays hidden near the top and appears after scrolling', () => {
  render(<ScrollToTopButton />)
  scrollTo(0)
  expect(screen.queryByRole('button', { name: 'Torna a dalt' })).not.toBeInTheDocument()
  scrollTo(1200)
  expect(screen.getByRole('button', { name: 'Torna a dalt' })).toBeInTheDocument()
})

it('scrolls back to the top', () => {
  render(<ScrollToTopButton />)
  scrollTo(1200)
  fireEvent.click(screen.getByRole('button', { name: 'Torna a dalt' }))
  expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
})
