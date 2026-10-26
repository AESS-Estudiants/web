import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Checkbox, RadioGroup, SelectField, TextArea, TextField } from '.'

describe('TextField', () => {
  it('links the label and the helper', () => {
    render(<TextField label="Nom" helper="Com vols que et diguem." />)
    const input = screen.getByRole('textbox', { name: 'Nom' })
    expect(input).toHaveAccessibleDescription('Com vols que et diguem.')
    expect(input).not.toHaveAttribute('aria-invalid')
  })

  it('shows the error instead of the helper and marks the field invalid', () => {
    render(<TextField label="Nom" helper="Ajuda" error="Aquest camp és obligatori." />)
    const input = screen.getByRole('textbox', { name: 'Nom' })
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAccessibleDescription('Aquest camp és obligatori.')
    expect(screen.queryByText('Ajuda')).not.toBeInTheDocument()
  })
})

it('renders a labelled textarea', () => {
  render(<TextArea label="Missatge" />)
  expect(screen.getByRole('textbox', { name: 'Missatge' }).tagName).toBe('TEXTAREA')
})

it('starts the select on its placeholder', () => {
  render(
    <SelectField
      label="Escola"
      placeholder="Tria una opció"
      options={[{ value: 'etsetb', label: 'ETSETB' }]}
    />,
  )
  expect(screen.getByRole('combobox', { name: 'Escola' })).toHaveValue('')
})

it('toggles a checkbox from its label', async () => {
  render(<Checkbox>Accepto la política de privacitat</Checkbox>)
  const checkbox = screen.getByRole('checkbox', { name: 'Accepto la política de privacitat' })
  await userEvent.click(screen.getByText('Accepto la política de privacitat'))
  expect(checkbox).toBeChecked()
})

it('groups radios under a legend and reports the choice', async () => {
  const onChange = vi.fn()
  render(
    <RadioGroup
      legend="Escola"
      name="school"
      options={[
        { value: 'etsetb', label: 'Telecos (ETSETB)' },
        { value: 'fib', label: 'Informàtica (FIB)' },
      ]}
      onChange={onChange}
    />,
  )
  expect(screen.getByRole('group', { name: 'Escola' })).toBeInTheDocument()
  await userEvent.click(screen.getByRole('radio', { name: 'Informàtica (FIB)' }))
  expect(onChange).toHaveBeenCalledWith('fib')
})
