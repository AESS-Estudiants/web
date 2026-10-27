import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { INDEXED_PATHS as ROUTES } from '../app/lib/seo'

for (const path of ROUTES) {
  test.describe(path, () => {
    test('renders without console errors', async ({ page }) => {
      const errors: string[] = []
      page.on('console', (message) => {
        if (message.type() === 'error') errors.push(message.text())
      })
      page.on('pageerror', (error) => errors.push(error.message))

      await page.goto(path)
      await expect(page.locator('html')).toHaveAttribute('lang', 'ca')
      await expect(page.locator('h1')).toHaveCount(1)
      expect(errors).toEqual([])
    })

    test('marks the current page in the menu, also before hydration', async ({ page }) => {
      await page.goto(path)
      const current = page.getByRole('navigation', { name: 'Principal', includeHidden: true })
      // A subpage such as /aessbot/inscripcio marks its section
      const section = `/${path.split('/')[1]}`
      await expect(current.locator('[aria-current="page"]')).toHaveAttribute('href', section)
    })

    test('has no accessibility violations', async ({ page }) => {
      await page.goto(path)
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze()
      expect(results.violations).toEqual([])
    })
  })
}
