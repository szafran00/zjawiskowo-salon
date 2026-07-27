// Generuje kod QR kierujący na wystawienie opinii w wizytówce Google.
// Kod jest do wydrukowania i naklejenia w salonie (drzwi, stanowisko, lada).
//
//   npm run qr                     — bierze adres z panelu Sanity (Ustawienia → Link do opinii Google)
//   npm run qr -- "https://..."    — bierze adres podany wprost
//
// Zapisuje public/qr-opinie-google.svg oraz public/qr-opinie-google.png.

import { writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import QRCode from 'qrcode'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')
const outDir = resolve(root, 'public')

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'kleyi1aa'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-10-01'

async function urlFromSanity() {
  const query = encodeURIComponent('*[_type=="siteSettings"][0].googleReviewUrl')
  const res = await fetch(
    `https://${projectId}.apicdn.sanity.io/v${apiVersion}/data/query/${dataset}?query=${query}`
  )
  if (!res.ok) return undefined
  const body = await res.json()
  return body?.result || undefined
}

const fromArg = process.argv[2]
const url = fromArg || (await urlFromSanity())

if (!url) {
  console.error(
    'Brak adresu do opinii Google.\n' +
      'Uzupełnij w panelu: Ustawienia salonu → Link do opinii Google,\n' +
      'albo podaj adres wprost: npm run qr -- "https://g.page/r/..."'
  )
  process.exit(1)
}

mkdirSync(outDir, { recursive: true })

const opts = {
  errorCorrectionLevel: 'M',
  margin: 2,
  color: { dark: '#2B2620', light: '#FFFFFF' },
}

const svg = await QRCode.toString(url, { ...opts, type: 'svg', width: 1200 })
writeFileSync(resolve(outDir, 'qr-opinie-google.svg'), svg, 'utf8')
await QRCode.toFile(resolve(outDir, 'qr-opinie-google.png'), url, {
  ...opts,
  width: 1200,
})

console.log('Kod QR wygenerowany dla adresu:')
console.log('  ' + url)
console.log('Pliki: public/qr-opinie-google.svg oraz public/qr-opinie-google.png')
console.log('Do druku użyj wersji SVG (skaluje się bez utraty jakości).')
