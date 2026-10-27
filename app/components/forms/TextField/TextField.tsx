import type { ComponentPropsWithRef } from 'react'
import control from '../control.module.css'
import { Field, type FieldProps } from '../Field/Field'

type TextFieldProps = FieldProps & Omit<ComponentPropsWithRef<'input'>, 'id' | 'className'>

export function TextField({ label, helper, error, className, ...props }: TextFieldProps) {
  return (
    <Field
      label={label}
      helper={helper}
      error={error}
      disabled={props.disabled}
      className={className}
    >
      {(ids) => <input className={control.control} {...ids} {...props} />}
    </Field>
  )
}
