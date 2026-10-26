import { Button } from '~/components/buttons'
import styles from './ErrorState.module.css'

type ErrorStateProps = {
  /** Big number above the title, such as 404 */
  code?: string
  title: string
  description: string
  action?: { label: string; to: string }
}

// Full-page message for missing pages and unexpected errors
export function ErrorState({ code, title, description, action }: ErrorStateProps) {
  return (
    <section className={styles.state} aria-labelledby="error-title">
      {code && (
        <p className={styles.code} aria-hidden>
          {code}
        </p>
      )}
      <h1 id="error-title" className={styles.title}>
        {title}
      </h1>
      <p className={styles.description}>{description}</p>
      {action && (
        <Button to={action.to} className={styles.action}>
          {action.label}
        </Button>
      )}
    </section>
  )
}
