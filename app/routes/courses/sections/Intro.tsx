import { Carousel } from '~/components/carousel'
import { RichText, SectionHeader } from '~/components/content'
import { Section } from '~/components/layout'
import { Picture } from '~/components/media'
import type { Courses } from '~/content/schemas'
import { picture } from '~/lib/images'
import styles from './Intro.module.css'

export function Intro({ intro }: { intro: Courses['intro'] }) {
  return (
    <Section tone="alt" id="sobre-els-cursos" labelledBy="sobre-els-cursos-title">
      <SectionHeader
        id="sobre-els-cursos-title"
        title={intro.title}
        subtitle={<RichText>{intro.subtitle}</RichText>}
        className={styles.header}
      />
      <Carousel
        label={intro.gallery.label}
        slides={intro.gallery.images.map((image) => (
          <Picture
            key={image.src}
            src={picture(image.src)}
            alt={image.alt}
            sizes="(min-width: 1024px) 1014px, 100vw"
          />
        ))}
      />
    </Section>
  )
}
