import type { LucideIcon } from 'lucide-react'

export type IconSize = 16 | 18 | 20 | 22

type IconProps = {
  icon: LucideIcon
  size?: IconSize
  className?: string
}

// Lucide icons drawn like in Figma: 1.5 stroke on the 24 grid, scaled with the size
export function Icon({ icon: Glyph, size = 18, className }: IconProps) {
  return <Glyph size={size} strokeWidth={1.5} className={className} aria-hidden focusable={false} />
}
