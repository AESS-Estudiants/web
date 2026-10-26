import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { courses } from '~/content/courses'
import type { Course } from '~/content/schemas'
import { renderWithRouter } from '~/test/render'
import { CourseList } from './CourseList'

vi.mock('~/lib/images', () => ({
  picture: () => ({
    sources: { webp: '/logo.webp 200w' },
    img: { src: '/logo.png', w: 200, h: 200 },
  }),
}))

const [first, second] = courses.items as [Course, Course, ...Course[]]

beforeEach(() => window.history.replaceState(null, '', '/cursos'))
afterEach(() => window.history.replaceState(null, '', '/'))

function moreInfo(name: string) {
  return screen.getByRole('button', { name: `Més informació sobre ${name}` })
}

it('opens the course in a dialog and closes it with Escape', async () => {
  const user = userEvent.setup()
  renderWithRouter(<CourseList courses={courses} />)

  await user.click(moreInfo(first.name))
  const dialog = screen.getByRole('dialog', { name: first.name })
  expect(dialog).toBeInTheDocument()
  expect(screen.getByRole('heading', { level: 2, name: first.name })).toBeInTheDocument()
  expect(dialog).toHaveTextContent(first.content ?? '')
  expect(window.location.search).toBe(`?curs=${first.slug}`)

  await user.keyboard('{Escape}')
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  expect(window.location.search).toBe('')
  expect(moreInfo(first.name)).toHaveFocus()
})

it('closes with the close button and returns focus to the card button', async () => {
  const user = userEvent.setup()
  renderWithRouter(<CourseList courses={courses} />)

  await user.click(moreInfo(second.name))
  await user.click(screen.getByRole('button', { name: 'Tanca' }))
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  expect(moreInfo(second.name)).toHaveFocus()

  await user.click(moreInfo(second.name))
  await user.click(screen.getByRole('button', { name: courses.modal.close }))
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  expect(moreInfo(second.name)).toHaveFocus()
})

it('opens the course of a shared link', async () => {
  window.history.replaceState(null, '', `/cursos?curs=${second.slug}`)
  renderWithRouter(<CourseList courses={courses} />)
  expect(await screen.findByRole('dialog', { name: second.name })).toBeInTheDocument()
})

it('ignores an unknown course in the link', () => {
  window.history.replaceState(null, '', '/cursos?curs=no-existeix')
  renderWithRouter(<CourseList courses={courses} />)
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
})
