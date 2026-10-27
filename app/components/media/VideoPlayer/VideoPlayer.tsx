import { Play } from 'lucide-react'
import { useState } from 'react'
import { SkeletonEmbed } from '~/components/feedback'
import { Icon } from '~/components/icons'
import { cx } from '~/lib/cx'
import styles from './VideoPlayer.module.css'

export type Video = {
  youtubeId: string
  /** Accessible title of the video */
  title: string
  caption?: string
}

type VideoPlayerProps = Video & { className?: string }

// YouTube only loads after a click, so the page makes no request to it until then
export function VideoPlayer({ youtubeId, title, caption, className }: VideoPlayerProps) {
  const [state, setState] = useState<'idle' | 'loading' | 'ready'>('idle')

  return (
    <figure className={cx(styles.player, className)}>
      <div className={styles.media}>
        {state === 'idle' ? (
          <button type="button" className={styles.facade} onClick={() => setState('loading')}>
            <img
              src={`https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`}
              alt=""
              loading="lazy"
              decoding="async"
              className={styles.thumbnail}
            />
            <span className={styles.play}>
              <Icon icon={Play} size={22} />
            </span>
            <span className="visually-hidden">Reprodueix el vídeo: {title}</span>
          </button>
        ) : (
          <>
            {state === 'loading' && <SkeletonEmbed type="video" className={styles.skeleton} />}
            <iframe
              className={styles.frame}
              src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
              title={title}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              onLoad={() => setState('ready')}
            />
          </>
        )}
      </div>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  )
}
