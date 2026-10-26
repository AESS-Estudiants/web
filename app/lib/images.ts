import type { Picture } from 'vite-imagetools'

// Every photo in app/assets/images, built as a responsive picture and keyed by its path there
const pictures = import.meta.glob<Picture>('../assets/images/**/*.{jpg,jpeg,png}', {
  query: '?responsive',
  import: 'default',
  eager: true,
})

const PREFIX = '../assets/images/'

export const IMAGE_PATHS = Object.keys(pictures).map((key) => key.slice(PREFIX.length))

/** Picture for a path relative to app/assets/images, as written in the content files */
export function picture(path: string): Picture {
  const found = pictures[PREFIX + path]
  if (!found) throw new Error(`Image not found in app/assets/images: ${path}`)
  return found
}
