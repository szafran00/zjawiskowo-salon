// Kontrola rundy uwag z 5 sierpnia: każdy punkt klientki sprawdzany osobno na
// wyrenderowanej stronie, a nie na tym, co miało zostać zrobione.
//
//   node scripts/kontrola-uwag-2026-08-05.mjs                     (localhost:3000)
//   BASE_URL=https://zjawiskowo-salon.vercel.app node scripts/kontrola-uwag-2026-08-05.mjs
//
// Każda asercja jest podpisana źródłem: godziną wiadomości i numerem punktu.
// Poza punktami klientki są tu zabezpieczenia przed nadgorliwością: rzeczy,
// które przy tych zmianach łatwo skasować przypadkiem (nazwa zabiegu w cenniku
// i w opisie, pasek promocji, dane w regulaminie).
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

// Widoczny tekst: bez znaczników i bez danych serializowanych przez React, żeby
// asercja nie przechodziła na frazie siedzącej wyłącznie w <script>. Twarde
// spacje spłaszczone do zwykłych, bo wiąże je warstwa renderująca, a nie treść.
const widoczny = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/ /g, ' ')
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
const laser = widoczny(await strona('/zabiegi/depilacja-laserowa'))
const twarz = widoczny(await strona('/zabiegi/pielegnacja-twarzy'))
const oMnie = widoczny(await strona('/o-mnie'))
const cennik = widoczny(await strona('/cennik'))
const prywatnosc = widoczny(await strona('/polityka-prywatnosci'))
const regulamin = widoczny(await strona('/regulamin'))
const kontakt = widoczny(await strona('/kontakt'))
const vouchery = widoczny(await strona('/vouchery'))

console.log(`\nKontrola uwag klientki z 5 sierpnia na ${BASE}\n`)

console.log('DEPILACJA LASEROWA (Messenger, 19:11)')
sprawdz(
  '19:11 p.1',
  'piąty wyróżnik brzmi „Bezpłatna konsultacja i próba laserowa w razie potrzeby"',
  laser.includes('Bezpłatna konsultacja i próba laserowa w razie potrzeby')
)
sprawdz(
  '19:11 p.1',
  'stara wersja piątego wyróżnika zniknęła',
  !laser.includes('próba laserowa na niewielkim obszarze przed pierwszym zabiegiem')
)
for (const punkt of [
  'Depilacja bez żelu',
  'Mała głowica chłodząca',
  'Duża głowica próżniowa',
  'Dodatkowe chłodzenie wrażliwych obszarów',
]) {
  sprawdz('19:11 p.2', `dołożony wyróżnik „${punkt}"`, laser.includes(punkt))
}
sprawdz(
  '19:11 p.3',
  'z akapitu o serii zniknęło „choć bywa ich mniej lub więcej"',
  !laser.includes('choć bywa ich mniej lub więcej')
)
sprawdz(
  '19:11 p.3',
  'reszta zdania o serii została nienaruszona',
  laser.includes(
    'pełna seria to około ośmiu zabiegów, zależnie od partii ciała, koloru i grubości włosa'
  )
)
sprawdz(
  '19:11 p.4',
  'ostatnie zdanie w „Odczucia i przeciwwskazania" brzmi „Pierwszy zabieg może być poprzedzony próbą laserową."',
  laser.includes('Pierwszy zabieg może być poprzedzony próbą laserową.')
)
sprawdz(
  '19:11 p.4',
  'stare zdanie o próbie w mało widocznym miejscu zniknęło',
  !laser.includes('próba w niewielkim, mało widocznym miejscu')
)

console.log('\nZDANIE POD PRZYCISKIEM TELEFONU, KOŃCÓWKA KAŻDEJ STRONY (19:11 p.5)')
const CTA_NOWE =
  'Pierwsza wizyta zaczyna się od bezpłatnej konsultacji, a przy depilacji w razie potrzeby także od próby laserowej.'
const CTA_STARE =
  'a przy depilacji także od próby laserowej'
for (const [nazwa, tresc] of [
  ['strona główna', home],
  ['depilacja laserowa', laser],
  ['pielęgnacja twarzy', twarz],
  ['o mnie', oMnie],
  ['cennik', cennik],
  ['kontakt', kontakt],
]) {
  sprawdz('19:11 p.5', `${nazwa}: nowe zdanie o próbie „w razie potrzeby"`, tresc.includes(CTA_NOWE))
  sprawdz('19:11 p.5', `${nazwa}: stara wersja zdania zniknęła`, !tresc.includes(CTA_STARE))
}
// Vouchery mają własne zakończenie („Ustalimy kwotę albo zabieg…"), bo strona
// nie dotyczy pierwszej wizyty. Uwaga klientki mówiła o zdaniu o konsultacji,
// więc tu sprawdzamy tylko, że stara wersja nigdzie nie została.
sprawdz(
  '19:11 p.5',
  'vouchery: własne zakończenie strony, bez zdania o pierwszej wizycie',
  vouchery.includes('voucher przygotuję do odbioru w salonie') && !vouchery.includes(CTA_STARE)
)

console.log('\nPIELĘGNACJA TWARZY (Messenger, 19:18)')
sprawdz(
  '19:18 p.1',
  'wyliczenie zabiegów bez „z LED"',
  twarz.includes(
    'Oczyszczanie wodorowe, peeling kawitacyjny, mikrodermabrazja diamentowa'
  ) && !twarz.includes('peeling kawitacyjny z LED')
)
sprawdz(
  '19:18 p.1 (zabezpieczenie)',
  'pełna nazwa zabiegu w opisie została: „Peeling kawitacyjny z terapią LED"',
  twarz.includes('Peeling kawitacyjny z terapią LED')
)
sprawdz(
  '19:18 p.1 (zabezpieczenie)',
  'obie pozycje cennika z terapią LED zostały nietknięte',
  cennik.includes('Peeling kawitacyjny z terapią LED, twarz') &&
    cennik.includes('Peeling kawitacyjny z terapią LED, twarz, szyja i dekolt')
)
sprawdz(
  '19:18 p.2',
  'szósty wyróżnik mówi o dwóch RÓŻNYCH zabiegach',
  twarz.includes('Rabat na serię pięciu zabiegów oraz na dwa różne zabiegi podczas jednej wizyty')
)

console.log('\nPOLITYKA PRYWATNOŚCI (Messenger, 19:22)')
sprawdz(
  '19:22 p.1',
  'administrator: pełna nazwa z nazwiskiem',
  prywatnosc.includes('Salon Kosmetyczny ZJAWISKOWO Marta Pikul')
)
sprawdz(
  '19:22 p.1',
  'administrator: adres salonu',
  prywatnosc.includes('ul. 3 Maja 4, 32-065 Krzeszowice')
)
sprawdz(
  '19:22 p.1',
  'administrator: NIP zgodny z regulaminem klientki',
  prywatnosc.includes('NIP 676-207-35-90')
)
sprawdz(
  '19:22 p.1',
  'w dokumencie nie został żaden nawias do uzupełnienia',
  !/\[(pełna nazwa|NIP|e-mail|adres)/i.test(prywatnosc)
)
sprawdz(
  '19:22 p.1',
  'adnotacja o dokumencie roboczym zdjęta',
  !prywatnosc.includes('Dokument roboczy')
)
sprawdz(
  '19:22 p.2',
  'punkt 2 mówi o umawianiu telefonicznym, nie o formularzu',
  prywatnosc.includes('Jeśli umawiasz się telefonicznie') &&
    !prywatnosc.includes('Jeśli korzystasz z formularza kontaktowego')
)
sprawdz(
  '19:22 p.3',
  'punkt 3 bez pośrednika od formularza (Formspree)',
  !prywatnosc.includes('Formspree')
)
sprawdz(
  '19:22 p.3',
  'punkt 3 nadal informuje o odbiorcach danych (wymóg RODO)',
  prywatnosc.includes('Odbiorcy danych') &&
    prywatnosc.includes('nie udostępniamy osobom trzecim')
)
sprawdz(
  '19:22 p.2-3 (spójność)',
  'w całej polityce nie ma już słowa „formularz"',
  !/formularz/i.test(prywatnosc)
)
sprawdz(
  '19:22 p.2-3 (spójność)',
  'zapowiedź polityki w regulaminie też bez formularza',
  regulamin.includes(
    'Zasady przetwarzania danych osobowych oraz korzystania z plików cookies'
  ) && !/obsługi formularza kontaktowego/.test(regulamin)
)
sprawdz(
  '19:22 (zabezpieczenie)',
  'kontakt w sprawie danych prowadzi na telefon salonu',
  prywatnosc.includes('zadzwoń pod numer') && prywatnosc.includes('517 899 229')
)

console.log('\nO MNIE (Messenger, 19:22)')
sprawdz(
  '19:22 O MNIE',
  'imię i nazwisko podpisane na końcu tekstu',
  oMnie.includes('Marta Pikul')
)
sprawdz(
  '19:22 O MNIE',
  'podpis stoi po ostatnim akapicie o Krzeszowicach',
  oMnie.indexOf('Marta Pikul') > oMnie.indexOf('dobranie najlepszych efektów zabiegowych')
)

console.log('\nCENNIK, GRATIS POD ZABIEGAMI (Messenger, wieczorem 5.08)')
const cennikHtml = await strona('/cennik')
const GRATIS = 'Gratis maska i peeling przy każdym zabiegu.'
const iGratis = cennik.indexOf(GRATIS)
// „Dodatki do zabiegów” pada na stronie dwa razy: raz jako odnośnik w przyklejonej
// nawigacji kotwic na górze, raz jako nagłówek grupy. Kolejność w cenniku
// rozstrzyga to drugie wystąpienie.
const iDodatki = cennik.lastIndexOf('Dodatki do zabiegów')
const iOstatniZabieg = cennik.indexOf('Koloryzacja brwi i rzęs z peelingiem i regulacją brwi')
sprawdz(
  '5.08 wieczór',
  'zdanie o gratisie jest na stronie dokładnie raz',
  iGratis !== -1 && cennik.indexOf(GRATIS, iGratis + 1) === -1
)
sprawdz(
  '5.08 wieczór',
  'stoi pod ostatnią pozycją pielęgnacji twarzy',
  iOstatniZabieg !== -1 && iGratis > iOstatniZabieg
)
sprawdz(
  '5.08 wieczór',
  'stoi przed nagłówkiem „Dodatki do zabiegów", nie w środku dodatków',
  iDodatki !== -1 && iGratis < iDodatki
)
sprawdz(
  '5.08 wieczór',
  'między nagłówkiem dodatków a „Ampułka" nie ma już żadnej obietnicy gratisu',
  !/gratis/i.test(cennik.slice(iDodatki, cennik.indexOf('Ampułka')))
)
sprawdz(
  '5.08 wieczór',
  'zdanie renderuje się jako adnotacja domykająca grupę (klasa pb-foot)',
  /class="pb-foot"[^>]*>Gratis maska/.test(cennikHtml)
)
sprawdz(
  '5.08 wieczór (zabezpieczenie)',
  'rabaty nad listą pielęgnacji zostały nietknięte',
  cennik.includes('Rabat 20% na serię pięciu zabiegów albo szósty zabieg gratis')
)
sprawdz(
  '5.08 wieczór (zabezpieczenie)',
  'obie pozycje dodatków bez zmian w cenie',
  /Ampułka[^0-9]*30 zł/.test(cennik) && /Maska algowa[^0-9]*20 zł/.test(cennik)
)

console.log('\nCZEGO TA RUNDA NIE MIAŁA RUSZYĆ (zabezpieczenia)')
// Początek zdania zmieniła 6 sierpnia na „Nawet 1200 zł", więc tutaj zostaje
// tylko to, czego tamta zmiana nie miała ruszyć: kwota, procent i odesłanie
// na Facebooka.
sprawdz(
  'runda 4.08',
  'pasek promocji nadal w wersji ustalonej przez klientkę',
  home.includes('1200 zł oszczędności przy pakietach depilacji') &&
    home.includes('20% na pielęgnację twarzy') &&
    home.includes('Sprawdzaj inne promocje na FB ZJAWISKOWO')
)
sprawdz(
  'runda 4.08',
  'strona kontakt nadal bez formularza, z numerem telefonu',
  !/name="wiadomosc"/.test(await strona('/kontakt')) &&
    /tel:517899229/.test(await strona('/kontakt'))
)
sprawdz(
  'runda 4.08',
  'regulamin klientki na miejscu (nazwa firmy i NIP w treści)',
  regulamin.includes('Salon Kosmetyczny ZJAWISKOWO Marta Pikul') &&
    regulamin.includes('676-207-35-90')
)
sprawdz(
  'runda 4.08',
  'opisy zabiegów pielęgnacji od klientki nadal na stronie',
  twarz.includes('Oczyszczanie wodorowe PREMIUM') && twarz.includes('Przeciwwskazania')
)
sprawdz(
  'runda 4.08',
  'wyróżniki depilacji nie zgubiły starych punktów',
  laser.includes('Wskaźnik satysfakcji 100%') &&
    laser.includes('Zapomnij o maszynce i wosku między wizytami')
)

console.log(`\nPodsumowanie: ${ok} przeszło, ${bledy.length} nie przeszło.`)
if (bledy.length) {
  console.log('\nNie przeszły:')
  bledy.forEach((b) => console.log('  •', b))
  process.exit(1)
}
