// Poprawki po kontroli krzyżowej weryfikatorów. Trzy rzeczy, wszystkie
// wynikły z tego, że poprzednia runda ruszyła stronę główną, a nie podstrony.
//
// Uruchomienie:  node scripts/uwagi-marty-4-2026-07-31.mjs --dry
//                node scripts/uwagi-marty-4-2026-07-31.mjs
//
// 1. PASEK PROMOCJI — twarde spacje wypadają z treści w panelu.
//    W poprzedniej rundzie wpisałem je wprost do pola promoText. To działa, ale
//    zostawia klientce w edytorze niewidoczne znaki, których nie odtworzy,
//    przepisując tekst ręcznie. Wiązanie robi teraz kod przy renderowaniu
//    (app/lib/typografia.ts), więc w bazie ma zostać zwykły tekst.
//
// 2. PODSTRONA DEPILACJI — sprzeczność z nową odpowiedzią w FAQ.
//    Punkt 11 kazał wyrzucić zdanie o odstępie dobieranym do partii ciała
//    i wstawić „zazwyczaj pięć tygodni". Poprawiłem to w FAQ na stronie
//    głównej, ale to samo zdanie żyło dalej na /zabiegi/depilacja-laserowa,
//    w sekcji „Laser na miejscu, terminy bez przerw" oraz w wyliczeniu atutów.
//    Strona mówiła więc dwie różne rzeczy o tej samej sprawie.
//    Przy okazji „umawiamy" → „umawiam" w tym samym akapicie, zgodnie
//    z punktem 5 („układamy" → „ustalam") i 11 („dopasowujemy" → „dopasowuję").
//
// 3. NAGŁÓWEK GALERII — obiecywał coś, czego zdjęcia nie pokazują.
//    Sekcja nazywała się „Wnętrze salonu", a pod spodem stoją zdjęcia
//    zastępcze, na których wnętrza z założenia nie ma (reguła doboru zakazuje
//    wnętrz cudzych salonów, a klientka odrzuciła już jeden kadr właśnie za to).
//    To nagłówek z redesignu, nie tekst klientki, więc poprawiam go tak, żeby
//    zgadzał się z zawartością. Gdy klientka wgra własne zdjęcia salonu, może
//    wrócić do poprzedniej nazwy jednym kliknięciem w panelu.
import fs from 'node:fs'

const DRY = process.argv.includes('--dry')
const env = fs.readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
const token = env.match(/SANITY_API_WRITE_TOKEN=(.+)/)?.[1].trim()
if (!token) throw new Error('Brak SANITY_API_WRITE_TOKEN w .env.local')

const BAZA = 'https://kleyi1aa.api.sanity.io/v2024-01-01/data'
const naglowki = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
const NBSP = ' '

async function pytaj(q) {
  const r = await fetch(`${BAZA}/query/production?query=${encodeURIComponent(q)}`, {
    headers: naglowki,
  })
  const d = await r.json()
  if (!r.ok) throw new Error(JSON.stringify(d))
  return d.result
}

// --- 1. Pasek promocji bez twardych spacji ---------------------------------
const PROMO_CZYSTY =
  '−10% na pakiet depilacji i −20% na pielęgnację twarzy (zarezerwuj w sierpniu)'
if (PROMO_CZYSTY.includes(NBSP)) throw new Error('W treści paska został twardy odstęp')

// --- 2. Podstrona depilacji ------------------------------------------------
const STARY_AKAPIT_FRAGMENT = 'Odstęp ustalamy indywidualnie'
const NOWY_AKAPIT =
  'Laser stoi na miejscu w Krzeszowicach i jest dostępny każdego dnia pracy ' +
  'salonu, więc kolejne wizyty umawiam w terminie, który Ci pasuje, bez ' +
  'czekania na wolny sprzęt. To ma znaczenie praktyczne: seria działa najlepiej ' +
  'wtedy, gdy odstępy między zabiegami są zachowane. Zbyt krótka przerwa ' +
  'oznacza pracę na włosach poza fazą wzrostu, zbyt długa pozwala części ' +
  'mieszków przejść cały cykl. Odstęp między kolejnymi zabiegami wynosi ' +
  'zazwyczaj pięć tygodni.'

const STARY_ATUT = 'Pełna seria to zwykle około ośmiu zabiegów, z odstępami dobranymi do partii ciała'
const NOWY_ATUT = 'Pełna seria to zwykle około ośmiu zabiegów, w odstępach zazwyczaj pięciu tygodni'

const laser = await pytaj(
  `*[_id=="service-laser"][0]{atuty,"bloki":description[]{_key,style,"teksty":children[].text}}`
)
if (!laser) throw new Error('Brak dokumentu service-laser')

const blok = (laser.bloki || []).find((b) =>
  (b.teksty || []).join('').includes(STARY_AKAPIT_FRAGMENT)
)
if (!blok) throw new Error(`Nie znalazłem akapitu z „${STARY_AKAPIT_FRAGMENT}"`)

const atuty = (laser.atuty || []).map((a) => (a === STARY_ATUT ? NOWY_ATUT : a))
if (!atuty.includes(NOWY_ATUT)) throw new Error('Nie znalazłem atutu do podmiany')

// Akapit ma jedno dziecko tekstowe — nadpisujemy je w całości, zachowując _key,
// żeby nie zgubić powiązań w edytorze.
const sciezkaTekstu = `description[_key=="${blok._key}"].children[0].text`

// --- 3. Nagłówek galerii ---------------------------------------------------
const NAGLOWEK_GALERII = 'Zabiegi i efekty'

const mutacje = [
  { patch: { query: '*[_type=="siteSettings"]', set: { promoText: PROMO_CZYSTY } } },
  {
    patch: {
      query: '*[_type=="siteSettings"]',
      set: { galleryHeading: NAGLOWEK_GALERII },
    },
  },
  { patch: { id: 'service-laser', set: { [sciezkaTekstu]: NOWY_AKAPIT, atuty } } },
]

if (DRY) {
  console.log('PRÓBA (nic nie zapisuję).\n')
  console.log('Akapit do podmiany, klucz bloku:', blok._key)
  console.log('  BYŁO:', (blok.teksty || []).join('').slice(-120))
  console.log('  BĘDZIE:', NOWY_AKAPIT.slice(-120))
  console.log('\nMutacje:')
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
console.log(`Zapisano ${wynik.results?.length ?? 0} zmian.`)
