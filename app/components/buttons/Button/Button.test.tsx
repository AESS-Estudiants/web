import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Send } from 'lucide-react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithRouter } from '~/test/render'
import { Button } from './Button'

describe('Button', () => {
  it('renders an internal route as a link', () => {
    renderWithRouter(<Button to="/uneix-te">Fes-te membre</Button>)
    expect(screen.getByRole('link', { name: 'Fes-te membre' })).toHaveAttribute('href', '/uneix-te')
  })

  it('opens external links in a new tab and says so', () => {
    renderWithRouter(<Button href="https://example.com">Web</Button>)
    const link = screen.getByRole('link', { name: "Web, s'obre en una pestanya nova" })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders a button that defaults to type button', async () => {
    const onClick = vi.fn()
    renderWithRouter(
      <Button icon={Send} onClick={onClick}>
        Envia
      </Button>,
    )
    const button = screen.getByRole('button', { name: 'Envia' })
    expect(button).toHaveAttribute('type', 'button')
    await userEvent.click(button)
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('blocks the button while loading', async () => {
    const onClick = vi.fn()
    renderWithRouter(
      <Button type="submit" loading onClick={onClick}>
        Enviant...
      </Button>,
    )
    const button = screen.getByRole('button', { name: 'Enviant...' })
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-busy', 'true')
    await userEvent.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('adds the trailing arrow only when asked', () => {
    const { container } = renderWithRouter(
      <Button to="/" arrow>
        Inici
      </Button>,
    )
    expect(container.querySelectorAll('svg')).toHaveLength(1)
  })
})
