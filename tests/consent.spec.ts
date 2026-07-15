import { test, expect } from '@playwright/test'

// Dowód, że zgoda na cookies realnie działa: mapa Google (iframe z cookies Google)
// ładuje się WYŁĄCZNIE po akceptacji „wszystkie", wybór jest zapamiętywany,
// a „tylko niezbędne" NIE włącza mapy.
test('zgoda cookies realnie steruje mapą Google', async ({ page }) => {
  const googleMap = page.locator('iframe[src*="google.com/maps"]')
  const banner = page.locator('.cookie-banner')

  await page.goto('/kontakt', { waitUntil: 'load' })

  // 1. Świeże wejście: banner widoczny, mapa ZABLOKOWANA (brak iframe Google)
  await expect(banner).toBeVisible()
  await expect(page.locator('.map-consent')).toBeVisible()
  await expect(googleMap).toHaveCount(0)

  // 2. „Tylko niezbędne" → banner znika, mapa NADAL zablokowana
  await page.getByRole('button', { name: 'Tylko niezbędne' }).click()
  await expect(banner).toHaveCount(0)
  await expect(googleMap).toHaveCount(0)

  // 3. Reload → banner NIE wraca (wybór zapamiętany), mapa nadal zablokowana
  await page.reload({ waitUntil: 'load' })
  await expect(banner).toHaveCount(0)
  await expect(googleMap).toHaveCount(0)

  // 4. Reopen ze stopki → banner wraca → „Akceptuję wszystkie" → mapa się ŁADUJE
  await page.getByRole('link', { name: 'Ustawienia cookies' }).click()
  await expect(banner).toBeVisible()
  await page.getByRole('button', { name: 'Akceptuję wszystkie' }).click()
  await expect(banner).toHaveCount(0)
  await expect(googleMap).toHaveCount(1)

  // 5. Reload → zgoda trwała: mapa ładuje się od razu, banner nie wraca
  await page.reload({ waitUntil: 'load' })
  await expect(banner).toHaveCount(0)
  await expect(googleMap).toHaveCount(1)
})
