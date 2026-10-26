import type { LucideIcon } from 'lucide-react'
import { IconButton } from '~/components/buttons'
import { Github, Instagram, Linkedin } from '~/components/icons'
import { type SocialNetwork, site } from '~/content/site'
import { cx } from '~/lib/cx'
import styles from './SocialLinks.module.css'

const ICONS: Record<SocialNetwork, LucideIcon> = {
  instagram: Instagram,
  linkedin: Linkedin,
  github: Github,
}

type SocialLinksProps = { size?: 44 | 40; className?: string }

export function SocialLinks({ size = 40, className }: SocialLinksProps) {
  return (
    <ul className={cx(styles.list, className)}>
      {site.socials.map((social) => (
        <li key={social.network}>
          <IconButton
            href={social.url}
            icon={ICONS[social.network as SocialNetwork]}
            label={`${social.label}, s'obre en una pestanya nova`}
            size={size}
          />
        </li>
      ))}
    </ul>
  )
}
