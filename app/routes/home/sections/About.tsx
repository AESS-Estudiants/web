import { FeatureCard, WideCard } from '~/components/cards'
import { Carousel } from '~/components/carousel'
import { SectionHeader } from '~/components/content'
import { ICONS } from '~/components/icons'
import { Section } from '~/components/layout'
import { Picture } from '~/components/media'
import type { Home } from '~/content/schemas'
import { picture } from '~/lib/images'
import styles from './About.module.css'

export function About({ about }: { about: Home['about'] }) {
  const { intro } = about
  return (
    <Section tone="alt" id="qui-som" labelledBy="qui-som-title">
      <SectionHeader id="qui-som-title" title={about.title} link={about.link} />
      <div className={styles.mosaic}>
        <WideCard
          icon={ICONS[intro.icon]}
          eyebrow={intro.eyebrow}
          title={intro.title}
          as="h3"
          link={intro.link}
        >
          {intro.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </WideCard>
        <div className={styles.grid}>
          {about.cards.map((card) => (
            <FeatureCard
              key={card.title}
              icon={ICONS[card.icon]}
              eyebrow={card.eyebrow}
              title={card.title}
              to={card.to}
            >
              {card.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </FeatureCard>
          ))}
        </div>
      </div>
      <Carousel
        label={about.gallery.label}
        slides={about.gallery.images.map((image) => (
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
