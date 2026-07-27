import { test, expect, type Page } from '@playwright/test'
import fs from 'node:fs'

const PAGES: [string, string][] = [
  ['home', '/'],
  ['o-mnie', '/o-mnie'],
  ['zabiegi', '/zabiegi'],
  ['zabieg-laser', '/zabiegi/depilacja-laserowa'],
  ['zabieg-twarz', '/zabiegi/pielegnacja-twarzy'],
  ['cennik', '/cennik'],
  ['vouchery', '/vouchery'],
  ['regulamin', '/regulamin'],
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

test('menu: rozwijana lista „Zabiegi" pokazuje się dopiero po najechaniu', async ({
  page,
}, info) => {
  test.skip(info.project.name !== 'desktop', 'rozwijane menu działa na desktopie')
  await page.goto('/', { waitUntil: 'load' })
  const sub = page.locator('.nav-item.has-sub').first().locator('.nav-sub')
  await expect(sub).toBeHidden()
  await page.locator('.nav-item.has-sub').first().hover()
  await expect(sub).toBeVisible()
  // przejście trwa 0.18 s — czekamy na pełne odsłonięcie, żeby zrzut był stabilny
  await expect
    .poll(() => sub.evaluate((el) => getComputedStyle(el).opacity))
    .toBe('1')
  await expect(sub.getByRole('link', { name: 'Depilacja laserowa' })).toBeVisible()
  await expect(sub.getByRole('link', { name: 'Pielęgnacja twarzy' })).toBeVisible()
  await page.screenshot({ path: `${DIR}/desktop-menu-dropdown.png` })
})

test('menu: Cennik prowadzi do właściwej sekcji cennika', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', 'rozwijane menu działa na desktopie')
  await page.goto('/', { waitUntil: 'load' })
  await page.locator('.nav-item.has-sub').nth(1).hover()
  await page.locator('.nav-sub a[href="/cennik#pielegnacja-twarzy"]').click()
  await expect(page).toHaveURL(/\/cennik#pielegnacja-twarzy$/)
  await expect(page.locator('#pielegnacja-twarzy')).toBeVisible()
})

test('mobilne menu otwiera się wraz z podpozycjami', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile', 'tylko mobile')
  await page.goto('/', { waitUntil: 'load' })
  await page.getByRole('button', { name: 'Menu' }).click()
  await page.waitForTimeout(400)
  await expect(page.locator('nav.nav.open')).toBeVisible()
  await expect(
    page.locator('.nav-sub a[href="/zabiegi/depilacja-laserowa"]')
  ).toBeVisible()
  await page.screenshot({ path: `${DIR}/mobile-menu-open.png` })
})

test('stara trasa /o-salonie przekierowuje na /o-mnie', async ({ page }) => {
  await page.goto('/o-salonie', { waitUntil: 'load' })
  await expect(page).toHaveURL(/\/o-mnie$/)
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

test('duży przycisk telefonu prowadzi do numeru', async ({ page }) => {
  await page.goto('/', { waitUntil: 'load' })
  const phone = page.locator('a.btn-phone').first()
  await expect(phone).toBeVisible()
  await expect(phone).toHaveAttribute('href', /^tel:\d+$/)
})
