// Przenosi treść z panelu do sanity/seed/content.mjs.
//
//   node scripts/synchronizuj-seed.mjs --dry
//   node scripts/synchronizuj-seed.mjs
//
// Kierunek jest jeden: panel → repozytorium. Panel jest źródłem prawdy, bo tam
// wchodzą uwagi klientki. Plik w repozytorium ma dwie role (treść zastępcza przy
// awarii Sanity oraz wsad dla `npm run seed`) i obie wymagają, żeby nie odstawał.
//
// Skrypt rusza wyłącznie te pola, które porownaj-seed.mjs potrafi porównać:
// wybrane pola ustawień, wskazówki dojazdu, opisy i atuty zabiegów, pełne opisy
// zabiegów, pozycje cennika, stronę voucherów, całe FAQ i punkty wyróżniające.
// Reszty pliku (komentarze, struktura, regulamin, opinie) nie dotyka.
//
// Po uruchomieniu sprawdź `npm run check:seed` — ma wyjść „bez różnic".
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const DRY = process.argv.includes('--dry')
const katalog = dirname(fileURLToPath(import.meta.url))
const PLIK = resolve(katalog, '../sanity/seed/content.mjs')

const PROJEKT = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'kleyi1aa'
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const API = `https://${PROJEKT}.api.sanity.io/v2024-01-01/data/query/${DATASET}`

async function pytaj(q) {
  const r = await fetch(`${API}?query=${encodeURIComponent(q)}`)
  if (!r.ok) throw new Error(`Sanity HTTP ${r.status}`)
  return (await r.json()).result
}

// Twarde spacje wiąże kod przy renderowaniu (app/lib/typografia.ts), więc do
// pliku z treścią wpisujemy zwykłe odstępy.
const czysc = (s) => String(s ?? '').replace(/ /g, ' ')
const cytat = (s) => "'" + czysc(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'"

const [settings, uslugi, cennik, faqs, badges, voucher] = await Promise.all([
  pytaj(
    `*[_type=="siteSettings"][0]{promoText,galleryHeading,heroKicker,tagline,hours,contactNotes}`
  ),
  pytaj(
    `*[_type=="service"]|order(order asc){"slug":slug.current,excerpt,atuty,description}`
  ),
  pytaj(`*[_type=="pricelist"][0].groups[]{anchor,note,items[]{name,price,oldPrice,saving,gratis,note}}`),
  pytaj(`*[_type=="faqItem"]|order(order asc){question,answer}`),
  pytaj(`*[_type=="trustBadge"]|order(order asc){text}`),
  pytaj(`*[_type=="voucherPage"][0]{bullets,body}`),
])

let tekst = readFileSync(PLIK, 'utf8')
const zmiany = []

/** Podmienia pojedynczą wartość tekstową pola `nazwa:` w podanym zakresie pliku. */
function polePlaskie(nazwa, wartosc, od = 0, doo = tekst.length) {
  const zakres = tekst.slice(od, doo)
  // Wartość bywa w tej samej linii albo przeniesiona do następnej (prettier).
  const wzor = new RegExp(`(\\n\\s*${nazwa}:\\s*(?:\\n\\s*)?)'(?:[^'\\\\]|\\\\.)*'`)
  const m = zakres.match(wzor)
  if (!m) throw new Error(`Nie znalazłem pola ${nazwa}`)
  const stare = m[0].slice(m[1].length)
  const nowe = cytat(wartosc)
  if (stare === nowe) return
  tekst = tekst.slice(0, od) + zakres.replace(m[0], m[1] + nowe) + tekst.slice(doo)
  zmiany.push(nazwa)
}

/** Podmienia tablicę napisów pod polem `nazwa: [ ... ]`. */
function poleTablica(nazwa, wartosci, od = 0, doo = tekst.length) {
  const zakres = tekst.slice(od, doo)
  const wzor = new RegExp(`(\\n(\\s*)${nazwa}: \\[)[\\s\\S]*?\\n\\2\\]`)
  const m = zakres.match(wzor)
  if (!m) throw new Error(`Nie znalazłem tablicy ${nazwa}`)
  const wciecie = m[2] + '  '
  const srodek = wartosci.map((w) => `\n${wciecie}${cytat(w)},`).join('')
  const nowe = m[1] + srodek + `\n${m[2]}]`
  if (m[0] === nowe) return
  tekst = tekst.slice(0, od) + zakres.replace(m[0], nowe) + tekst.slice(doo)
  zmiany.push(nazwa)
}

/** Serializuje Portable Text do listy [styl, tekst, opcje] przyjmowanej przez blocks(). */
function wierszeBlokow(bloki, wciecie) {
  return (bloki || [])
    .map((b) => {
      const tekstBloku = (b.children || []).map((c) => c.text).join('')
      const marks = (b.children?.[0]?.marks || []).filter((m) => m === 'strong')
      const opcje = []
      if (b.listItem) opcje.push(`listItem: '${b.listItem}'`)
      if (marks.length) opcje.push(`marks: [${marks.map((m) => `'${m}'`).join(', ')}]`)
      const ogon = opcje.length ? `, { ${opcje.join(', ')} }` : ''
      return `\n${wciecie}['${b.style || 'normal'}',\n${wciecie}  ${cytat(tekstBloku)}${ogon}],`
    })
    .join('')
}

/** Podmienia zawartość wywołania `blocks('id', [ ... ])` w podanym zakresie. */
function blokiPortable(etykieta, id, bloki, od = 0, doo = tekst.length) {
  const zakres = tekst.slice(od, doo)
  const wzor = new RegExp(`(blocks\\('${id}', \\[)[\\s\\S]*?(\\n(\\s*)\\]\\))`)
  const m = zakres.match(wzor)
  if (!m) throw new Error(`Nie znalazłem bloków ${id}`)
  const wciecie = m[3] + '  '
  const nowe = m[1] + wierszeBlokow(bloki, wciecie) + m[2]
  if (m[0] === nowe) return
  tekst = tekst.slice(0, od) + zakres.replace(m[0], nowe) + tekst.slice(doo)
  zmiany.push(etykieta)
}

/** Podmienia tablicę `items: [ ... ]` w podanym zakresie (pozycja po pozycji). */
function pozycjeCennika(etykieta, pozycje, od, doo) {
  const zakres = tekst.slice(od, doo)
  const wzor = /(\n(\s*)items: \[)[\s\S]*?\n\2\]/
  const m = zakres.match(wzor)
  if (!m) throw new Error(`Nie znalazłem pozycji dla ${etykieta}`)
  const wciecie = m[2] + '  '
  const pola = ['name', 'price', 'oldPrice', 'saving', 'gratis', 'note']
  const srodek = pozycje
    .map((it) => {
      const czesci = pola
        .filter((p) => it[p])
        .map((p) => `${p}: ${cytat(it[p])}`)
        .join(', ')
      return `\n${wciecie}{ ${czesci} },`
    })
    .join('')
  const nowe = m[1] + srodek + `\n${m[2]}]`
  if (m[0] === nowe) return
  tekst = tekst.slice(0, od) + zakres.replace(m[0], nowe) + tekst.slice(doo)
  zmiany.push(etykieta)
}

// --- ustawienia ------------------------------------------------------------
const odUstawien = tekst.indexOf('export const settings = {')
const doUstawien = tekst.indexOf('export const treatments')
for (const pole of ['promoText', 'galleryHeading', 'heroKicker', 'tagline', 'hours']) {
  polePlaskie(pole, settings[pole], odUstawien, doUstawien)
}
poleTablica('contactNotes', settings.contactNotes || [], odUstawien, doUstawien)

// --- zabiegi ---------------------------------------------------------------
for (const u of uslugi) {
  const znacznik = `slug: '${u.slug}'`
  const od = tekst.indexOf(znacznik)
  if (od === -1) throw new Error(`Nie znalazłem zabiegu ${u.slug}`)
  // Koniec sekcji zabiegu: początek następnego slug-a albo koniec tablicy.
  const nastepny = tekst.indexOf("slug: '", od + znacznik.length)
  const doo = nastepny === -1 ? tekst.indexOf('export const pricelist') : nastepny
  polePlaskie('excerpt', u.excerpt, od, doo)
  poleTablica('atuty', u.atuty || [], od, doo)
}

// --- pełne opisy zabiegów --------------------------------------------------
// Bloki stoją w pliku wyżej niż tablica `treatments`, jako osobne stałe.
const OPISY = { 'depilacja-laserowa': 'laser', 'pielegnacja-twarzy': 'twarz' }
for (const u of uslugi) {
  const id = OPISY[u.slug]
  if (!id) continue
  blokiPortable(`opis ${u.slug}`, id, u.description)
}

// --- cennik: opisy grup i pozycje ------------------------------------------
for (const g of cennik) {
  const znacznik = `anchor: '${g.anchor}'`
  const od = tekst.indexOf(znacznik)
  if (od === -1) throw new Error(`Nie znalazłem grupy ${g.anchor}`)
  const doPozycji = tekst.indexOf('items: [', od)
  if (g.note) {
    try {
      polePlaskie('note', g.note, od, doPozycji)
    } catch {
      // Grupa „Dodatki” nie miała dotąd opisu — dopisujemy go po kotwicy.
      const linia = tekst.slice(0, od).lastIndexOf('\n')
      const wciecie = tekst.slice(linia + 1, od).match(/^\s*/)[0]
      tekst =
        tekst.slice(0, od + znacznik.length + 1) +
        `\n${wciecie}note: ${cytat(g.note)},` +
        tekst.slice(od + znacznik.length + 1)
      zmiany.push(`note (${g.anchor}, dopisane)`)
    }
  }
  // Koniec grupy: kotwica następnej albo koniec cennika.
  const odSwiezy = tekst.indexOf(znacznik)
  const nastepna = tekst.indexOf("anchor: '", odSwiezy + znacznik.length)
  const doo = nastepna === -1 ? tekst.indexOf('export const faqs') : nastepna
  pozycjeCennika(`cennik ${g.anchor}`, g.items || [], odSwiezy, doo)
}

// --- vouchery --------------------------------------------------------------
const odVouchera = tekst.indexOf('export const voucher = {')
const doVouchera = tekst.indexOf('export const terms')
poleTablica('bullets', voucher?.bullets || [], odVouchera, doVouchera)
blokiPortable('voucher.body', 'voucher', voucher?.body, odVouchera, doVouchera)

/** Podmienia cały blok `export const NAZWA = [ ... ]`. */
function blokTablicy(nazwa, tresc) {
  const wzor = new RegExp(`export const ${nazwa} = \\[[\\s\\S]*?\\n\\]`)
  if (!wzor.test(tekst)) throw new Error(`Nie znalazłem bloku ${nazwa}`)
  const nowy = `export const ${nazwa} = [${tresc}\n]`
  const stary = tekst.match(wzor)[0]
  if (stary === nowy) return
  tekst = tekst.replace(wzor, nowy)
  zmiany.push(nazwa)
}

blokTablicy(
  'faqs',
  faqs
    .map(
      (f) => `\n  {\n    question: ${cytat(f.question)},\n    answer:\n      ${cytat(f.answer)},\n  },`
    )
    .join('')
)

blokTablicy(
  'badges',
  badges.map((b, i) => `\n  { text: ${cytat(b.text)}, order: ${i + 1} },`).join('')
)

if (zmiany.length === 0) {
  console.log('Nic do zrobienia, plik już zgadza się z panelem.')
  process.exit(0)
}

if (DRY) {
  console.log('PRÓBA (nic nie zapisuję). Zmienione pola:')
  zmiany.forEach((z) => console.log('  •', z))
  process.exit(0)
}

writeFileSync(PLIK, tekst, 'utf8')
console.log(`Zapisano ${PLIK}. Zmienione pola:`)
zmiany.forEach((z) => console.log('  •', z))
console.log('\nSprawdź teraz: npm run check:seed')
