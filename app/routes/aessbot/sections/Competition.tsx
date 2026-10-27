import { Carousel } from '~/components/carousel'
import { SectionHeader } from '~/components/content'
import { Section } from '~/components/layout'
import { EditionsPlayer, Picture } from '~/components/media'
import type { Aessbot, AessbotEdition } from '~/content/schemas'
import { picture } from '~/lib/images'

type CompetitionProps = {
  competition: AessbotEdition['competition']
  editions: Aessbot['editions']['items']
}

export function Competition({ competition, editions }: CompetitionProps) {
  const { gallery } = competition
  return (
    <Section tone="alt" id="la-competicio" labelledBy="la-competicio-title">
      <SectionHeader
        id="la-competicio-title"
        title={competition.title}
        subtitle={competition.subtitle}
      />
      <EditionsPlayer editions={editions} />
      {gallery && (
        <Carousel
          label={gallery.label}
          slides={gallery.images.map((image) => (
            <Picture
              key={image.src}
              src={picture(image.src)}
              alt={image.alt}
              sizes="(min-width: 1024px) 1040px, 100vw"
            />
          ))}
        />
      )}
    </Section>
  )
}
