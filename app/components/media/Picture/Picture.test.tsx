import { fireEvent, render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { Picture } from './Picture'

const photo = {
  sources: { avif: '/a-480.avif 480w, /a-800.avif 800w', webp: '/a-480.webp 480w' },
  img: { src: '/a-800.jpg', w: 800, h: 600 },
}

it('offers every format and reserves the image size', () => {
  const { container } = render(<Picture src={photo} alt="El taller" sizes="50vw" />)
  const sources = container.querySelectorAll('source')
  expect([...sources].map((source) => source.type)).toEqual(['image/avif', 'image/webp'])
  const img = screen.getByRole('img', { name: 'El taller' })
  expect(img).toHaveAttribute('width', '800')
  expect(img).toHaveAttribute('height', '600')
  expect(img).toHaveAttribute('loading', 'lazy')
})

it('loads the main image first', () => {
  render(<Picture src={photo} alt="Portada" priority />)
  const img = screen.getByRole('img', { name: 'Portada' })
  expect(img).toHaveAttribute('loading', 'eager')
  expect(img).toHaveAttribute('fetchpriority', 'high')
})

it('fades the image in once it has loaded', () => {
  const { container } = render(<Picture src={photo} alt="Foto" />)
  const picture = container.querySelector('picture')
  const before = picture?.className
  fireEvent.load(screen.getByRole('img', { name: 'Foto' }))
  expect(picture?.className).not.toBe(before)
})
