import { MapPin } from 'lucide-react'
import { useState } from 'react'
import { SkeletonEmbed } from '~/components/feedback'
import { Icon } from '~/components/icons'
import { cx } from '~/lib/cx'
import styles from './MapEmbed.module.css'

type MapEmbedProps = {
  /** Google Maps embed URL */
  src: string
  /** Accessible title of the map */
  title: string
  /** Visible text of the button that loads the map */
  label: string
  className?: string
}

// Google Maps only loads after a click, so the page makes no request to Google until then
export function MapEmbed({ src, title, label, className }: MapEmbedProps) {
  const [state, setState] = useState<'idle' | 'loading' | 'ready'>('idle')

  return (
    <div className={cx(styles.map, className)}>
      {state === 'idle' ? (
        <button type="button" className={styles.facade} onClick={() => setState('loading')}>
          <span className={styles.pin}>
            <Icon icon={MapPin} size={22} />
          </span>
          <span>
            {label}
            <span className="visually-hidden">: {title}</span>
          </span>
        </button>
      ) : (
        <>
          {state === 'loading' && <SkeletonEmbed type="map" className={styles.skeleton} />}
          <iframe
            className={styles.frame}
            src={src}
            title={title}
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            onLoad={() => setState('ready')}
          />
        </>
      )}
    </div>
  )
}
