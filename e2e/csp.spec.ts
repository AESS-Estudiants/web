import { readFileSync } from 'node:fs'
import { expect, type Page, test } from '@playwright/test'
import { INDEXED_PATHS } from '../app/lib/seo'

// The local server doesn't send Vercel's headers, so the policy from vercel.json is added here
const { headers } = JSON.parse(readFileSync('vercel.json', 'utf8'))
const policy: string = headers[0].headers.find(
  (header: { key: string }) => header.key === 'Content-Security-Policy',
).value

async function withPolicy(page: Page) {
  const violations: string[] = []
  page.on('console', (message) => {
    if (message.text().includes('Content Security Policy')) violations.push(message.text())
  })
  await page.route('**/*', async (route) => {
    if (!route.request().url().startsWith('http://localhost')) return route.continue()
    const response = await route.fetch()
    await route.fulfill({
      response,
      headers: { ...response.headers(), 'content-security-policy': policy },
    })
  })
  return violations
}

for (const path of INDEXED_PATHS) {
  test(`${path} works under the content security policy`, async ({ page }) => {
    const violations = await withPolicy(page)
    await page.goto(path)
    await page.waitForLoadState('networkidle')
    expect(violations).toEqual([])
  })
}

test('the video and the map embeds are allowed', async ({ page }) => {
  const violations = await withPolicy(page)
  await page.goto('/aessbot')
  await page.getByRole('button', { name: /Reprodueix el vídeo/ }).click()
  await expect(page.locator('iframe[src*="youtube-nocookie.com"]')).toBeAttached()
  await page.goto('/contacte')
  await page.getByRole('button', { name: /Mostra el mapa/ }).click()
  await expect(page.locator('iframe[src*="google.com/maps"]')).toBeAttached()
  await page.waitForTimeout(1500)
  expect(violations).toEqual([])
})
