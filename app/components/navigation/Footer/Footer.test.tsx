import { screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { renderWithRouter } from '~/test/render'
import { Footer } from './Footer'

it('shows the contact details and legal documents', () => {
  renderWithRouter(<Footer />)
  expect(screen.getByRole('link', { name: 'aess.estudiants@upc.edu' })).toHaveAttribute(
    'href',
    'mailto:aess.estudiants@upc.edu',
  )
  expect(screen.getByRole('link', { name: '+34 934 13 75 64' })).toHaveAttribute(
    'href',
    'tel:+34934137564',
  )
  expect(screen.getByRole('link', { name: 'Política de privacitat' })).toHaveAttribute(
    'href',
    '/documents/Política_Privacitat.pdf',
  )
})

it('links to the social networks in a new tab', () => {
  renderWithRouter(<Footer />)
  const instagram = screen.getByRole('link', { name: "Instagram, s'obre en una pestanya nova" })
  expect(instagram).toHaveAttribute('href', 'https://www.instagram.com/aessestudiants')
  expect(instagram).toHaveAttribute('target', '_blank')
})
