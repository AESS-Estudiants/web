import { inject } from '@vercel/analytics'
import { useEffect } from 'react'
import { SITE_URL } from '~/lib/seo'

// Vercel Analytics only on the live domain: previews and local builds don't have the script
export function SiteAnalytics() {
  useEffect(() => {
    if (window.location.origin === SITE_URL) inject({ mode: 'production' })
  }, [])
  return null
}
