// Wgrywa plik graficzny do zasobów Sanity i wypisuje identyfikator zasobu.
// Samo wgranie niczego nie podpina — dokument wskazuje się osobną mutacją.
//
// Uruchomienie: node scripts/wgraj-obraz.mjs "C:\\sciezka\\do\\pliku.jpg" [nazwa]
import fs from 'node:fs'
import path from 'node:path'

const env = fs.readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
const token = env.match(/SANITY_API_WRITE_TOKEN=(.+)/)?.[1].trim()
if (!token) throw new Error('Brak SANITY_API_WRITE_TOKEN w .env.local')

const plik = process.argv[2]
if (!plik) throw new Error('Podaj ścieżkę do pliku')
const nazwa = process.argv[3] || path.basename(plik)

const dane = fs.readFileSync(plik)
const typ = plik.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg'

const odp = await fetch(
  `https://kleyi1aa.api.sanity.io/v2024-01-01/assets/images/production?filename=${encodeURIComponent(nazwa)}`,
  {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': typ },
    body: dane,
  }
)
const wynik = await odp.json()
if (!odp.ok) {
  console.error('Błąd wgrywania:', JSON.stringify(wynik, null, 2))
  process.exit(1)
}
console.log(wynik.document._id)
console.log(wynik.document.url)
