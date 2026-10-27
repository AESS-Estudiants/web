import { ArrowUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Icon } from '~/components/icons'
import { cx } from '~/lib/cx'
import styles from './ScrollToTopButton.module.css'

// Scroll distance after which the button appears
const THRESHOLD = 600

export function ScrollToTopButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const update = () => setVisible(window.scrollY > THRESHOLD)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  const scrollToTop = () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
  }

  return (
    <button
      type="button"
      className={cx(styles.button, visible && styles.visible)}
      aria-label="Torna a dalt"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      onClick={scrollToTop}
    >
      <Icon icon={ArrowUp} size={20} />
    </button>
  )
}
