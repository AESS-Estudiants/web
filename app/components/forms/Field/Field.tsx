import { CircleAlert } from 'lucide-react'
import { type ReactNode, useId } from 'react'
import { Icon } from '~/components/icons'
import { cx } from '~/lib/cx'
import styles from './Field.module.css'

export type FieldProps = {
  label: string
  /** Hint under the control */
  helper?: string
  /** Replaces the helper and marks the control as invalid */
  error?: string
  disabled?: boolean
  className?: string
}

export type ControlProps = {
  id: string
  'aria-describedby'?: string
  'aria-invalid'?: true
}

type FieldFrameProps = FieldProps & { children: (control: ControlProps) => ReactNode }

// Label, control and helper or error message, wired together for assistive technology
export function Field({ label, helper, error, disabled, className, children }: FieldFrameProps) {
  const id = useId()
  const messageId = `${id}-message`
  const message = error ?? helper

  return (
    <div className={cx(styles.field, disabled && styles.disabled, className)}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      {children({
        id,
        'aria-describedby': message ? messageId : undefined,
        'aria-invalid': error ? true : undefined,
      })}
      {message && (
        <p id={messageId} className={cx(styles.message, error && styles.error)}>
          {error && <Icon icon={CircleAlert} size={16} />}
          {message}
        </p>
      )}
    </div>
  )
}
