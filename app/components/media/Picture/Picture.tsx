import { useEffect, useRef, useState } from 'react'
import type { Picture as PictureData } from 'vite-imagetools'
import { cx } from '~/lib/cx'
import styles from './Picture.module.css'

type PictureProps = {
  /** An image imported with `?responsive` */
  src: PictureData
  alt: string
  /** Width the image takes on screen, so the browser picks the right file */
  sizes?: string
  /** For the image at the top of the page: loads first and without lazy loading */
  priority?: boolean
  className?: string
}

const MIME: Record<string, string> = { avif: 'image/avif', webp: 'image/webp', jpg: 'image/jpeg' }

export function Picture({ src, alt, sizes = '100vw', priority = false, className }: PictureProps) {
  const imgRef = useRef<HTMLImageElement>(null)
  // The main image shows straight away: fading it in would wait for JavaScript and delay the LCP
  const [loaded, setLoaded] = useState(priority)

  // The image may finish loading before React hydrates and misses the load event
  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true)
  }, [])

  return (
    <picture className={cx(styles.picture, loaded && styles.loaded, className)}>
      {Object.entries(src.sources).map(([format, srcSet]) => (
        <source key={format} type={MIME[format]} srcSet={srcSet} sizes={sizes} />
      ))}
      <img
        ref={imgRef}
        src={src.img.src}
        width={src.img.w}
        height={src.img.h}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        className={styles.img}
        onLoad={() => setLoaded(true)}
      />
    </picture>
  )
}
