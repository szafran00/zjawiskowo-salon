// Uwagi klientki z 5 sierpnia (Messenger, wiadomości 19:11, 19:18, 19:22 i 19:23),
// zamknięte przez nią słowami „Chyba tyle Panie Franciszku”. Runda szósta.
//
// Uruchomienie:  node scripts/uwagi-marty-6-2026-08-05.mjs --dry
//                node scripts/uwagi-marty-6-2026-08-05.mjs
//
// Co tu jest, w kolejności zapisu:
//
// 1. DEPILACJA LASEROWA, wyróżniki — piąty punkt przestaje obiecywać próbę przed
//    każdym pierwszym zabiegiem („w razie potrzeby”), a lista rośnie o cztery
//    punkty techniczne, które klientka uznaje za ważne dla klientek: brak żelu,
//    dwie głowice, dodatkowe chłodzenie.
//
// 2. DEPILACJA LASEROWA, opis — z akapitu o serii znika wtrącenie „choć bywa ich
//    mniej lub więcej”, a ostatnie zdanie o próbie schodzi z trybu obowiązku na
//    możliwość. Oba zdania mówiły dotąd co innego niż wyróżnik wyżej.
//
// 3. USTAWIENIA, zdanie pod przyciskiem telefonu (widoczne na końcu każdej
//    strony) — próba laserowa też „w razie potrzeby”. To domyka spójność: po tej
//    rundzie żadne miejsce na stronie nie zapowiada próby jako obowiązkowej.
//
// 4. PIELĘGNACJA TWARZY — z krótkiego wyliczenia zabiegów znika „z LED”.
//    Uzasadnienie klientki: w wyliczeniu nie ma wariantów przy innych pozycjach
//    (PREMIUM, NACZYNKA), więc jeden dopisek psuje rytm. Pełna nazwa zabiegu
//    w cenniku i w opisie zostaje bez zmian, bo tak brzmi program na urządzeniu.
//
// 5. PIELĘGNACJA TWARZY, szósty wyróżnik — rabat dotyczy dwóch RÓŻNYCH zabiegów
//    podczas jednej wizyty. Bez tego słowa punkt czyta się jak rabat za powtórkę
//    tego samego zabiegu.
//
// 6. O MNIE — podpis imieniem i nazwiskiem na końcu tekstu.
//
// 7. REGULAMIN, zapowiedź polityki prywatności — bez wzmianki o formularzu
//    kontaktowym, którego strona nie ma od 4 sierpnia. Sama polityka
//    prywatności siedzi w kodzie, nie w panelu: patrz
//    app/(site)/polityka-prywatnosci/page.tsx.
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

const bledy = []
const sprawdz = (warunek, komunikat) => {
  if (!warunek) bledy.push(komunikat)
}

// ------------------------------------------------------- 1 i 2. depilacja --
const ATUT_PROBA_STARY =
  'Bezpłatna konsultacja i próba laserowa na niewielkim obszarze przed pierwszym zabiegiem'
const ATUT_PROBA_NOWY = 'Bezpłatna konsultacja i próba laserowa w razie potrzeby'
const ATUTY_DOKLADANE = [
  'Depilacja bez żelu',
  'Mała głowica chłodząca',
  'Duża głowica próżniowa',
  'Dodatkowe chłodzenie wrażliwych obszarów',
]
const SERIA_WTRACENIE = ', choć bywa ich mniej lub więcej'
const PROBA_ZDANIE_STARE =
  'Pierwszy zabieg poprzedza próba w niewielkim, mało widocznym miejscu.'
const PROBA_ZDANIE_NOWE = 'Pierwszy zabieg może być poprzedzony próbą laserową.'

// -------------------------------------------------------------- 3. ustawienia --
const CTA_STARY =
  'Pierwsza wizyta zaczyna się od bezpłatnej konsultacji, a przy depilacji także od próby laserowej. Porozmawiamy o Twojej skórze, dobierzemy zabieg i znajdziemy dogodny termin.'
const CTA_NOWY =
  'Pierwsza wizyta zaczyna się od bezpłatnej konsultacji, a przy depilacji w razie potrzeby także od próby laserowej. Porozmawiamy o Twojej skórze, dobierzemy zabieg i znajdziemy dogodny termin.'

// ---------------------------------------------------------- 4 i 5. twarz --
const EXCERPT_WYCINEK = ' z LED'
const ATUT_RABAT_STARY =
  'Rabat na serię pięciu zabiegów oraz na dwa zabiegi podczas jednej wizyty'
const ATUT_RABAT_NOWY =
  'Rabat na serię pięciu zabiegów oraz na dwa różne zabiegi podczas jednej wizyty'

// ------------------------------------------------------------- 6. o mnie --
const PODPIS = 'Marta Pikul'

// ----------------------------------------------------------- 7. regulamin --
const PRYWATNOSC_STARA =
  'Zasady przetwarzania danych osobowych, obsługi formularza kontaktowego oraz korzystania z plików cookies opisuje osobny dokument.'
const PRYWATNOSC_NOWA =
  'Zasady przetwarzania danych osobowych oraz korzystania z plików cookies opisuje osobny dokument.'

// --------------------------------------------------------------- odczyt ----
const [laser, twarz, ustawienia, oMnie, regulamin] = await Promise.all([
  pytaj('*[_id=="service-laser"][0]{atuty,description}'),
  pytaj('*[_id=="service-twarz"][0]{atuty,excerpt}'),
  pytaj('*[_id=="siteSettings"][0]{ctaLead}'),
  pytaj('*[_id=="aboutPage"][0]{body}'),
  pytaj('*[_id=="termsPage"][0]{privacyIntro}'),
])

const tekstBloku = (b) => (b.children || []).map((c) => c.text).join('')

// --- 1. wyróżniki depilacji -------------------------------------------------
const atutyLaseraStare = laser?.atuty || []
sprawdz(
  atutyLaseraStare[4] === ATUT_PROBA_STARY,
  `Piąty wyróżnik depilacji brzmi inaczej niż zakładam: „${atutyLaseraStare[4]}”`
)
let atutyLasera = atutyLaseraStare.map((a, i) => (i === 4 ? ATUT_PROBA_NOWY : a))
for (const nowy of ATUTY_DOKLADANE) {
  if (!atutyLasera.includes(nowy)) atutyLasera.push(nowy)
}

// --- 2. opis depilacji ------------------------------------------------------
const opisLaseraStary = laser?.description || []
const blokSeria = opisLaseraStary.find((b) => tekstBloku(b).includes(SERIA_WTRACENIE))
sprawdz(blokSeria, 'Nie znalazłem akapitu z wtrąceniem „choć bywa ich mniej lub więcej”')
const blokProba = opisLaseraStary.find((b) => tekstBloku(b).includes(PROBA_ZDANIE_STARE))
sprawdz(blokProba, 'Nie znalazłem zdania o próbie w „Odczucia i przeciwwskazania”')

const opisLasera = opisLaseraStary.map((b) => ({
  ...b,
  children: (b.children || []).map((c) => ({
    ...c,
    text: String(c.text ?? '')
      .replace(SERIA_WTRACENIE, '')
      .replace(PROBA_ZDANIE_STARE, PROBA_ZDANIE_NOWE),
  })),
}))

// --- 3. zdanie pod przyciskiem ----------------------------------------------
sprawdz(
  ustawienia?.ctaLead === CTA_STARY,
  `Zdanie pod przyciskiem telefonu brzmi inaczej niż zakładam: „${ustawienia?.ctaLead}”`
)

// --- 4 i 5. pielęgnacja twarzy ----------------------------------------------
const excerptStary = twarz?.excerpt || ''
sprawdz(
  excerptStary.includes(EXCERPT_WYCINEK),
  `W wyliczeniu zabiegów twarzy nie ma „${EXCERPT_WYCINEK.trim()}”: „${excerptStary}”`
)
const excerptNowy = excerptStary.replace(EXCERPT_WYCINEK, '')

const atutyTwarzyStare = twarz?.atuty || []
sprawdz(
  atutyTwarzyStare[5] === ATUT_RABAT_STARY,
  `Szósty wyróżnik pielęgnacji brzmi inaczej niż zakładam: „${atutyTwarzyStare[5]}”`
)
const atutyTwarzy = atutyTwarzyStare.map((a, i) => (i === 5 ? ATUT_RABAT_NOWY : a))

// --- 6. podpis pod „O mnie” -------------------------------------------------
const cialoOMnie = [...(oMnie?.body || [])]
sprawdz(cialoOMnie.length > 0, 'Strona „O mnie” jest pusta, nie mam czego podpisać')
const jestPodpis = cialoOMnie.some((b) => tekstBloku(b).trim() === PODPIS)
if (!jestPodpis) {
  cialoOMnie.push({
    _key: 'about-podpis',
    _type: 'block',
    style: 'normal',
    markDefs: [],
    children: [{ _key: 'about-podpis-s', _type: 'span', marks: [], text: PODPIS }],
  })
}

// --- 7. zapowiedź polityki prywatności --------------------------------------
sprawdz(
  regulamin?.privacyIntro === PRYWATNOSC_STARA,
  `Zapowiedź polityki prywatności brzmi inaczej niż zakładam: „${regulamin?.privacyIntro}”`
)

// --------------------------------------------------------------- zapis -----
if (bledy.length) {
  console.error('Nie zapisuję, bo treść w panelu nie wygląda tak, jak zakładam:')
  bledy.forEach((b) => console.error('  •', b))
  process.exit(1)
}

const mutacje = [
  { patch: { id: 'service-laser', set: { atuty: atutyLasera, description: opisLasera } } },
  { patch: { id: 'siteSettings', set: { ctaLead: CTA_NOWY } } },
  { patch: { id: 'service-twarz', set: { atuty: atutyTwarzy, excerpt: excerptNowy } } },
  { patch: { id: 'aboutPage', set: { body: cialoOMnie } } },
  { patch: { id: 'termsPage', set: { privacyIntro: PRYWATNOSC_NOWA } } },
]

if (DRY) {
  console.log('PRÓBA (nic nie zapisuję).\n')
  console.log('Wyróżniki depilacji:', atutyLaseraStare.length, '→', atutyLasera.length)
  atutyLasera.forEach((a, i) => console.log(`  ${i + 1}. ${a}`))
  console.log('\nAkapit o serii:')
  console.log('  ', tekstBloku(opisLasera.find((b) => b._key === blokSeria?._key) || {}))
  console.log('\nOstatnie zdanie o próbie:')
  console.log('  ', tekstBloku(opisLasera.find((b) => b._key === blokProba?._key) || {}).slice(-120))
  console.log('\nZdanie pod przyciskiem telefonu:\n  ', CTA_NOWY)
  console.log('\nWyliczenie zabiegów twarzy:\n  ', excerptNowy)
  console.log('\nSzósty wyróżnik pielęgnacji:\n  ', atutyTwarzy[5])
  console.log('\nOstatni blok „O mnie”:\n  ', tekstBloku(cialoOMnie[cialoOMnie.length - 1]))
  console.log('\nZapowiedź polityki prywatności:\n  ', PRYWATNOSC_NOWA)
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
