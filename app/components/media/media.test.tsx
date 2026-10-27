import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it } from 'vitest'
import { EditionsPlayer, MapEmbed, VideoPlayer } from '.'

it('loads YouTube only after the play button is pressed', async () => {
  const { container } = render(<VideoPlayer youtubeId="abc" title="AESSBot 2025" />)
  expect(container.querySelector('iframe')).toBeNull()

  await userEvent.click(screen.getByRole('button', { name: 'Reprodueix el vídeo: AESSBot 2025' }))
  const frame = screen.getByTitle('AESSBot 2025')
  expect(frame.getAttribute('src')).toContain('youtube-nocookie.com/embed/abc')
})

it('selects the newest edition with a video and marks upcoming ones', () => {
  render(
    <EditionsPlayer
      editions={[
        { year: 2026 },
        { year: 2025, video: { youtubeId: 'abc', title: 'AESSBot 2025' } },
      ]}
    />,
  )
  expect(screen.getByRole('tab', { name: '2026 · Properament' })).toBeDisabled()
  expect(screen.getByRole('tab', { name: '2025' })).toHaveAttribute('aria-selected', 'true')
  expect(screen.getByRole('button', { name: 'Reprodueix el vídeo: AESSBot 2025' })).toBeVisible()
})

it('loads Google Maps only after the button is pressed', async () => {
  const { container } = render(
    <MapEmbed
      src="https://www.google.com/maps/embed?pb=abc"
      title="Ubicació Campus Nord UPC"
      label="Mostra el mapa"
    />,
  )
  expect(container.querySelector('iframe')).toBeNull()

  await userEvent.click(
    screen.getByRole('button', { name: 'Mostra el mapa: Ubicació Campus Nord UPC' }),
  )
  expect(screen.getByTitle('Ubicació Campus Nord UPC')).toHaveAttribute(
    'src',
    'https://www.google.com/maps/embed?pb=abc',
  )
})
