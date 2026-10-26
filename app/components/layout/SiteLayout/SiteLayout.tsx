import type { ReactNode } from 'react'
import { ScrollToTopButton } from '~/components/buttons'
import { Footer, Navbar } from '~/components/navigation'
import styles from './SiteLayout.module.css'

export const MAIN_ID = 'contingut'

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <a href={`#${MAIN_ID}`} className={styles.skip}>
        Salta al contingut
      </a>
      <Navbar />
      <main id={MAIN_ID} tabIndex={-1} className={styles.main}>
        {children}
      </main>
      <Footer />
      <ScrollToTopButton />
    </>
  )
}
