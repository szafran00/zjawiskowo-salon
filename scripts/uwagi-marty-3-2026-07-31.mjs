// Pozostałe uwagi klientki z listy 17 punktów: 1, 5, 6, 7, 8, 10–17.
// Punkty 2, 4 i 9 poszły wcześniej, punkt 3 dotyczy zdjęć zastępczych
// i siedzi w app/lib/fallback.ts, nie w bazie.
//
// Uruchomienie:  node scripts/uwagi-marty-3-2026-07-31.mjs --dry
//                node scripts/uwagi-marty-3-2026-07-31.mjs
//
// GDZIE ODSTĄPIŁEM OD DOSŁOWNEJ TREŚCI KLIENTKI (do zgłoszenia jej):
//  * pkt 1  — poza usunięciem kropek i nawiasem skróciłem hasło, bo realnym
//             problemem było zawijanie paska na telefonie, a nie same kropki.
//  * pkt 15 — napisała „dodać", ale po słowie „jędrnością" stała już
//             „radiofrekwencja". Zostawiam ją jako przykład zabiegu
//             liftingującego, żeby zdanie się nie rozjechało.
//  * pkt 10, 16 — cyfry w tekście ciągłym zapisane słownie („jeden lub dwa",
//             „dwóch do trzech"), przecinki i myślnik doprowadzone do normy.
//             Treść merytoryczna bez zmian.
//  * pkt 17 — „Salon Zjawiskowo" zapisane wersalikami jak w identyfikacji.
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

// ---------------------------------------------------------------------------
// PUNKT 1 — pasek promocji
// Na telefonie kropka po „sierpniu" spadała do drugiego wiersza przed „−20%".
// Klientka: usunąć wszystkie kropki, „zarezerwuj w sierpniu" dać w nawiasie,
// nie poszerzać paska. Nowa wersja jest krótsza od poprzedniej, więc zawija
// się rzadziej, a jednoliterowe „i" oraz „w" związane są twardą spacją, żeby
// nie zostawały na końcu wiersza.
const PROMO = `−10% na pakiet depilacji i${NBSP}−20% na pielęgnację twarzy (zarezerwuj w${NBSP}sierpniu)`

// ---------------------------------------------------------------------------
// PUNKT 5 — „układamy" → „ustalam"
const LASER_EXCERPT =
  'Trwała redukcja owłosienia w serii około ośmiu zabiegów. Laser na miejscu ' +
  'w Krzeszowicach, dostępny każdego dnia pracy salonu, więc terminy ustalam ' +
  'pod Twój kalendarz.'

// PUNKT 6 — mikrodermabrazja diamentowa, dopisane ultradźwięki
const TWARZ_EXCERPT =
  'Oczyszczanie wodorowe, peeling kawitacyjny z LED, mikrodermabrazja ' +
  'diamentowa, oczyszczanie manualne, mezoterapia bezigłowa, radiofrekwencja, ' +
  'ultradźwięki i sonoforeza. Protokół układam pod bieżący stan skóry.'

// PUNKT 7 — „procent" → „%", po „dwóch" dochodzi „różnych"
const NOTE_TWARZ =
  'Rabat 20% na serię pięciu zabiegów albo szósty zabieg gratis. Rabat 20% ' +
  'przy dwóch różnych zabiegach wykonanych podczas jednej wizyty.'

// PUNKT 8 — opis grupy „Dodatki do zabiegów", dotąd pusty
const NOTE_DODATKI = 'Gratis maska i peeling przy każdym zabiegu.'

// ---------------------------------------------------------------------------
// FAQ. Kolejność docelowa: nowe pytanie o start serii na początku (pkt 10),
// pytanie o serię zabiegów na twarz zaraz po „Który zabieg na twarz wybrać?"
// (pkt 16), oczyszczanie wodorowe jako przedostatnie (pkt 17), voucher na
// końcu. Pola `order` przenumerowane od zera bez dziur.
const FAQ = [
  {
    _id: 'faq-9',
    order: 0,
    question: 'Kiedy należy rozpocząć serię depilacji laserowej?',
    answer:
      'Bardzo ważne, aby serię rozpocząć wczesną jesienią, żeby całą zdążyć ' +
      'wykonać do maja. Jeśli rozpoczniesz serię później, oczywiście jest to ' +
      'możliwe w każdym czasie, ale latem będzie trzeba zrobić przerwę ze ' +
      'względu na mocne promieniowanie słoneczne i dokończyć ją kolejnej ' +
      'jesieni, a wtedy do serii trzeba dołożyć jeden lub dwa zabiegi. Dlatego ' +
      'pamiętaj, aby nie przegapić odpowiedniego momentu.',
  },
  { _id: 'faq-1', order: 1 },
  {
    _id: 'faq-2',
    order: 2,
    question: 'Co ile tygodni umawiamy kolejne zabiegi depilacji?', // pkt 11
    answer:
      'Odstęp pomiędzy kolejnymi zabiegami wynosi zazwyczaj pięć tygodni. ' +
      'Zbyt krótka przerwa oznacza pracę na włosach poza fazą wzrostu, zbyt ' +
      'długa pozwala części mieszków przejść pełny cykl. Laser mam na miejscu ' +
      'i jest dostępny każdego dnia pracy salonu, więc termin dopasowuję do ' +
      'Twojego kalendarza, a nie do dostępności sprzętu.',
  },
  { _id: 'faq-3', order: 3 },
  { _id: 'faq-4', order: 4, question: 'Czy zabieg depilacji boli?' }, // pkt 12
  { _id: 'faq-5', order: 5, question: 'Jakie są przeciwwskazania do depilacji?' }, // pkt 13
  { _id: 'faq-6', order: 6, question: 'Jak dbać o skórę po zabiegu depilacji?' }, // pkt 14
  {
    _id: 'faq-7',
    order: 7,
    answer: // pkt 15
      'Nie musisz wybierać przed wizytą. Zaczynamy od rozmowy i oceny skóry, ' +
      'a zabieg dobieram do jej bieżącego stanu. Skóra zanieczyszczona i ' +
      'matowa zwykle korzysta z oczyszczania, skóra odwodniona z zabiegów ' +
      'wprowadzających substancje aktywne, a skóra z obniżoną jędrnością ' +
      'z zabiegów liftingujących, takich jak radiofrekwencja. Większość ' +
      'zabiegów pracuje najlepiej w serii, z zachowaniem odstępów.',
  },
  {
    _id: 'faq-10',
    order: 8,
    question: 'Dlaczego warto robić serię zabiegów na twarz?', // pkt 16
    answer:
      'To sposób na widoczną i trwałą poprawę stanu skóry. Jednorazowy zabieg ' +
      'przynosi najczęściej tzw. efekt bankietowy: skóra jest odświeżona ' +
      'i napięta na kilka dni lub tygodni. Natomiast każdy kolejny zabieg ' +
      'z serii, w odstępach dwóch do trzech tygodni, nadbudowuje efekt ' +
      'poprzedniego, głęboko regenerując i zagęszczając tkankę od wewnątrz.',
  },
  {
    _id: 'faq-11',
    order: 9,
    question: 'Kiedy oczyszczanie wodorowe przynosi efekty?', // pkt 17
    answer:
      'Tylko wtedy, kiedy urządzenie posiada generator wodoru. To podstawa. ' +
      'Salon ZJAWISKOWO posiada taki sprzęt. Ponadto w moim salonie ' +
      'otrzymujesz ten zabieg w wersji PREMIUM, co oznacza, że oprócz ' +
      'podstawowej wersji zabiegowej dostajesz dodatkowo w gratisie infuzję ' +
      'wodorową, która intensywnie nawilża i liftinguje skórę pod wpływem ' +
      'ciśnienia, wymiatając z niej niekorzystne wolne rodniki.',
  },
  { _id: 'faq-8', order: 10 },
]

// ---------------------------------------------------------------------------
const grupy = await pytaj(`*[_type=="pricelist"][0].groups[]{_key,anchor,title}`)
const kluczTwarz = grupy.find((g) => g.anchor === 'pielegnacja-twarzy')?._key
const kluczDodatki = grupy.find((g) => g.anchor === 'dodatki')?._key
if (!kluczTwarz || !kluczDodatki) throw new Error('Nie znalazłem grup cennika')

const istniejace = new Set(
  (await pytaj(`*[_type=="faqItem"]._id`)).map((id) => id.replace('drafts.', ''))
)

const mutacje = [
  { patch: { query: '*[_type=="siteSettings"]', set: { promoText: PROMO } } },
  { patch: { id: 'service-laser', set: { excerpt: LASER_EXCERPT } } },
  { patch: { id: 'service-twarz', set: { excerpt: TWARZ_EXCERPT } } },
  {
    patch: {
      query: '*[_type=="pricelist"]',
      set: {
        [`groups[_key=="${kluczTwarz}"].note`]: NOTE_TWARZ,
        [`groups[_key=="${kluczDodatki}"].note`]: NOTE_DODATKI,
      },
    },
  },
  ...FAQ.map((f) => {
    const { _id, ...pola } = f
    // Nowe pytania trzeba utworzyć; istniejące tylko łatamy, żeby nie zgubić
    // pól, których ta migracja nie dotyka.
    return istniejace.has(_id)
      ? { patch: { id: _id, set: pola } }
      : { createOrReplace: { _id, _type: 'faqItem', ...pola } }
  }),
]

if (DRY) {
  console.log(`PRÓBA (nic nie zapisuję). Mutacji: ${mutacje.length}\n`)
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
