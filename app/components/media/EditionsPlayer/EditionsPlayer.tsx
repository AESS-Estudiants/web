import * as Tabs from '@radix-ui/react-tabs'
import { cx } from '~/lib/cx'
import { type Video, VideoPlayer } from '../VideoPlayer/VideoPlayer'
import styles from './EditionsPlayer.module.css'

export type Edition = {
  year: number
  /** Summary video; an edition without one is shown as coming soon */
  video?: Video
}

type EditionsPlayerProps = {
  /** Newest first */
  editions: Edition[]
  className?: string
}

// Summary video of each AESSBot edition, picked with a segmented control
export function EditionsPlayer({ editions, className }: EditionsPlayerProps) {
  const firstWithVideo = editions.find((edition) => edition.video)
  if (!firstWithVideo) return null

  return (
    <Tabs.Root defaultValue={String(firstWithVideo.year)} className={cx(styles.player, className)}>
      <Tabs.List aria-label="Edicions" className={styles.tabs}>
        {editions.map((edition) => (
          <Tabs.Trigger
            key={edition.year}
            value={String(edition.year)}
            disabled={!edition.video}
            className={styles.tab}
          >
            {edition.video ? edition.year : `${edition.year} · Properament`}
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      {editions.map(
        (edition) =>
          edition.video && (
            <Tabs.Content key={edition.year} value={String(edition.year)} className={styles.panel}>
              <VideoPlayer {...edition.video} />
            </Tabs.Content>
          ),
      )}
    </Tabs.Root>
  )
}
