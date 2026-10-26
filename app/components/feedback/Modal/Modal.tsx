import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import { IconButton } from '~/components/buttons'
import { cx } from '~/lib/cx'
import styles from './Modal.module.css'

type ModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Rendered as the dialog title, an h2 */
  title: ReactNode
  /** Image or logo before the title */
  media?: ReactNode
  /** Tags or details under the title */
  meta?: ReactNode
  /** Buttons at the bottom; wrap a button in `ModalClose` to close the dialog */
  footer?: ReactNode
  /** Accessible name of the close button */
  closeLabel?: string
  /** Runs when the dialog closes; call `event.preventDefault()` to move focus yourself */
  onCloseAutoFocus?: (event: Event) => void
  className?: string
  children: ReactNode
}

// Dialog shell: scrim, focus trap, Escape and close button; tall dialogs scroll inside the scrim
export function Modal({
  open,
  onOpenChange,
  title,
  media,
  meta,
  footer,
  closeLabel = 'Tanca',
  onCloseAutoFocus,
  className,
  children,
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay}>
          <Dialog.Content
            className={cx(styles.dialog, className)}
            aria-describedby={undefined}
            onCloseAutoFocus={onCloseAutoFocus}
          >
            <div className={styles.header}>
              {media && <div className={styles.media}>{media}</div>}
              <div className={styles.heading}>
                <Dialog.Title className={styles.title}>{title}</Dialog.Title>
                {meta}
              </div>
              <Dialog.Close asChild>
                <IconButton icon={X} label={closeLabel} />
              </Dialog.Close>
            </div>
            <div className={styles.body}>{children}</div>
            {footer && <div className={styles.footer}>{footer}</div>}
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

/** Closes the dialog it is in; use with `asChild` around a button */
export const ModalClose = Dialog.Close
