import type { ReactNode } from 'react'
import { Action } from '~/components/buttons/Action/Action'
import styles from './RichText.module.css'

// **bold** or [label](link)
const MARKUP = /\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\)/g

/** A page of the site, opened with the router; sections (#id) and files are plain links */
function isRoute(link: string) {
  return link.startsWith('/') && !/\.\w+$/.test(link)
}

/** Text from a content file with **bold** and [links](/path) inline */
export function RichText({ children }: { children: string }) {
  const parts: ReactNode[] = []
  let last = 0
  for (const match of children.matchAll(MARKUP)) {
    const [whole, bold, label, link] = match
    if (match.index > last) parts.push(children.slice(last, match.index))
    if (bold) {
      parts.push(
        <strong key={match.index} className={styles.strong}>
          {bold}
        </strong>,
      )
    } else if (label && link) {
      parts.push(
        isRoute(link) ? (
          <Action key={match.index} to={link} className={styles.link}>
            {label}
          </Action>
        ) : (
          <Action key={match.index} href={link} className={styles.link}>
            {label}
          </Action>
        ),
      )
    }
    last = match.index + whole.length
  }
  if (last < children.length) parts.push(children.slice(last))
  return <>{parts}</>
}
