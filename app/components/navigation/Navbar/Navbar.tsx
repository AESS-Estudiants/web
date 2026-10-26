import { Menu, UserPlus, X } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router'
import { Button, IconButton } from '~/components/buttons'
import { site } from '~/content/site'
import { cx } from '~/lib/cx'
import { Logo } from '../Logo/Logo'
import { MobileMenu } from '../MobileMenu/MobileMenu'
import styles from './Navbar.module.css'

export function Navbar() {
  const [open, setOpen] = useState(false)
  const menuId = useId()
  const toggleRef = useRef<HTMLButtonElement>(null)
  const { pathname } = useLocation()

  // A new page closes the menu
  // biome-ignore lint/correctness/useExhaustiveDependencies: runs on route change only
  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      toggleRef.current?.focus()
    }
    document.addEventListener('keydown', onKeyDown)
    document.documentElement.dataset.menuOpen = ''
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      delete document.documentElement.dataset.menuOpen
    }
  }, [open])

  return (
    <header className={styles.header}>
      <div className={styles.bar}>
        <div className={styles.side}>
          <Logo />
        </div>

        <nav className={styles.nav} aria-label="Principal">
          <ul className={styles.list}>
            {site.navigation.map((link) => (
              <li key={link.to}>
                {/* Only Inici is exact: pages are prerendered at /page/, with a trailing slash */}
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) => cx(styles.item, isActive && styles.current)}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className={cx(styles.side, styles.end)}>
          <Button to={site.join.to} icon={UserPlus} className={styles.cta}>
            {site.join.label}
          </Button>
          <IconButton
            ref={toggleRef}
            icon={open ? X : Menu}
            label={open ? 'Tanca el menú' : 'Obre el menú'}
            className={cx(styles.toggle, open && styles.toggleOpen)}
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((value) => !value)}
          />
        </div>
      </div>

      <MobileMenu id={menuId} open={open} />
    </header>
  )
}
