import type { ReactNode } from 'react'
import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router'
import { ErrorState } from '~/components/feedback'
import { SiteLayout } from '~/components/layout'
import { errors } from '~/content/errors'
import type { Route } from './+types/root'
import '@fontsource-variable/inter'
import interLatin from '@fontsource-variable/inter/files/inter-latin-wght-normal.woff2?url'
import '~/styles/tokens.css'
import '~/styles/base.css'
import '~/styles/motion.css'

export const links: Route.LinksFunction = () => [
  { rel: 'icon', href: '/images/logos/aess/Cub.svg', type: 'image/svg+xml' },
  { rel: 'preload', href: interLatin, as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
]

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="ca">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0f1020" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return (
    <SiteLayout>
      <Outlet />
    </SiteLayout>
  )
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const missing = isRouteErrorResponse(error) && error.status === 404
  return (
    <SiteLayout>
      <ErrorState {...(missing ? errors.notFound : errors.unexpected)} />
    </SiteLayout>
  )
}
