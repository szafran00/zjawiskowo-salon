// Punkt 4 z uwag klientki: ósmy punkt w sekcji „Dlaczego ZJAWISKOWO”.
// Siedem punktów układało się w siatce 3+3+1, ostatni wiersz zostawał sam.
// Ósmy domyka siatkę do 4+4 i zamyka listę tym, co klientka chciała podkreślić.
//
// Uruchomienie:  node scripts/badge-8-2026-07-31.mjs --dry
//                node scripts/badge-8-2026-07-31.mjs
import fs from 'node:fs'

const DRY = process.argv.includes('--dry')
const env = fs.readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
const token = env.match(/SANITY_API_WRITE_TOKEN=(.+)/)?.[1].trim()
if (!token) throw new Error('Brak SANITY_API_WRITE_TOKEN w .env.local')

const BAZA = 'https://kleyi1aa.api.sanity.io/v2024-01-01/data'
const naglowki = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

const dokument = {
  _id: 'badge-8',
  _type: 'trustBadge',
  order: 8,
  text: 'Wiedza, która tworzy piękno',
}

const mutacje = [{ createOrReplace: dokument }]

if (DRY) {
  console.log('PRÓBA (nic nie zapisuję):')
  console.log(JSON.stringify(mutacje, null, 2))
  process.exit(0)
}

const odp = await fetch(`${BAZA}/mutate/production`, {
  method: 'POST',
  headers: naglowki,
  body: JSON.stringify({ mutations: mutacje }),
})
const wynik = await odp.json()
if (!odp.ok) {
  console.error('Błąd zapisu:', JSON.stringify(wynik, null, 2))
  process.exit(1)
}
console.log('Zapisano:', wynik.results?.map((r) => `${r.operation} ${r.id}`).join(', '))
