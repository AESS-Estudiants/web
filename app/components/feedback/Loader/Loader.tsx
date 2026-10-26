import { cx } from '~/lib/cx'
import styles from './Loader.module.css'

type LoaderProps = { label?: string; className?: string }

export function Loader({ label = 'Carregant…', className }: LoaderProps) {
  return (
    <span role="status" className={cx(styles.loader, className)}>
      <span className="visually-hidden">{label}</span>
    </span>
  )
}
