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
  const sub = page.locator('.navitem.has-sub').first().locator('.submenu')
  await expect(sub).toBeHidden()
  await page.locator('.navitem.has-sub').first().hover()
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
  await page.locator('.navitem.has-sub').nth(1).hover()
  await page.locator('.submenu a[href="/cennik#pielegnacja-twarzy"]').click()
  await expect(page).toHaveURL(/\/cennik#pielegnacja-twarzy$/)
  await expect(page.locator('#pielegnacja-twarzy')).toBeVisible()
})

test('mobilne menu otwiera się wraz z podpozycjami', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile', 'tylko mobile')
  await page.goto('/', { waitUntil: 'load' })
  await page.getByRole('button', { name: 'Menu' }).click()
  await page.waitForTimeout(400)
  await expect(page.locator('nav.nav.open')).toBeVisible()
  // Na telefonie podlista rozwija się dopiero po dotknięciu pozycji „Zabiegi”
  // (animacja max-height, więc nic pod spodem nie przeskakuje).
  await page.locator('.navitem.has-sub .navtrigger').first().click()
  await page.waitForTimeout(400)
  await expect(
    page.locator('.submenu a[href="/zabiegi/depilacja-laserowa"]')
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
  const banner = page.locator('.cookie')
  await banner.waitFor({ state: 'visible', timeout: 5000 })
  await page.screenshot({ path: `${DIR}/${info.project.name}-cookie-banner.png` })
  await page.getByRole('button', { name: 'Akceptuję', exact: true }).click()
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

// Klientka: „na starcie na mobile sa pod soba dwa butony do tego samego, ktore
// na siebie nachodza". Przyklejony przycisk telefonu ma sie chowac, dopoki na
// ekranie widac inny numer, i wracac, gdy zaden nie jest widoczny.
test('przyklejony telefon nie nachodzi na przycisk z sekcji powitalnej', async ({
  page,
}, info) => {
  test.skip(info.project.name !== 'mobile', 'przycisk jest wylacznie na waskich ekranach')

  await page.goto('/', { waitUntil: 'load' })
  const fab = page.locator('a.callfab')
  const heroCta = page.locator('.hero a[href^="tel:"]').first()

  // 1. Na samej gorze widac przycisk z sekcji powitalnej, a przyklejony jest schowany.
  await expect(heroCta).toBeInViewport()
  await expect(fab).toHaveCSS('opacity', '0')
  await expect(fab).toHaveAttribute('aria-hidden', 'true')

  // Schowany nie moze lapac dotkniec ani stac w kolejce klawisza Tab.
  await expect(fab).toHaveCSS('pointer-events', 'none')
  await expect(fab).toHaveAttribute('tabindex', '-1')

  // 2. Po zjechaniu ponizej sekcji powitalnej przycisk sie pojawia.
  await page.evaluate(() => window.scrollTo(0, 2000))
  await expect(fab).toHaveCSS('opacity', '1')
  await expect(fab).toHaveAttribute('aria-hidden', 'false')
  await page.screenshot({ path: `${DIR}/${info.project.name}-callfab-po-zjechaniu.png` })

  // 3. Przy zlotym pasku z telefonem na dole znowu sie chowa: dwa razy ten sam
  //    numer obok siebie to dokladnie to, na co klientka zwrocila uwage.
  await page.locator('a.btn-phone').first().scrollIntoViewIfNeeded()
  await expect(page.locator('a.btn-phone').first()).toBeInViewport()
  await expect(fab).toHaveCSS('opacity', '0')
})
