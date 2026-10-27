import type { ComponentPropsWithRef, ReactNode } from 'react'
import { Link } from 'react-router'

type BaseProps = { className?: string; children: ReactNode }

export type ActionLinkProps = BaseProps & {
  /** Internal route, rendered with React Router */
  to: string
} & Omit<ComponentPropsWithRef<'a'>, 'href' | 'className' | 'children'>

export type ActionAnchorProps = BaseProps & {
  /** External URL or file, opened in a new tab when it leaves the site */
  href: string
} & Omit<ComponentPropsWithRef<'a'>, 'className' | 'children'>

export type ActionButtonProps = BaseProps &
  Omit<ComponentPropsWithRef<'button'>, 'className' | 'children'>

export type ActionProps = ActionLinkProps | ActionAnchorProps | ActionButtonProps

// Omit that keeps each member of a union apart
export type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never

// Read by screen readers after the label of links that open a new tab
const NEW_TAB_HINT = ", s'obre en una pestanya nova"

export function isExternal(href: string) {
  return /^https?:\/\//.test(href)
}

// Renders a router link, an anchor or a button with the same styles
export function Action(props: ActionProps) {
  if ('to' in props) {
    const { to, className, children, ...rest } = props
    return (
      <Link to={to} className={className} {...rest}>
        {children}
      </Link>
    )
  }

  if ('href' in props) {
    const { href, className, children, ...rest } = props
    const external = isExternal(href)
    return (
      <a
        href={href}
        className={className}
        {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
        {...rest}
      >
        {children}
        {external && <span className="visually-hidden">{NEW_TAB_HINT}</span>}
      </a>
    )
  }

  const { className, children, type = 'button', ...rest } = props
  return (
    <button type={type} className={className} {...rest}>
      {children}
    </button>
  )
}
