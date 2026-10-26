import type { Config } from '@react-router/dev/config'

export default {
  // Static site: every route is rendered to HTML at build time
  ssr: false,
  prerender: true,
} satisfies Config
