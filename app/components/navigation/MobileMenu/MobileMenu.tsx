import { UserPlus } from 'lucide-react'
import { NavLink } from 'react-router'
import { Button } from '~/components/buttons'
import { SocialLinks } from '~/components/navigation/SocialLinks/SocialLinks'
import { site } from '~/content/site'
import { cx } from '~/lib/cx'
import styles from './MobileMenu.module.css'

type MobileMenuProps = { id: string; open: boolean }

export function MobileMenu({ id, open }: MobileMenuProps) {
  return (
    <nav id={id} className={cx(styles.panel, open && styles.open)} aria-label="Menú" hidden={!open}>
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
      <div className={styles.footer}>
        <Button to={site.join.to} icon={UserPlus} className={styles.cta}>
          {site.join.label}
        </Button>
        <SocialLinks size={44} className={styles.socials} />
      </div>
    </nav>
  )
}
