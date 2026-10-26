import emailjs from '@emailjs/browser'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { contact } from '~/content/contact'
import { ContactForm } from './ContactForm'

vi.mock('@emailjs/browser', () => ({ default: { send: vi.fn() } }))

const send = vi.mocked(emailjs.send)
const { form } = contact

async function fillIn(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Nom*'), 'Ada Lovelace')
  await user.type(screen.getByLabelText('Email*'), 'ada@example.com')
  await user.selectOptions(screen.getByLabelText('Tema*'), 'AESSBot')
  await user.type(screen.getByLabelText('Assumpte*'), 'Inscripció')
  await user.type(screen.getByLabelText('El teu missatge*'), 'Hola!')
  await user.click(screen.getByRole('checkbox'))
}

describe('ContactForm', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_EMAILJS_SERVICE_ID', 'service')
    vi.stubEnv('VITE_EMAILJS_TEMPLATE_ID', 'template')
    vi.stubEnv('VITE_EMAILJS_PUBLIC_KEY', 'key')
    window.HTMLElement.prototype.scrollIntoView = vi.fn()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.restoreAllMocks()
    send.mockReset()
  })

  it('shows an error for each invalid field and focuses the first one', async () => {
    const user = userEvent.setup()
    render(<ContactForm form={form} />)
    await user.type(screen.getByLabelText('Email*'), 'not-an-email')
    await user.click(screen.getByRole('button', { name: form.submit }))

    const name = screen.getByLabelText('Nom*')
    expect(name).toHaveFocus()
    expect(name).toHaveAccessibleDescription(form.fields.from_name.required)
    expect(screen.getByLabelText('Email*')).toHaveAccessibleDescription(
      form.fields.reply_to.invalid,
    )
    expect(screen.getByLabelText('Tema*')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByRole('checkbox')).toHaveAccessibleDescription(form.privacy.required)
    expect(screen.getByLabelText('Telèfon')).not.toHaveAttribute('aria-invalid')
    expect(send).not.toHaveBeenCalled()

    // Errors clear as soon as the field is fixed
    await user.type(name, 'Ada')
    expect(name).not.toHaveAttribute('aria-invalid')
  })

  it('sends the message with the template field names and confirms it', async () => {
    send.mockResolvedValue({ status: 200, text: 'OK' })
    const user = userEvent.setup()
    render(<ContactForm form={form} />)
    await fillIn(user)
    await user.click(screen.getByRole('button', { name: form.submit }))

    expect(send).toHaveBeenCalledWith(
      'service',
      'template',
      {
        from_name: 'Ada Lovelace',
        reply_to: 'ada@example.com',
        phone: '',
        'user-type': 'AESSBot',
        subject: 'Inscripció',
        message: 'Hola!',
      },
      { publicKey: 'key' },
    )
    expect(await screen.findByRole('status')).toHaveTextContent(form.success)
    expect(screen.getByLabelText('Nom*')).toHaveValue('')
    expect(screen.queryByRole('alert')).toBeNull()
  })

  it('blocks the form while sending', async () => {
    send.mockReturnValue(new Promise(() => {}))
    const user = userEvent.setup()
    render(<ContactForm form={form} />)
    await fillIn(user)
    await user.click(screen.getByRole('button', { name: form.submit }))

    const button = screen.getByRole('button', { name: form.sending })
    expect(button).toHaveAttribute('aria-busy', 'true')
    expect(screen.getByLabelText('Nom*')).toBeDisabled()
  })

  it('shows an alert and keeps the message when sending fails', async () => {
    send.mockRejectedValue(new Error('Network'))
    const user = userEvent.setup()
    render(<ContactForm form={form} />)
    await fillIn(user)
    await user.click(screen.getByRole('button', { name: form.submit }))

    expect(await screen.findByRole('alert')).toHaveTextContent(form.error)
    expect(screen.getByLabelText('Nom*')).toHaveValue('Ada Lovelace')
    expect(screen.getByRole('button', { name: form.submit })).toBeEnabled()
  })

  it('fails without sending when the EmailJS keys are missing', async () => {
    vi.unstubAllEnvs()
    vi.stubEnv('VITE_EMAILJS_SERVICE_ID', '')
    const user = userEvent.setup()
    render(<ContactForm form={form} />)
    await fillIn(user)
    await user.click(screen.getByRole('button', { name: form.submit }))

    expect(await screen.findByRole('alert')).toHaveTextContent(form.error)
    expect(send).not.toHaveBeenCalled()
  })
})
