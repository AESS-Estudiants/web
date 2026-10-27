import { render, screen } from '@testing-library/react'
import { beforeAll, expect, it, vi } from 'vitest'
import { Carousel } from './Carousel'

beforeAll(() => {
  // Embla measures the layout with these browser APIs, which jsdom lacks
  class Observer {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  vi.stubGlobal('ResizeObserver', Observer)
  vi.stubGlobal('IntersectionObserver', Observer)
  window.matchMedia = vi.fn().mockReturnValue({
    matches: false,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })
})

const slides = ['Taller', 'Competició', 'Curs'].map((alt) => <img key={alt} src="" alt={alt} />)

it('labels the carousel and every slide', () => {
  render(<Carousel label="Fotos del taller" slides={slides} />)
  expect(screen.getByRole('region', { name: 'Fotos del taller' })).toBeInTheDocument()
  expect(screen.getAllByRole('group').map((slide) => slide.getAttribute('aria-label'))).toEqual([
    '1 de 3',
    '2 de 3',
    '3 de 3',
  ])
})

it('starts on the first slide with the previous arrow disabled', () => {
  render(<Carousel label="Fotos" slides={slides} />)
  expect(screen.getByRole('button', { name: 'Diapositiva anterior' })).toBeDisabled()
  expect(screen.getByRole('button', { name: 'Mostra la diapositiva 1' })).toHaveAttribute(
    'aria-current',
    'true',
  )
})

it('hides the controls when there is a single slide', () => {
  render(<Carousel label="Fotos" slides={slides.slice(0, 1)} />)
  expect(screen.queryByRole('button')).not.toBeInTheDocument()
})
