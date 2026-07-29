// Jednorazowe naniesienie uwag klientki z 28.07.2026 na treść w Sanity.
// Uruchomienie: node scripts/uwagi-marty-2026-07-28.mjs [--dry]
//
// Skrypt tylko DOPISUJE i podmienia wskazane pola. Nie usuwa żadnego istniejącego
// punktu z list — uwagi odnosiły się do starej makiety, więc pozycje, o których
// pisała klientka („100% zadowolonych klientów”, „Certyfikowany sprzęt”),
// w obecnej treści nie istnieją i nie ma czego zastępować.
import fs from 'node:fs'

const DRY = process.argv.includes('--dry')
const PROJECT = 'kleyi1aa'
const DATASET = 'production'
const APIV = '2024-10-01'

const env = fs.readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
const token = env.match(/^SANITY_API_WRITE_TOKEN=(.+)$/m)?.[1]?.trim()
if (!token) {
  console.error('Brak SANITY_API_WRITE_TOKEN w .env.local')
  process.exit(1)
}

async function query(q) {
  const r = await fetch(
    `https://${PROJECT}.api.sanity.io/v${APIV}/data/query/${DATASET}?query=${encodeURIComponent(q)}`
  )
  return (await r.json()).result
}

const laser = await query('*[_id=="service-laser"][0]{atuty}')
const twarz = await query('*[_id=="service-twarz"][0]{atuty}')

// Punkty dopisane przez klientkę. Istniejące zostają nietknięte.
const laserAtuty = ['Wskaźnik satysfakcji 100%', ...(laser?.atuty || [])]
const twarzAtuty = [
  'Kompleksowa pielęgnacja i rewitalizacja',
  'Efekt ujędrnienia i odmłodzenia',
  ...(twarz?.atuty || []),
  'Nowoczesne technologie',
  'Bezpłatna konsultacja podczas zabiegu',
]

const mutations = [
  {
    patch: {
      id: 'siteSettings',
      set: {
        // 1. pasek promocji
        promoText:
          '−10% na pakiet depilacji · zarezerwuj w sierpniu · −20% na pielęgnację twarzy',
        // 2. opis pod hasłem
        heroLead:
          'Kameralny salon, w którym zadbam o Twoją skórę i komfort z pełnym profesjonalizmem.',
        // 6. opinie — bez „o nas” i bez zawężania do kobiet
        reviewsKicker: 'Opinie klientów',
        reviewsHeading: 'Co mówią klienci',
        // 7. nagłówek strony Kontakt
        contactHeading: 'Odwiedź ZJAWISKOWO w Krzeszowicach',
        // 8. adres
        address: 'ul. 3 Maja 4, 32-065 Krzeszowice',
        // 9. godziny otwarcia
        hours: 'poniedziałek – piątek 8:00 – 20:00 · sobota 9:00 – 13:00',
        // 10. „Kosmetyczny” dużą literą (nagłówek i stopka używają tego samego pola)
        salonSubtitle: 'Salon Kosmetyczny · Depilacja laserowa',
      },
    },
  },
  {
    patch: {
      id: 'service-laser',
      set: {
        // 4. „każdego dnia” w nagłówku bloku
        introHeading:
          'Trwała depilacja laserowa każdego dnia na miejscu w Krzeszowicach',
        atuty: laserAtuty,
      },
    },
  },
  {
    patch: {
      id: 'service-twarz',
      set: {
        // 5. pauza i dopisek w nagłówku bloku
        introHeading:
          'Pielęgnacja twarzy – bezpieczne i nieinwazyjne zabiegi kosmetyczne',
        atuty: twarzAtuty,
      },
    },
  },
  // 3. trzy punkty dopisane na końcu listy wyróżników
  { createOrReplace: { _id: 'badge-5', _type: 'trustBadge', text: 'Zaufanie budowane efektami', order: 5 } },
  { createOrReplace: { _id: 'badge-6', _type: 'trustBadge', text: 'Bezkompromisowa jakość', order: 6 } },
  { createOrReplace: { _id: 'badge-7', _type: 'trustBadge', text: 'Certyfikowane urządzenia', order: 7 } },
]

if (DRY) {
  console.log(JSON.stringify(mutations, null, 2))
  console.log('\n(--dry: nic nie zapisano)')
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
console.log('Zapisano. Zmienione dokumenty:', (out.results || []).map((r) => r.id).join(', '))
