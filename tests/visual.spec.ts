import { test, expect, type Page } from '@playwright/test'
import fs from 'node:fs'

const PAGES: [string, string][] = [
  ['home', '/'],
  ['o-salonie', '/o-salonie'],
  ['zabiegi', '/zabiegi'],
  ['zabieg-laser', '/zabiegi/laser'],
  ['cennik', '/cennik'],
  ['kontakt', '/kontakt'],
]

const DIR = 'tests/screenshots'

test.beforeAll(() => {
  fs.mkdirSync(DIR, { recursive: true })
})

// Wymuś widoczność animowanych sekcji (reveal) i wyłącz animacje — stabilny zrzut.
async function prep(page: Page) {
  await page.addStyleTag({
    content:
      '.reveal{opacity:1!important;transform:none!important} *{animation:none!important;transition:none!important}',
  })
  await page.waitForTimeout(1200) // czas na doładowanie zdjęć
}

for (const [name, path] of PAGES) {
  test(`zrzut ${name}`, async ({ page }, info) => {
    await page.goto(path, { waitUntil: 'load' })
    await prep(page)
    await page.screenshot({
      path: `${DIR}/${info.project.name}-${name}.png`,
      fullPage: true,
    })
  })
}

test('mobilne menu otwiera się', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile', 'tylko mobile')
  await page.goto('/', { waitUntil: 'load' })
  await page.getByRole('button', { name: 'Menu' }).click()
  await page.waitForTimeout(400)
  await expect(page.locator('nav.nav.open')).toBeVisible()
  await page.screenshot({ path: `${DIR}/mobile-menu-open.png` })
})

test('FAQ rozwija kolejne pytanie', async ({ page }) => {
  await page.goto('/', { waitUntil: 'load' })
  // pierwsze pytanie jest domyślnie otwarte; klikamy drugie (zamknięte)
  await page.locator('.faq-q').nth(1).click()
  await expect(page.locator('.faq-a').nth(1)).toHaveClass(/open/)
})

test('banner cookies widoczny i znika po akceptacji', async ({ page }, info) => {
  await page.goto('/', { waitUntil: 'load' })
  const banner = page.locator('.cookie-banner')
  await banner.waitFor({ state: 'visible', timeout: 5000 })
  await page.screenshot({ path: `${DIR}/${info.project.name}-cookie-banner.png` })
  await page.getByRole('button', { name: 'Akceptuję wszystkie' }).click()
  await expect(banner).toHaveCount(0)
})

test('nawigacja z hero do podstrony zabiegu', async ({ page }) => {
  await page.goto('/', { waitUntil: 'load' })
  await page.locator('a.hero-tile, a.svc-tile, a.chip').first().click()
  await expect(page).toHaveURL(/\/zabiegi\//)
})
