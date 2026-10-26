import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { Loader, SkeletonCard, SkeletonEmbed, SkeletonText } from '.'

it('announces the loader politely', () => {
  render(<Loader label="Carregant el formulari…" />)
  expect(screen.getByRole('status')).toHaveTextContent('Carregant el formulari…')
})

it('hides skeletons from assistive technology', () => {
  const { container } = render(
    <>
      <SkeletonText lines={[100, 60]} />
      <SkeletonEmbed type="video" />
      <SkeletonCard type="feature" />
      <SkeletonCard type="course" />
    </>,
  )
  for (const skeleton of container.children) expect(skeleton).toHaveAttribute('aria-hidden', 'true')
})
