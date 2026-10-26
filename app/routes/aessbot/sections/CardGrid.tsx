import { FeatureCard } from '~/components/cards'
import { RichText } from '~/components/content'
import { ICONS, type IconName } from '~/components/icons'
import styles from './CardGrid.module.css'

type CardGridProps = {
  cards: { icon: IconName; title: string; body: string }[]
}

// Cards with an icon, a title and a short text, three per row on desktop
export function CardGrid({ cards }: CardGridProps) {
  return (
    <div className={styles.grid}>
      {cards.map((card) => (
        <FeatureCard key={card.title} icon={ICONS[card.icon]} title={card.title}>
          <p>
            <RichText>{card.body}</RichText>
          </p>
        </FeatureCard>
      ))}
    </div>
  )
}
