import { Carousel } from '~/components/carousel'
import { SectionHeader } from '~/components/content'
import { Section } from '~/components/layout'
import { Picture } from '~/components/media'
import type { Projects } from '~/content/schemas'
import { picture } from '~/lib/images'
import styles from './sections.module.css'

export function Intro({ intro }: { intro: Projects['intro'] }) {
  return (
    <Section tone="alt" id="projectes" labelledBy="projectes-intro-title">
      <SectionHeader
        id="projectes-intro-title"
        title={intro.title}
        subtitle={intro.subtitle}
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
