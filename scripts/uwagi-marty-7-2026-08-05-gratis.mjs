// Uwaga klientki z 5 sierpnia, wieczorem, po obejrzeniu wdrożonej rundy szóstej.
// Cytat: „żeby nikt się nie zastanawiał maska gratis a tu trzeba płacić jak
// poniżej. Czyli proszę to dać pod zabiegami”. Do wiadomości dołączony zrzut
// ekranu ze strzałką z linijki o gratisie w górę, pod ostatnią pozycję
// pielęgnacji twarzy.
//
// Uruchomienie:  node scripts/uwagi-marty-7-2026-08-05-gratis.mjs --dry
//                node scripts/uwagi-marty-7-2026-08-05-gratis.mjs
//
// Problem: zdanie „Gratis maska i peeling przy każdym zabiegu” stało jako
// adnotacja grupy „Dodatki do zabiegów”, czyli bezpośrednio nad pozycjami
// „Ampułka 30 zł” i „Maska algowa 20 zł”. Czytało się jak zapowiedź tych
// dwóch pozycji, więc obiecywało za darmo to, co niżej kosztuje.
//
// Rozwiązanie: zdanie schodzi z nagłówka dodatków pod ostatnią pozycję
// pielęgnacji twarzy, czyli pod zabiegi, których dotyczy. Wymaga nowego pola
// `noteAfter` w schemacie cennika (adnotacja pod pozycjami grupy) — samo pole
// i jego renderowanie są w kodzie, tutaj tylko przeniesienie treści.
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

const GRATIS = 'Gratis maska i peeling przy każdym zabiegu.'

const grupy = await pytaj(
  '*[_id=="pricelist"][0].groups[]{_key,anchor,title,note,noteAfter,"ostatnia":items[-1].name}'
)

const bledy = []
const zabiegi = grupy.find((g) => g.anchor === 'pielegnacja-twarzy')
const dodatki = grupy.find((g) => g.anchor === 'dodatki')

if (!zabiegi) bledy.push('Nie znalazłem grupy „pielegnacja-twarzy”')
if (!dodatki) bledy.push('Nie znalazłem grupy „dodatki”')
if (dodatki && dodatki.note !== GRATIS) {
  bledy.push(`Adnotacja dodatków brzmi inaczej niż zakładam: „${dodatki.note}”`)
}
if (zabiegi && zabiegi.noteAfter) {
  bledy.push(`Pod pozycjami pielęgnacji już coś stoi: „${zabiegi.noteAfter}”`)
}
// Rabaty zostają tam, gdzie są: nad listą. Przenosimy wyłącznie zdanie o gratisie.
if (zabiegi && !(zabiegi.note || '').startsWith('Rabat 20%')) {
  bledy.push(`Adnotacja pielęgnacji nad listą brzmi inaczej niż zakładam: „${zabiegi.note}”`)
}

if (bledy.length) {
  console.error('Nie zapisuję, bo cennik nie wygląda tak, jak zakładam:')
  bledy.forEach((b) => console.error('  •', b))
  process.exit(1)
}

const mutacje = [
  {
    patch: {
      id: 'pricelist',
      set: { [`groups[_key=="${zabiegi._key}"].noteAfter`]: GRATIS },
      unset: [`groups[_key=="${dodatki._key}"].note`],
    },
  },
]

if (DRY) {
  console.log('PRÓBA (nic nie zapisuję).\n')
  console.log(`Grupa „${zabiegi.title}” (${zabiegi.pozycje ?? ''})`)
  console.log('  nad listą  :', zabiegi.note)
  console.log('  ostatnia   :', zabiegi.ostatnia)
  console.log('  pod listą  :', GRATIS, '  <- wchodzi tutaj')
  console.log(`\nGrupa „${dodatki.title}”`)
  console.log('  nad listą  :', dodatki.note, '  <- znika')
  console.log('  ostatnia   :', dodatki.ostatnia)
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
