import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRoutesStub } from 'react-router'
import { describe, expect, it } from 'vitest'
import { site } from '~/content/site'
import { Navbar } from './Navbar'

function renderAt(path: string) {
  const Stub = createRoutesStub([
    { path: '/', Component: Navbar },
    { path: '/:page', Component: Navbar },
  ])
  return render(<Stub initialEntries={[path]} />)
}

describe('Navbar', () => {
  it('marks the current page', () => {
    renderAt('/projectes')
    const nav = screen.getByRole('navigation', { name: 'Principal' })
    expect(within(nav).getByRole('link', { name: 'Projectes' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(within(nav).getByRole('link', { name: 'Inici' })).not.toHaveAttribute('aria-current')
  })

  it('leaves out the pages switched off in site.json', () => {
    renderAt('/')
    const nav = screen.getByRole('navigation', { name: 'Principal' })
    const hrefs = within(nav)
      .getAllByRole('link')
      .map((link) => link.getAttribute('href'))
    for (const path of site.hiddenPaths) expect(hrefs).not.toContain(path)
  })

  it('opens and closes the mobile menu', async () => {
    renderAt('/')
    const toggle = screen.getByRole('button', { name: 'Obre el menú' })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('navigation', { name: 'Menú' })).not.toBeInTheDocument()

    await userEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(toggle).toHaveAccessibleName('Tanca el menú')
    expect(screen.getByRole('navigation', { name: 'Menú' })).toBeVisible()

    await userEvent.keyboard('{Escape}')
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(toggle).toHaveFocus()
  })

  it('closes the mobile menu when navigating', async () => {
    renderAt('/')
    await userEvent.click(screen.getByRole('button', { name: 'Obre el menú' }))
    const menu = screen.getByRole('navigation', { name: 'Menú' })
    await userEvent.click(within(menu).getByRole('link', { name: 'Projectes' }))
    expect(screen.queryByRole('navigation', { name: 'Menú' })).not.toBeInTheDocument()
  })
})
