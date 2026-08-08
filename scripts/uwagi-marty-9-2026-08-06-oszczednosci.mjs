// Zdejmuje kolumnę oszczędności z wierszy pakietów depilacji.
//
//   node scripts/uwagi-marty-9-2026-08-06-oszczednosci.mjs --dry
//   node scripts/uwagi-marty-9-2026-08-06-oszczednosci.mjs
//
// Powód. Liczby były poprawne: oszczędność to różnica cen razy osiem zabiegów
// serii i zgadza się w każdym z jedenastu wierszy. Zawodziła prezentacja.
// W cenniku A4, który klientka zatwierdziła, kwota „do 1200 zł oszczędności"
// pada raz, w ramce nad listą, a wiersze pokazują tylko cenę, cenę przekreśloną
// i gratis. Na stronie ta sama kwota wracała przy każdym wierszu, tuż obok ceny
// za jedną wizytę, więc „500 zł" sąsiadowało z „−1200 zł" i czytało się jak błąd.
// Na telefonie jest gorzej, bo oszczędność zjeżdża do osobnej linijki i traci
// związek z ceną.
//
// Po tej zmianie układ wiersza jest taki jak w druku. Kwota 1200 zł zostaje
// w pasku promocji i w adnotacji nad listą, czyli tam, gdzie widać kontekst
// serii ośmiu zabiegów.
import fs from 'node:fs'

const DRY = process.argv.includes('--dry')
const env = fs.readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
const token = env.match(/SANITY_API_WRITE_TOKEN=(.+)/)?.[1].trim()
if (!token) throw new Error('Brak SANITY_API_WRITE_TOKEN w .env.local')

const BAZA = 'https://kleyi1aa.api.sanity.io/v2024-01-01/data'
const naglowki = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
const GRUPA = 'pakiety-depilacji'

async function pytaj(q) {
  const r = await fetch(`${BAZA}/query/production?query=${encodeURIComponent(q)}`, {
    headers: naglowki,
  })
  const d = await r.json()
  if (!r.ok) throw new Error(JSON.stringify(d))
  return d.result
}

const grupy = await pytaj('*[_id=="pricelist"][0].groups[]{_key,anchor,title,items}')
const grupa = grupy.find((g) => g.anchor === GRUPA)
if (!grupa) {
  console.error(`Nie znalazłem grupy „${GRUPA}"`)
  process.exit(1)
}

const zOszczednoscia = (grupa.items || []).filter((it) => it.saving)
if (!zOszczednoscia.length) {
  console.log('Żadna pozycja nie ma już pola oszczędności. Nic do zrobienia.')
  process.exit(0)
}

// Kontrola przed zapisem: sprawdzamy, czy kwoty faktycznie wynikają z reguły
// „różnica cen razy osiem". Jeśli nie, to znaczy, że ktoś wpisał je ręcznie
// z innego powodu i lepiej nie kasować ich w ciemno.
const liczba = (s) => Number(String(s || '').replace(/[^\d]/g, '')) || 0
const podejrzane = []
for (const it of zOszczednoscia) {
  if (!it.oldPrice) continue
  const oczekiwana = (liczba(it.oldPrice) - liczba(it.price)) * 8
  if (oczekiwana !== liczba(it.saving)) {
    podejrzane.push(`${it.name}: w panelu ${it.saving}, z reguły wychodzi ${oczekiwana} zł`)
  }
}

// Pozycje zachowują wszystkie pozostałe pola, znika wyłącznie „saving".
const nowe = (grupa.items || []).map(({ saving, ...reszta }) => reszta)

if (DRY) {
  console.log('PRÓBA (nic nie zapisuję).\n')
  console.log(`Grupa: ${grupa.title}, pozycji ${grupa.items.length}, z oszczędnością ${zOszczednoscia.length}\n`)
  for (const it of grupa.items) {
    const po = [it.price, it.oldPrice ? `zamiast ${it.oldPrice}` : null, it.gratis]
      .filter(Boolean)
      .join(' · ')
    console.log(`  ${it.name}`)
    console.log(`     było: ${po}${it.saving ? ` · −${it.saving}` : ''}`)
    console.log(`     jest: ${po}`)
  }
  if (podejrzane.length) {
    console.log('\nUwaga, te kwoty nie wynikają z reguły „różnica razy osiem":')
    podejrzane.forEach((p) => console.log('  •', p))
  } else {
    console.log('\nWszystkie kwoty zgadzały się z regułą „różnica cen razy osiem zabiegów".')
  }
  process.exit(0)
}

const odp = await fetch(`${BAZA}/mutate/production`, {
  method: 'POST',
  headers: naglowki,
  body: JSON.stringify({
    mutations: [
      { patch: { id: 'pricelist', set: { [`groups[_key=="${grupa._key}"].items`]: nowe } } },
    ],
  }),
})
const wynik = await odp.json()
if (!odp.ok) {
  console.error('Błąd zapisu:', JSON.stringify(wynik, null, 2))
  process.exit(1)
}
console.log(`Zapisano. Oszczędność zdjęta z ${zOszczednoscia.length} pozycji.`)
