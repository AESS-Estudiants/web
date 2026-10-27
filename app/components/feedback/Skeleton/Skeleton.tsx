import { FileText, Image, type LucideIcon, MapPin, Play } from 'lucide-react'
import type { CSSProperties, ReactNode } from 'react'
import { Icon } from '~/components/icons'
import { cx } from '~/lib/cx'
import styles from './Skeleton.module.css'

type Radius = 'xs' | 'sm' | 'md' | 'lg' | 'full'

type SkeletonProps = {
  width?: CSSProperties['width']
  height?: CSSProperties['height']
  radius?: Radius
  className?: string
  children?: ReactNode
}

// A grey shape with the shared shimmer; purely decorative
export function Skeleton({ width, height, radius = 'sm', className, children }: SkeletonProps) {
  return (
    <span
      className={cx(styles.shape, styles[radius], className)}
      style={{ width, height }}
      aria-hidden
    >
      {children}
    </span>
  )
}

type SkeletonTextProps = {
  /** Width of each line, in percent */
  lines?: number[]
  size?: 17 | 15 | 13
  className?: string
}

export function SkeletonText({ lines = [100, 80], size = 17, className }: SkeletonTextProps) {
  return (
    <span className={cx(styles.text, styles[`text${size}`], className)} aria-hidden>
      {lines.map((width, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: lines are static
        <span key={index} className={styles.line}>
          <Skeleton width={`${width}%`} radius="xs" className={styles.bar} />
        </span>
      ))}
    </span>
  )
}

const RATIOS = { '16:9': '16 / 9', A4: '210 / 297', '1:1': '1 / 1' }

type SkeletonMediaProps = {
  ratio?: keyof typeof RATIOS
  icon?: LucideIcon | null
  className?: string
}

// Placeholder for an image while it loads
export function SkeletonImage({ ratio = '16:9', icon = Image, className }: SkeletonMediaProps) {
  return (
    <span
      className={cx(styles.shape, styles.lg, styles.media, className)}
      style={{ aspectRatio: RATIOS[ratio] }}
      aria-hidden
    >
      {icon && <Icon icon={icon} size={22} className={styles.icon} />}
    </span>
  )
}

const EMBED_ICONS = { map: MapPin, video: Play, form: FileText }

type SkeletonEmbedProps = { type: keyof typeof EMBED_ICONS; className?: string }

// Placeholder for a map, video or form before it loads
export function SkeletonEmbed({ type, className }: SkeletonEmbedProps) {
  return (
    <SkeletonImage
      ratio={type === 'form' ? 'A4' : '16:9'}
      icon={EMBED_ICONS[type]}
      className={className}
    />
  )
}
