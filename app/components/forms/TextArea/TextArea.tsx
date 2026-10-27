import type { ComponentPropsWithRef } from 'react'
import { cx } from '~/lib/cx'
import control from '../control.module.css'
import { Field, type FieldProps } from '../Field/Field'
import styles from './TextArea.module.css'

type TextAreaProps = FieldProps & Omit<ComponentPropsWithRef<'textarea'>, 'id' | 'className'>

export function TextArea({ label, helper, error, className, rows = 5, ...props }: TextAreaProps) {
  return (
    <Field
      label={label}
      helper={helper}
      error={error}
      disabled={props.disabled}
      className={className}
    >
      {(ids) => (
        <textarea
          className={cx(control.control, styles.textarea)}
          rows={rows}
          {...ids}
          {...props}
        />
      )}
    </Field>
  )
}
