import { cp, rm } from 'node:fs/promises'
import { join } from 'node:path'
import type { Config } from '@react-router/dev/config'

export default {
  // Static site: every route is rendered to HTML at build time
  ssr: false,
  // The not-found page is rendered once at /404 and served by Vercel as 404.html
  async prerender({ getStaticPaths }) {
    return [...getStaticPaths(), '/404']
  },
  async buildEnd({ reactRouterConfig }) {
    const client = join(reactRouterConfig.buildDirectory, 'client')
    await cp(join(client, '404', 'index.html'), join(client, '404.html'))
    // Nothing is served from a fallback or fetches data from the resource routes
    const unused = ['404', '__spa-fallback.html', 'sitemap.xml.data', 'robots.txt.data']
    await Promise.all(unused.map((path) => rm(join(client, path), { recursive: true })))
  },
} satisfies Config
