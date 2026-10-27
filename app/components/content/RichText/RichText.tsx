import type { RichTextContent } from '~/content/schemas'
import styles from './RichText.module.css'

// Text from a content file with bold fragments, inline inside a paragraph
export function RichText({ text }: { text: RichTextContent }) {
  return text.map((piece, index) =>
    typeof piece === 'string' ? (
      piece
    ) : (
      // biome-ignore lint/suspicious/noArrayIndexKey: pieces are static and never reordered
      <strong key={index} className={styles.strong}>
        {piece.strong}
      </strong>
    ),
  )
}
