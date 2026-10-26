import { type RenderOptions, render } from '@testing-library/react'
import type { ReactElement } from 'react'
import { MemoryRouter } from 'react-router'

// Renders inside a router so components with links work in tests
export function renderWithRouter(ui: ReactElement, options?: RenderOptions) {
  return render(ui, { wrapper: MemoryRouter, ...options })
}
