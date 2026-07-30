// Druga tura uwag klientki, 28.07.2026.
//   node scripts/uwagi-marty-2-2026-07-28.mjs [--dry]
//
// 1. Przywrócenie czterech wyróżników z pierwszej makiety. Klientka szukała ich
//    na stronie i nie znalazła, bo w CMS od początku siedziały inne, operacyjne.
//    Razem z trzema dopisanymi wczoraj daje to siedem punktów, o których pisze.
// 2. Prawdziwe adresy Facebooka i Instagrama zamiast „#”.
import fs from 'node:fs'

const DRY = process.argv.includes('--dry')
const PROJECT = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'kleyi1aa'
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const APIV = '2024-10-01'

const env = fs.readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
const token = env.match(/^SANITY_API_WRITE_TOKEN=(.+)$/m)?.[1]?.trim()
if (!token) {
  console.error('Brak SANITY_API_WRITE_TOKEN w .env.local')
  process.exit(1)
}

// Zapis zdaniowy, nie wersalikami: pozostałe trzy punkty klientki są zapisane
// tak samo, a wersaliki w kafelkach czytają się jak krzyk.
const mutations = [
  { patch: { id: 'badge-1', set: { text: '100% zadowolonych klientów' } } },
  { patch: { id: 'badge-2', set: { text: 'Najwyżej oceniany, największa liczba rekomendacji' } } },
  { patch: { id: 'badge-3', set: { text: 'I miejsce w rankingu pozytywnych opinii' } } },
  { patch: { id: 'badge-4', set: { text: 'Nominacja do plebiscytu „Mistrzowie Urody”' } } },
  {
    patch: {
      id: 'siteSettings',
      set: {
        facebookUrl: 'https://www.facebook.com/ZjawiskowoKrzeszowice',
        instagramUrl: 'https://www.instagram.com/zjawiskowo_krzeszowice/',
      },
    },
  },
]

if (DRY) {
  console.log(JSON.stringify(mutations, null, 2))
  process.exit(0)
}

const res = await fetch(
  `https://${PROJECT}.api.sanity.io/v${APIV}/data/mutate/${DATASET}?returnIds=true`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ mutations }),
  }
)
const out = await res.json()
if (!res.ok) {
  console.error('BŁĄD zapisu:', JSON.stringify(out, null, 2))
  process.exit(1)
}
console.log('Zapisano:', (out.results || []).map((r) => r.id).join(', '))
