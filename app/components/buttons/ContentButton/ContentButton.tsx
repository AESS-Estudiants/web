import { ICONS } from '~/components/icons/registry'
import type { Action } from '~/content/schemas'
import { Button } from '../Button/Button'

type ContentButtonProps = {
  action: Action
  size?: 'large' | 'small'
  className?: string
}

// Button described in a content file
export function ContentButton({ action, size, className }: ContentButtonProps) {
  const common = {
    variant: action.variant,
    size,
    icon: action.icon ? ICONS[action.icon] : undefined,
    arrow: action.arrow,
    className,
  }
  // Links to a section of the same page are plain anchors
  if (action.to && !action.to.startsWith('#')) {
    return (
      <Button to={action.to} {...common}>
        {action.label}
      </Button>
    )
  }
  return (
    <Button href={action.to ?? action.href ?? '#'} {...common}>
      {action.label}
    </Button>
  )
}
