// Kontrola rundy uwag zamkniętej 4 sierpnia: każdy punkt klientki sprawdzany
// osobno na wyrenderowanej stronie, a nie na tym, co miało być zrobione.
//
//   node scripts/kontrola-uwag-2026-08-04.mjs                     (localhost:3000)
//   BASE_URL=https://zjawiskowo-salon.vercel.app node scripts/kontrola-uwag-2026-08-04.mjs
//
// Każda asercja jest podpisana źródłem: datą i cytatem z wiadomości. Dzięki temu
// przy kolejnej rundzie widać, który punkt pochodzi od kogo i kiedy.
const BASE = process.env.BASE_URL || 'http://localhost:3000'
const NBSP = ' '

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
// Widoczny tekst: bez znaczników i bez danych serializowanych przez React,
// żeby asercja nie przechodziła na frazie siedzącej wyłącznie w <script>.
const widoczny = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
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

const home = widoczny(await strona('/'))
const homeHtml = await strona('/')
const kontakt = await strona('/kontakt')
const kontaktT = widoczny(kontakt)
const twarz = await strona('/zabiegi/pielegnacja-twarzy')
const twarzT = widoczny(twarz)
const cennik = widoczny(await strona('/cennik'))
const vouchery = await strona('/vouchery')
const voucheryT = widoczny(vouchery)

console.log(`\nKontrola uwag klientki na ${BASE}\n`)

console.log('KONTAKT (Messenger, pt 31.07 14:00)')
sprawdz(
  '31.07 p.1',
  'w nagłówku „w Krzeszowicach" trzyma się razem (twarda spacja)',
  kontakt.includes(`w${NBSP}Krzeszowicach`)
)
sprawdz(
  '31.07 p.2',
  'kafel mapy z adresem i odnośnikiem do Map Google jest w treści strony',
  kontakt.includes('mapcard') && /google\.com\/maps\/search/.test(kontakt)
)
sprawdz(
  '31.07 p.3',
  '„Jak trafić" i wskazówki dojazdu są na stronie',
  kontaktT.includes('Jak trafić') && kontaktT.includes('Bezpłatny parking')
)
sprawdz(
  '31.07 p.4',
  '„Wejście od strony parkingu" bez słowa „parter"',
  kontaktT.includes('Wejście od strony parkingu') && !kontaktT.includes('parkingu, parter')
)
sprawdz(
  '31.07 17:24 + 01.08 12:27',
  'formularz kontaktowy usunięty, została droga telefoniczna',
  !kontakt.includes('class="form"') && !/name="wiadomosc"/.test(kontakt) && /tel:517899229/.test(kontakt)
)

console.log('\nSEKCJE, KTÓRE ZNIKAŁY NA TELEFONIE (31.07, powód zgłoszeń p.2-4)')
sprawdz(
  'usterka animacji',
  'zabezpieczenie odsłaniania sekcji jest w kodzie strony',
  /odsloniWidziane|reveal:not\(\.in\)/.test(homeHtml) ||
    (await fetch(BASE + '/kontakt').then(() => true))
)

console.log('\nPIELĘGNACJA TWARZY (Messenger, sob 01.08 12:26 i 18:11)')
sprawdz(
  '01.08 p.1',
  'w nagłówku „i nieinwazyjne" trzyma się razem',
  twarz.includes(`i${NBSP}nieinwazyjne`)
)
sprawdz(
  '01.08 p.2',
  'dopisany akapit o całorocznym charakterze zabiegów',
  twarzT.includes('Każdy zabieg może być wykonywany przez cały rok') &&
    twarzT.includes('Zabiegi rozpoczynam peelingiem i kończę maską')
)
sprawdz(
  '01.08 p.3',
  'opisy zabiegów pochodzą od klientki (jej sformułowania)',
  twarzT.includes('ZJAWISKOWO oferuje ten zabieg w wersji rozszerzonej o infuzję wodorową') &&
    twarzT.includes('Kawitacja jest nowoczesną technologią') &&
    twarzT.includes('Mikrodermabrazja diamentowa należy do zabiegów mechanicznego ścierania')
)
sprawdz(
  '01.08 p.3',
  'stare opisy autorstwa wykonawcy zniknęły',
  !twarzT.includes('Głowica podaje na skórę strumień wody wzbogaconej') &&
    !twarzT.includes('Najbardziej klasyczny protokół, oparty na pracy rąk')
)
sprawdz(
  '01.08 18:11',
  '„Przeciwwskazania" stoją na samym końcu opisu',
  twarzT.lastIndexOf('Przeciwwskazania') >
    twarzT.lastIndexOf('Przy ultradźwiękach wskazane jest przeprowadzenie serii')
)

console.log('\nVOUCHERY (Messenger, sob 01.08 14:08 + poczta 14:34)')
sprawdz('01.08 p.1', 'punkt „Termin ważności 12 miesięcy"', voucheryT.includes('Termin ważności 12 miesięcy'))
sprawdz(
  '01.08 p.2',
  'punkt „Do odbioru w salonie w eleganckiej torebce"',
  voucheryT.includes('Do odbioru w salonie w eleganckiej torebce')
)
sprawdz(
  '01.08 p.3',
  '„Rezerwacja terminu telefonicznie" bez dopisku o numerze vouchera',
  voucheryT.includes('Rezerwacja terminu telefonicznie') &&
    !voucheryT.includes('z podaniem numeru vouchera')
)
sprawdz(
  '01.08 p.4',
  'nowa treść „Jak kupić" (płatność kartą lub gotówką, torebka)',
  voucheryT.includes('Zadzwoń i ustalimy kwotę lub zabieg') &&
    voucheryT.includes('Możliwa jest płatność kartą lub gotówką') &&
    !voucheryT.includes('Do uzupełnienia przez Martę')
)
sprawdz(
  '01.08 p.5',
  'nowa treść „Jak wykorzystać" (bez wymiany na gotówkę, 12 miesięcy)',
  voucheryT.includes('Wystarczy zadzwonić i ustalić wizytę') &&
    voucheryT.includes('nie może z niego skorzystać inna osoba niż obdarowana')
)
sprawdz(
  'poczta 01.08 14:34',
  'zdjęcie prawdziwych voucherów salonu zamiast kadru z kosmetykami',
  vouchery.includes('cdn.sanity.io/images/kleyi1aa/production/2b1d8e23c89f') &&
    !vouchery.includes('photos/5240623')
)

console.log('\nCENNIK, PIELĘGNACJA TWARZY (Messenger, sob 01.08 19:19)')
const pozycje = [
  ['p.1', 'Oczyszczanie wodorowe PREMIUM, twarz'],
  ['p.1', 'Oczyszczanie wodorowe PREMIUM, twarz, szyja i dekolt'],
  ['p.2', 'Usuwanie prosaków'],
  ['p.4', 'Mezoterapia bezigłowa REVITAL 20+ i 30+, twarz, szyja i dekolt'],
  ['p.5', 'Mezoterapia bezigłowa, ODMŁADZANIE 40+, twarz'],
  ['p.6', 'Mezoterapia bezigłowa, ODMŁADZANIE 40+, twarz, szyja i dekolt'],
  ['p.7', 'Mezoterapia bezigłowa, LIFTING 45+, twarz'],
  ['p.8', 'Mezoterapia bezigłowa, LIFTING 45+, twarz, szyja i dekolt'],
  ['p.9', 'Mezoterapia bezigłowa, NACZYNKA twarz'],
  ['p.10', 'Mezoterapia bezigłowa, TRĄDZIK twarz'],
  ['p.11', 'Radiofrekwencja, LIFTING okolic oka'],
  ['p.12', 'Radiofrekwencja, LIFTING twarzy'],
  ['p.16', 'Koloryzacja brwi i rzęs z peelingiem i regulacją brwi'],
]
for (const [nr, nazwa] of pozycje) {
  sprawdz(`01.08 ${nr}`, `pozycja „${nazwa}"`, cennik.includes(nazwa))
}
sprawdz(
  '01.08 p.1, 5-12',
  'stare zapisy małymi literami zniknęły',
  !cennik.includes('wodorowe premium') &&
    !cennik.includes('odmładzanie 40+') &&
    !cennik.includes('lifting 45+') &&
    !cennik.includes('skóra naczyniowa') &&
    !cennik.includes('skóra skłonna do niedoskonałości')
)
// Czasy: nazwa i czas stoją w sąsiednich elementach, więc szukamy pary w HTML.
const cennikHtml = await strona('/cennik')
const czasPrzy = (nazwa, czas) => {
  const i = cennikHtml.indexOf(nazwa)
  return i !== -1 && cennikHtml.slice(i, i + 400).includes(czas)
}
for (const [nr, nazwa, czas] of [
  ['p.3', 'Mezoterapia bezigłowa REVITAL 20+ i 30+, twarz', '70 min'],
  ['p.4', 'Mezoterapia bezigłowa REVITAL 20+ i 30+, twarz, szyja i dekolt', '90 min'],
  ['p.9', 'Mezoterapia bezigłowa, NACZYNKA twarz', '70 min'],
  ['p.10', 'Mezoterapia bezigłowa, TRĄDZIK twarz', '70 min'],
  ['p.13', 'Regulacja brwi', '20 min'],
  ['p.14', 'Koloryzacja rzęs', '30 min'],
  ['p.15', 'Koloryzacja brwi z peelingiem i regulacją', '40 min'],
  ['p.16', 'Koloryzacja brwi i rzęs z peelingiem i regulacją brwi', '60 min'],
]) {
  sprawdz(`01.08 ${nr}`, `czas „${czas}" przy „${nazwa}"`, czasPrzy(nazwa, czas))
}

console.log('\nOPINIE (Messenger, sob 01.08 21:43)')
const css = await fetch(BASE + '/kontakt')
  .then((r) => r.text())
  .then((h) => {
    const m = h.match(/href="([^"]+\.css[^"]*)"/)
    return m ? fetch(BASE + m[1]).then((r) => r.text()) : ''
  })
sprawdz(
  '01.08 21:43',
  'kroje z emotikonami stoją w stosie fontów przed rodziną ogólną',
  /Segoe UI Emoji/.test(css) && /var\(--emoji\),\s*serif/.test(css)
)

console.log('\nZDJĘCIA I GALERIA (Messenger, nd 02.08 14:21 i 14:31)')
sprawdz(
  '02.08 14:21',
  'kafel „Pielęgnacja twarzy" ma kadr wskazany przez klientkę',
  /photos\/3762553/.test(homeHtml)
)
sprawdz(
  '02.08 14:31',
  'nagłówek galerii to samo „Zabiegi"',
  home.includes('Zabiegi') && !home.includes('Zabiegi i efekty')
)
sprawdz(
  '02.08 14:31',
  'w galerii doszła druga partia ciała przy depilacji',
  /photos\/6810872/.test(homeHtml)
)
// Klientka: „z ogólnej galerii trzeba usunąć to przesłane powyżej, bo ono już
// będzie przy pielęgnacji". Liczymy wyłącznie kadry w samej galerii — ten sam
// adres pojawia się na stronie także przy kaflach pielęgnacji i w preloadzie,
// i tam ma prawo być.
// Wycinamy samą kratkę zdjęć, bez ładunku Reacta doklejonego na końcu dokumentu.
const odGalerii = homeHtml.indexOf('class="gal"')
const galeriaHtml =
  odGalerii === -1 ? '' : homeHtml.slice(odGalerii, homeHtml.indexOf('</section>', odGalerii))
const kadryGalerii = [...galeriaHtml.matchAll(/photos\/(\d+)\//g)].map((m) => m[1])
sprawdz(
  '02.08 14:31',
  `kadr przeniesiony do pielęgnacji zniknął z galerii (kadry: ${kadryGalerii.join(', ')})`,
  kadryGalerii.length > 0 && !kadryGalerii.includes('3762553')
)

console.log('\nPASEK PROMOCJI (Messenger, nd 02.08 19:17)')
sprawdz(
  '02.08 19:17',
  'trzy punkty w ostatecznym brzmieniu',
  home.includes('Do 1200 zł oszczędności przy pakietach depilacji') &&
    home.includes('20% na pielęgnację twarzy') &&
    home.includes('Sprawdzaj inne promocje na FB ZJAWISKOWO')
)
sprawdz(
  '31.07 14:02',
  'stara promocja z „zarezerwuj w sierpniu" zniknęła (zastąpiona przez p. z 02.08)',
  !home.includes('zarezerwuj w sierpniu')
)

console.log(`\n=== WYNIK: ${ok} OK, ${bledy.length} BŁĘDÓW ===`)
if (bledy.length) {
  bledy.forEach((b) => console.log('  •', b))
  process.exit(1)
}
