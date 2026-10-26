import { FileText } from 'lucide-react'
import { useState } from 'react'
import { Button, TextLink } from '~/components/buttons'
import { SkeletonEmbed } from '~/components/feedback'
import { Icon } from '~/components/icons'
import { cx } from '~/lib/cx'
import styles from './FormEmbed.module.css'

type FormEmbedProps = {
  /** Google Form URL ending in /viewform */
  url: string
  /** Accessible title of the form */
  title: string
  className?: string
}

// Google Forms only loads after a click, so the page makes no request to Google until then
export function FormEmbed({ url, title, className }: FormEmbedProps) {
  const [state, setState] = useState<'idle' | 'loading' | 'ready'>('idle')

  return (
    <div className={cx(styles.embed, className)}>
      {state === 'idle' ? (
        <div className={styles.facade}>
          <span className={styles.icon}>
            <Icon icon={FileText} size={22} />
          </span>
          <p className={styles.text}>El formulari s'obre des de Google Forms.</p>
          <Button onClick={() => setState('loading')}>Carrega el formulari</Button>
          <TextLink href={url}>Obre'l a Google Forms</TextLink>
        </div>
      ) : (
        <>
          {state === 'loading' && <SkeletonEmbed type="form" className={styles.skeleton} />}
          <iframe
            className={styles.frame}
            src={`${url}?embedded=true`}
            title={title}
            onLoad={() => setState('ready')}
          />
        </>
      )}
    </div>
  )
}
