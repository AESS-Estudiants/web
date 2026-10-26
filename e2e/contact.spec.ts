import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']

test('the contact form flags empty fields accessibly', async ({ page }) => {
  await page.goto('/contacte')
  await page.getByRole('button', { name: 'Enviar missatge' }).click()

  await expect(page.getByLabel('Nom*')).toBeFocused()
  await expect(page.getByLabel('Email*')).toHaveAttribute('aria-invalid', 'true')
  const results = await new AxeBuilder({ page }).withTags(TAGS).analyze()
  expect(results.violations).toEqual([])
})

test('the map loads nothing from Google until asked', async ({ page }) => {
  const requests: string[] = []
  page.on('request', (request) => requests.push(request.url()))
  await page.goto('/contacte')
  await page.waitForLoadState('networkidle')
  expect(requests.filter((url) => url.includes('google.com'))).toEqual([])

  await page.getByRole('button', { name: /Mostra el mapa/ }).click()
  await expect(page.getByTitle('Ubicació Campus Nord UPC')).toBeAttached()
})
