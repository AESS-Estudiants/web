import { UserPlus } from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '~/components/buttons'
import { SocialLinks } from '~/components/navigation/SocialLinks/SocialLinks'
import { site } from '~/content/site'
import { cx } from '~/lib/cx'
import { useIsCurrentPage } from '../current-page'
import styles from './MobileMenu.module.css'

type MobileMenuProps = { id: string; open: boolean }

export function MobileMenu({ id, open }: MobileMenuProps) {
  const isCurrent = useIsCurrentPage()
  return (
    <nav id={id} className={cx(styles.panel, open && styles.open)} aria-label="Menú" hidden={!open}>
      <ul className={styles.list}>
        {site.navigation.map((link) => (
          <li key={link.to}>
            <Link
              to={link.to}
              aria-current={isCurrent(link.to) ? 'page' : undefined}
              className={cx(styles.item, isCurrent(link.to) && styles.current)}
            >
              {link.label}
            </Link>
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
