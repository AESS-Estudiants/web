import emailjs from '@emailjs/browser'
import { CircleAlert, CircleCheck, Send } from 'lucide-react'
import { type ChangeEvent, type FormEvent, useRef, useState } from 'react'
import { Button } from '~/components/buttons'
import { Checkbox, SelectField, TextArea, TextField } from '~/components/forms'
import { Icon } from '~/components/icons'
import { Section } from '~/components/layout'
import type { Contact } from '~/content/schemas'
import { emailJsEnv } from '~/lib/env'
import styles from './ContactForm.module.css'

type Form = Contact['form']

// Names read by the EmailJS template, the same as on the previous site
const FIELDS = ['from_name', 'reply_to', 'phone', 'user-type', 'subject', 'message'] as const
type FieldName = (typeof FIELDS)[number]
type Values = Record<FieldName, string> & { accept: boolean }
type Errors = Partial<Record<FieldName | 'accept', string>>

const EMPTY: Values = {
  from_name: '',
  reply_to: '',
  phone: '',
  'user-type': '',
  subject: '',
  message: '',
  accept: false,
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE = /^\+?[\d\s().-]{6,20}$/

export function validate(values: Values, form: Form): Errors {
  const { fields } = form
  const errors: Errors = {}
  for (const name of FIELDS) {
    const message = fields[name].required
    if (message && !values[name].trim()) errors[name] = message
  }
  if (!errors.reply_to && !EMAIL.test(values.reply_to.trim())) {
    errors.reply_to = fields.reply_to.invalid
  }
  if (values.phone.trim() && !PHONE.test(values.phone.trim())) {
    errors.phone = fields.phone.invalid
  }
  if (!values.accept) errors.accept = form.privacy.required
  return errors
}

type Status = 'idle' | 'sending' | 'sent' | 'error'

export function ContactForm({ form }: { form: Form }) {
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState<Errors>({})
  const [submitted, setSubmitted] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const formRef = useRef<HTMLFormElement>(null)
  const responseRef = useRef<HTMLDivElement>(null)
  const { fields } = form
  const sending = status === 'sending'

  const update = (next: Values) => {
    setValues(next)
    // After the first attempt, errors follow what the person types
    if (submitted) setErrors(validate(next, form))
  }

  const onChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => update({ ...values, [event.target.name]: event.target.value })

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
    const found = validate(values, form)
    setErrors(found)
    const first = [...FIELDS, 'accept'].find((name) => name in found)
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
      return
    }

    setStatus('sending')
    try {
      const { serviceId, templateId, publicKey } = emailJsEnv()
      const { accept: _, ...params } = values
      await emailjs.send(serviceId, templateId, params, { publicKey })
      setValues(EMPTY)
      setSubmitted(false)
      setStatus('sent')
    } catch (error) {
      console.error("Error en l'enviament:", error)
      setStatus('error')
    }
    requestAnimationFrame(() =>
      responseRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }),
    )
  }

  const field = (name: FieldName) => ({
    name,
    value: values[name],
    onChange,
    label: fields[name].label,
    placeholder: fields[name].placeholder,
    error: errors[name],
    disabled: sending,
    required: Boolean(fields[name].required),
  })

  return (
    <Section id="formulari" labelledBy="formulari-title">
      <form ref={formRef} className={styles.form} noValidate onSubmit={onSubmit}>
        <div ref={responseRef} className={styles.header}>
          <h2 id="formulari-title" className={styles.title}>
            {form.title}
          </h2>
          <div role="status">
            {status === 'sent' && (
              <p className={styles.response}>
                <Icon icon={CircleCheck} className={styles.responseIcon} />
                {form.success}
              </p>
            )}
          </div>
          {status === 'error' && (
            <p role="alert" className={`${styles.response} ${styles.failed}`}>
              <Icon icon={CircleAlert} className={styles.responseIcon} />
              {form.error}
            </p>
          )}
        </div>

        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>{form.personal}</legend>
          <div className={styles.grid}>
            <TextField {...field('from_name')} autoComplete="name" />
            <TextField {...field('reply_to')} type="email" autoComplete="email" />
            <TextField {...field('phone')} type="tel" autoComplete="tel" />
          </div>
        </fieldset>

        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>{form.message}</legend>
          <div className={styles.grid}>
            <SelectField
              {...field('user-type')}
              placeholder={fields['user-type'].placeholder}
              options={fields['user-type'].options.map((option) => ({
                value: option,
                label: option,
              }))}
            />
            <TextField {...field('subject')} />
            <TextArea {...field('message')} rows={4} className={styles.wide} />
          </div>
        </fieldset>

        <div className={styles.privacy}>
          <Checkbox
            name="accept"
            checked={values.accept}
            onChange={(event) => update({ ...values, accept: event.target.checked })}
            required
            disabled={sending}
            aria-invalid={errors.accept ? true : undefined}
            aria-describedby={errors.accept ? 'accept-error' : undefined}
          >
            {form.privacy.before}{' '}
            <a
              href={form.privacy.link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              {form.privacy.link.label}
              <span className="visually-hidden">, s'obre en una pestanya nova</span>
            </a>
            *
          </Checkbox>
          {errors.accept && (
            <p id="accept-error" className={styles.error}>
              <Icon icon={CircleAlert} size={16} />
              {errors.accept}
            </p>
          )}
        </div>

        <div className={styles.submit}>
          <Button type="submit" icon={Send} loading={sending} className={styles.button}>
            {sending ? form.sending : form.submit}
          </Button>
        </div>
      </form>
    </Section>
  )
}
