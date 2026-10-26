import { readFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'
import { absoluteUrl, INDEXED_PATHS } from '../app/lib/seo'

for (const path of INDEXED_PATHS) {
  test(`${path} has a title, description and canonical`, async ({ page }) => {
    await page.goto(path)
    await expect(page).toHaveTitle(/AESS Estudiants/)
    const description = await page.locator('meta[name="description"]').getAttribute('content')
    expect(description?.length).toBeGreaterThan(50)
    expect(description?.length).toBeLessThanOrEqual(160)
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', absoluteUrl(path))
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      'content',
      absoluteUrl(path),
    )
  })
}

test('home describes the organisation with JSON-LD', async ({ page }) => {
  await page.goto('/')
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents()
  const types = blocks.map((block) => JSON.parse(block)['@type'])
  expect(types).toEqual(['Organization', 'WebSite'])
})

test('sitemap lists every indexed page', async ({ request }) => {
  const xml = await (await request.get('/sitemap.xml')).text()
  for (const path of INDEXED_PATHS) expect(xml).toContain(`<loc>${absoluteUrl(path)}</loc>`)
})

test('robots allows crawling and points to the sitemap', async ({ request }) => {
  const robots = await (await request.get('/robots.txt')).text()
  expect(robots).toContain('Allow: /')
  expect(robots).toContain(`Sitemap: ${absoluteUrl('/sitemap.xml')}`)
})

test('the not-found page is built as 404.html and is not indexed', async ({ page }) => {
  await page.goto('/404.html')
  await expect(page.locator('h1')).toHaveText('Pàgina no trobada')
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex')
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0)
})

test('old URLs are redirected permanently', () => {
  const { redirects } = JSON.parse(readFileSync('vercel.json', 'utf8'))
  expect(redirects).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        source: '/aessbot.html',
        destination: '/aessbot',
        statusCode: 301,
      }),
      expect.objectContaining({ source: '/contact', destination: '/contacte', statusCode: 301 }),
    ]),
  )
})
