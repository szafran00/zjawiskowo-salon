// Uwagi klientki z nocy 5 na 6 sierpnia, po przejrzeniu wdrożonej wersji.
// Trzy sprawy, dwie z nich dotyczą treści i siedzą w tym skrypcie:
//
// 1. PASEK PROMOCJI — „zamiast słowa Do 1200 ostatecznie dajmy słowo Nawet
//    1200 zł". Do tego prośba, żeby „ciut powiększyć" kwotę, a chwilę później
//    także procent. Samo powiększenie jest w kodzie (komponent PromoBar plus
//    styl .promo-kwota), bo w panelu ma zostać zwykły tekst bez znaczników.
//
// 2. O MNIE — „po słowie łatwiej słowo zadbać o rzeczy". Zdanie otwierające
//    stronę mówiło „w kameralnym salonie łatwiej o rzeczy", czyli skrótem,
//    który klientce zgrzytał.
//
// Trzecia uwaga („I proszę pogrubić" do zdania o gratisowej masce) jest
// wyłącznie w stylach, więc nie ma jej tutaj.
//
// Uruchomienie:  node scripts/uwagi-marty-8-2026-08-06.mjs --dry
//                node scripts/uwagi-marty-8-2026-08-06.mjs
import fs from 'node:fs'

const DRY = process.argv.includes('--dry')
const env = fs.readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
const token = env.match(/SANITY_API_WRITE_TOKEN=(.+)/)?.[1].trim()
if (!token) throw new Error('Brak SANITY_API_WRITE_TOKEN w .env.local')

const BAZA = 'https://kleyi1aa.api.sanity.io/v2024-01-01/data'
const naglowki = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

async function pytaj(q) {
  const r = await fetch(`${BAZA}/query/production?query=${encodeURIComponent(q)}`, {
    headers: naglowki,
  })
  const d = await r.json()
  if (!r.ok) throw new Error(JSON.stringify(d))
  return d.result
}

const PASEK_STARY =
  'Do 1200 zł oszczędności przy pakietach depilacji · −20% na pielęgnację twarzy · Sprawdzaj inne promocje na FB ZJAWISKOWO'
const PASEK_NOWY =
  'Nawet 1200 zł oszczędności przy pakietach depilacji · −20% na pielęgnację twarzy · Sprawdzaj inne promocje na FB ZJAWISKOWO'

const O_MNIE_FRAGMENT_STARY = 'W kameralnym salonie łatwiej o rzeczy'
const O_MNIE_FRAGMENT_NOWY = 'W kameralnym salonie łatwiej zadbać o rzeczy'

const [ustawienia, oMnie] = await Promise.all([
  pytaj('*[_id=="siteSettings"][0]{promoText}'),
  pytaj('*[_id=="aboutPage"][0]{body}'),
])

const bledy = []
const sprawdz = (warunek, komunikat) => {
  if (!warunek) bledy.push(komunikat)
}

sprawdz(
  ustawienia?.promoText === PASEK_STARY,
  `Pasek promocji brzmi inaczej niż zakładam: „${ustawienia?.promoText}”`
)

const tekstBloku = (b) => (b.children || []).map((c) => c.text).join('')
const cialo = oMnie?.body || []
const blokWstepu = cialo.find((b) => tekstBloku(b).includes(O_MNIE_FRAGMENT_STARY))
sprawdz(blokWstepu, `Nie znalazłem akapitu zaczynającego się „${O_MNIE_FRAGMENT_STARY}”`)
sprawdz(
  !cialo.some((b) => tekstBloku(b).includes(O_MNIE_FRAGMENT_NOWY)),
  'Poprawka w „O mnie” już tam jest, nie powtarzam zapisu'
)

if (bledy.length) {
  console.error('Nie zapisuję, bo treść w panelu nie wygląda tak, jak zakładam:')
  bledy.forEach((b) => console.error('  •', b))
  process.exit(1)
}

const cialoNowe = cialo.map((b) => ({
  ...b,
  children: (b.children || []).map((c) => ({
    ...c,
    text: String(c.text ?? '').replace(O_MNIE_FRAGMENT_STARY, O_MNIE_FRAGMENT_NOWY),
  })),
}))

const mutacje = [
  { patch: { id: 'siteSettings', set: { promoText: PASEK_NOWY } } },
  { patch: { id: 'aboutPage', set: { body: cialoNowe } } },
]

if (DRY) {
  console.log('PRÓBA (nic nie zapisuję).\n')
  console.log('Pasek promocji:')
  console.log('  było:', PASEK_STARY)
  console.log('  jest:', PASEK_NOWY)
  console.log('\nPierwszy akapit „O mnie”:')
  console.log('  było:', tekstBloku(blokWstepu).slice(0, 120))
  console.log(
    '  jest:',
    tekstBloku(cialoNowe.find((b) => b._key === blokWstepu._key)).slice(0, 120)
  )
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
console.log(`Zapisano ${wynik.results?.length ?? 0} zmian.`)
