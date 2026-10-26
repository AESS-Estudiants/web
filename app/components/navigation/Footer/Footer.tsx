import { site } from '~/content/site'
import { FooterLink } from '../FooterLink/FooterLink'
import { Logo } from '../Logo/Logo'
import { SocialLinks } from '../SocialLinks/SocialLinks'
import styles from './Footer.module.css'

export function Footer() {
  const year = new Date().getFullYear()
  const { contact } = site

  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.brand}>
          <Logo />
          <p className={styles.description}>{site.description}</p>
          <SocialLinks />
        </div>

        <address className={styles.contact}>
          <h2 className={styles.heading}>Contacte</h2>
          <FooterLink href={`mailto:${contact.email}`}>{contact.email}</FooterLink>
          <FooterLink href={`tel:${contact.phone}`}>{contact.phoneLabel}</FooterLink>
          <p className={styles.address}>{contact.address}</p>
        </address>
      </div>

      <div className={styles.sub}>
        <p className={styles.copyright}>© {year} AESS Estudiants · Tots els drets reservats</p>
        <ul className={styles.legal}>
          {site.legal.map((link) => (
            <li key={link.href}>
              <FooterLink href={link.href} size="small">
                {link.label}
              </FooterLink>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
