import type { ChangeEvent } from 'react'
import { cx } from '~/lib/cx'
import styles from './RadioGroup.module.css'

type RadioGroupProps = {
  legend: string
  name: string
  options: { value: string; label: string }[]
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  required?: boolean
  disabled?: boolean
  className?: string
}

export function RadioGroup({
  legend,
  name,
  options,
  value,
  defaultValue,
  onChange,
  required,
  disabled,
  className,
}: RadioGroupProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => onChange?.(event.target.value)

  return (
    <fieldset className={cx(styles.group, className)} disabled={disabled}>
      <legend className={styles.legend}>{legend}</legend>
      <div className={styles.options}>
        {options.map((option) => (
          <label key={option.value} className={styles.option}>
            <span className={styles.box}>
              <input
                type="radio"
                name={name}
                value={option.value}
                className={styles.input}
                required={required}
                {...(value === undefined
                  ? { defaultChecked: option.value === defaultValue }
                  : { checked: option.value === value })}
                onChange={handleChange}
              />
            </span>
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
