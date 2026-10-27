import { INDEXED_PATHS } from '~/lib/indexed-paths'
import { absoluteUrl } from '~/lib/seo'

export function loader() {
  const urls = INDEXED_PATHS.map((path) => `  <url>\n    <loc>${absoluteUrl(path)}</loc>\n  </url>`)
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n')
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } })
}
