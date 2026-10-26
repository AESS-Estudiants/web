import { Picture } from '~/components/media'
import type { LogoContent } from '~/content/schemas'
import { picture } from '~/lib/images'

// SVG logos are served as they are from public/; photos are built as responsive pictures
export function CourseLogo({ logo, sizes }: { logo: LogoContent; sizes: string }) {
  if (logo.src.endsWith('.svg')) {
    return <img src={logo.src} alt={logo.alt} loading="lazy" decoding="async" />
  }
  return <Picture src={picture(logo.src)} alt={logo.alt} sizes={sizes} />
}
