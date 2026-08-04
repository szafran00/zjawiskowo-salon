import { test, expect } from '@playwright/test'

// Dowód, że zgoda na cookies realnie działa: mapa Google (iframe z cookies Google)
// ładuje się WYŁĄCZNIE po akceptacji „wszystkie", wybór jest zapamiętywany,
// a „tylko niezbędne" NIE włącza mapy.
test('zgoda cookies realnie steruje mapą Google', async ({ page }) => {
  const googleMap = page.locator('iframe[src*="google.com/maps"]')
  const banner = page.locator('.cookie')

  await page.goto('/kontakt', { waitUntil: 'load' })

  // 1. Świeże wejście: pasek widoczny, mapa ZABLOKOWANA (brak iframe Google)
  await expect(banner).toBeVisible()
  await expect(page.locator('.mapcard')).toBeVisible()
  // Kafel przed zgodą ma być użyteczny sam w sobie: adres i odnośnik do Map
  // Google, który nie potrzebuje żadnej zgody.
  await expect(page.locator('.mapcard-adres')).toContainText('Krzeszowice')
  await expect(
    page.locator('.mapcard a[href*="google.com/maps"]')
  ).toBeVisible()
  await expect(googleMap).toHaveCount(0)

  // 2. „Tylko niezbędne" → pasek znika, mapa NADAL zablokowana
  await page.getByRole('button', { name: 'Tylko niezbędne' }).click()
  await expect(banner).toHaveCount(0)
  await expect(googleMap).toHaveCount(0)

  // 3. Reload → pasek NIE wraca (wybór zapamiętany), mapa nadal zablokowana
  await page.reload({ waitUntil: 'load' })
  await expect(banner).toHaveCount(0)
  await expect(googleMap).toHaveCount(0)

  // 4. Ponowne otwarcie ze stopki → pasek wraca → „Akceptuję" → mapa się ŁADUJE
  await page.getByRole('button', { name: 'Ustawienia cookies' }).click()
  await expect(banner).toBeVisible()
  await page.getByRole('button', { name: 'Akceptuję', exact: true }).click()
  await expect(banner).toHaveCount(0)
  await expect(googleMap).toHaveCount(1)

  // 5. Reload → zgoda trwała: mapa ładuje się od razu, pasek nie wraca
  await page.reload({ waitUntil: 'load' })
  await expect(banner).toHaveCount(0)
  await expect(googleMap).toHaveCount(1)
})
