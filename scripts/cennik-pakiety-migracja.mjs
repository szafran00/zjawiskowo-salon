// Rozbicie pakietów depilacji na osobne pola: cena przed obniżką, oszczędność
// i gratis. Klientka zatwierdziła cennik, w którym wyższa cena jest przekreślona,
// a gratisy i oszczędności widoczne — do tego potrzebne są osobne pola, a nie
// jedna „uwaga” z tekstem „zamiast 600 zł, oszczędność 1200 zł”.
//
//   node scripts/cennik-pakiety-migracja.mjs --dry    # pokazuje, co się zmieni
//   node scripts/cennik-pakiety-migracja.mjs          # zapisuje
//
// Rusza WYŁĄCZNIE grupę o identyfikatorze „pakiety-depilacji”. W pozostałych
// grupach „uwaga” trzyma czas trwania zabiegu i musi zostać nietknięta.
import fs from 'node:fs'

const DRY = process.argv.includes('--dry')
const PROJECT = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'kleyi1aa'
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const APIV = '2024-10-01'
const GRUPA = 'pakiety-depilacji'

const env = fs.readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
const token = env.match(/^SANITY_API_WRITE_TOKEN=(.+)$/m)?.[1]?.trim()
if (!token) {
  console.error('Brak SANITY_API_WRITE_TOKEN w .env.local')
  process.exit(1)
}

const res = await fetch(
  `https://${PROJECT}.api.sanity.io/v${APIV}/data/query/${DATASET}?query=${encodeURIComponent('*[_type=="pricelist"][0]')}`
)
const doc = (await res.json()).result
if (!doc) {
  console.error('Nie znaleziono dokumentu cennika')
  process.exit(1)
}

const CENA = '[\\d\\s]+zł'

function rozbij(item) {
  const out = { ...item }
  const note = (item.note || '').trim()

  const old = note.match(new RegExp(`zamiast\\s+(${CENA})`, 'i'))
  if (old) out.oldPrice = old[1].trim()

  const osz = note.match(new RegExp(`oszczędność\\s+(${CENA})`, 'i'))
  if (osz) out.saving = osz[1].trim()

  // „…, pachy gratis” / „…, 2 gratis” na końcu nazwy to informacja o gratisie,
  // nie część nazwy obszaru.
  const nm = (item.name || '').trim()
  const gr = nm.match(/^(.*?),\s*([^,]*gratis)$/i)
  if (gr) {
    out.name = gr[1].trim()
    let g = gr[2].trim()
    // „2 gratis” samo w sobie nic nie mówi
    const ile = g.match(/^(\d+)\s+gratis$/i)
    if (ile) g = `${ile[1]} zabiegi gratis`
    out.gratis = g
  }

  // Po przeniesieniu treści do osobnych pól uwaga jest już zbędna.
  if (out.oldPrice || out.saving) {
    const reszta = note
      .replace(new RegExp(`zamiast\\s+${CENA}`, 'i'), '')
      .replace(new RegExp(`oszczędność\\s+${CENA}`, 'i'), '')
      .replace(/^[\s,·]+|[\s,·]+$/g, '')
    out.note = reszta || undefined
  }
  return out
}

let zmienione = 0
const groups = (doc.groups || []).map((g) => {
  if (g.anchor !== GRUPA) return g
  return {
    ...g,
    items: (g.items || []).map((it) => {
      const nowy = rozbij(it)
      const rozne =
        nowy.name !== it.name ||
        nowy.oldPrice !== it.oldPrice ||
        nowy.saving !== it.saving ||
        nowy.gratis !== it.gratis ||
        nowy.note !== it.note
      if (rozne) {
        zmienione++
        console.log(`\n  ${it.name}`)
        if (nowy.name !== it.name) console.log(`    nazwa:        „${it.name}” → „${nowy.name}”`)
        if (nowy.gratis) console.log(`    gratis:       „${nowy.gratis}”`)
        if (nowy.oldPrice) console.log(`    przed obniżką: „${nowy.oldPrice}”`)
        if (nowy.saving) console.log(`    oszczędność:  „${nowy.saving}”`)
        console.log(`    uwaga:        „${it.note || ''}” → „${nowy.note || ''}”`)
      }
      return nowy
    }),
  }
})

console.log(`\nPozycji do zmiany: ${zmienione}`)
if (DRY) {
  console.log('(--dry: nic nie zapisano)')
  process.exit(0)
}

const zapis = await fetch(
  `https://${PROJECT}.api.sanity.io/v${APIV}/data/mutate/${DATASET}?returnIds=true`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ mutations: [{ patch: { id: doc._id, set: { groups } } }] }),
  }
)
const out = await zapis.json()
if (!zapis.ok) {
  console.error('BŁĄD zapisu:', JSON.stringify(out, null, 2))
  process.exit(1)
}
console.log('Zapisano cennik.')
