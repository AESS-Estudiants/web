import type { LinkDescriptor } from 'react-router'
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

/**
 * Head link that starts downloading the main image of a page with the HTML, before the CSS.
 * Use the same `sizes` as its <Picture>.
 */
export function preloadPicture(path: string, sizes: string): LinkDescriptor {
  const { sources, img } = picture(path)
  return {
    rel: 'preload',
    as: 'image',
    type: 'image/avif',
    href: img.src,
    imageSrcSet: sources.avif ?? img.src,
    imageSizes: sizes,
    // React renders it; React Router's link type just doesn't list it yet
    ...({ fetchPriority: 'high' } as object),
  }
}
