// Kontrola uwag z nocy 5 na 6 sierpnia: pogrubienie zdania o gratisie, pasek
// promocji („Nawet" zamiast „Do", większa kwota i procent) oraz słowo „zadbać”
// w pierwszym zdaniu strony „O mnie”.
//
//   node scripts/kontrola-uwag-2026-08-06.mjs                     (localhost:3000)
//   BASE_URL=https://zjawiskowo-salon.vercel.app node scripts/kontrola-uwag-2026-08-06.mjs
//
// Uwagi o wyglądzie sprawdzamy w arkuszach stylów wydania, nie w źródle w repo:
// zmiana w pliku nie znaczy, że wyszła na stronę. Wydanie produkcyjne rozbija
// style na kilka arkuszy, więc czytamy wszystkie (lekcja z 4 sierpnia).
const BASE = process.env.BASE_URL || 'http://localhost:3000'

let ok = 0
const bledy = []

const strony = {}
async function strona(sciezka) {
  if (!strony[sciezka]) {
    const r = await fetch(BASE + sciezka, { headers: { 'cache-control': 'no-cache' } })
    if (!r.ok) throw new Error(`GET ${sciezka} -> ${r.status}`)
    strony[sciezka] = await r.text()
  }
  return strony[sciezka]
}
const widoczny = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/ /g, ' ')
    .replace(/\s+/g, ' ')

function sprawdz(zrodlo, opis, warunek) {
  if (warunek) {
    ok++
    console.log(`  OK    ${zrodlo} — ${opis}`)
  } else {
    bledy.push(`${zrodlo} — ${opis}`)
    console.log(`  BŁĄD  ${zrodlo} — ${opis}`)
  }
}

const homeHtml = await strona('/')
const home = widoczny(homeHtml)
const cennikHtml = await strona('/cennik')
const cennik = widoczny(cennikHtml)
const oMnie = widoczny(await strona('/o-mnie'))

const arkusze = [...homeHtml.matchAll(/href="([^"]+\.css[^"]*)"/g)].map((m) => m[1])
const css = (
  await Promise.all(arkusze.map((a) => fetch(BASE + a).then((r) => r.text())))
).join('\n')

console.log(`\nKontrola uwag klientki z 6 sierpnia na ${BASE}\n`)

console.log('PASEK PROMOCJI (Messenger 00:24 i 00:43)')
sprawdz(
  '00:24',
  'pasek zaczyna się od „Nawet 1200 zł oszczędności"',
  home.includes('Nawet 1200 zł oszczędności przy pakietach depilacji')
)
sprawdz('00:24', 'stare „Do 1200 zł" zniknęło', !home.includes('Do 1200 zł'))
sprawdz(
  '00:24',
  'kwota 1200 zł jest wyróżniona osobnym znacznikiem',
  /<span class="promo-kwota">1200\s*zł<\/span>/.test(homeHtml)
)
sprawdz(
  '00:43',
  'procent też jest wyróżniony',
  /<span class="promo-kwota">−?\s?20%<\/span>/.test(homeHtml)
)
sprawdz(
  '00:24 i 00:43',
  `wyróżnienie realnie powiększa i pogrubia (${arkusze.length} arkusze stylów)`,
  /\.promo\s+\.promo-kwota\{[^}]*font-size:1\.15em[^}]*font-weight:800/.test(css)
)
sprawdz(
  '00:24 (zabezpieczenie)',
  'reszta paska bez zmian, trzy punkty jak ustaliła',
  home.includes('20% na pielęgnację twarzy') &&
    home.includes('Sprawdzaj inne promocje na FB ZJAWISKOWO')
)

console.log('\nGRATIS POD ZABIEGAMI, POGRUBIENIE (Messenger 5.08, 20:43)')
sprawdz(
  '5.08 20:43',
  'zdanie o gratisie nadal stoi pod pozycjami pielęgnacji',
  /class="pb-foot"[^>]*>Gratis maska/.test(cennikHtml)
)
sprawdz(
  '5.08 20:43',
  'i jest pogrubione w arkuszu wydania',
  /\.pb-foot\{[^}]*font-weight:700/.test(css)
)

console.log('\nO MNIE (Messenger 00:27)')
sprawdz(
  '00:27',
  'pierwsze zdanie brzmi „łatwiej zadbać o rzeczy"',
  oMnie.includes('W kameralnym salonie łatwiej zadbać o rzeczy, które w większym gabinecie giną')
)
sprawdz('00:27', 'skrót „łatwiej o rzeczy" zniknął', !oMnie.includes('łatwiej o rzeczy'))
sprawdz(
  '00:27 (zabezpieczenie)',
  'reszta akapitu nietknięta',
  oMnie.includes('Nie ma pośpiechu między jedną klientką a drugą, bo w danym czasie jest tu jedna osoba')
)
sprawdz(
  '00:27 (zabezpieczenie)',
  'podpis klientki z wczorajszej rundy nadal na końcu',
  oMnie.includes('Marta Pikul')
)

console.log(`\nPodsumowanie: ${ok} przeszło, ${bledy.length} nie przeszło.`)
if (bledy.length) {
  console.log('\nNie przeszły:')
  bledy.forEach((b) => console.log('  •', b))
  process.exit(1)
}
