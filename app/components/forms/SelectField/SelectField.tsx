import { ChevronDown } from 'lucide-react'
import type { ComponentPropsWithRef } from 'react'
import { Icon } from '~/components/icons'
import { cx } from '~/lib/cx'
import control from '../control.module.css'
import { Field, type FieldProps } from '../Field/Field'
import styles from './SelectField.module.css'

type SelectFieldProps = FieldProps &
  Omit<ComponentPropsWithRef<'select'>, 'id' | 'className' | 'children'> & {
    options: { value: string; label: string }[]
    /** First option with no value, shown until one is picked */
    placeholder?: string
  }

export function SelectField({
  label,
  helper,
  error,
  className,
  options,
  placeholder,
  ...props
}: SelectFieldProps) {
  return (
    <Field
      label={label}
      helper={helper}
      error={error}
      disabled={props.disabled}
      className={className}
    >
      {(ids) => (
        <div className={styles.wrapper}>
          <select
            className={cx(control.control, styles.select)}
            defaultValue={props.value === undefined && placeholder ? '' : undefined}
            {...ids}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <Icon icon={ChevronDown} className={styles.chevron} />
        </div>
      )}
    </Field>
  )
}
