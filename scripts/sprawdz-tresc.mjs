// Skan treści pod kątem „śmieci” (placeholderów, treści przykładowej, martwych
// linków) przed pokazaniem strony klientce i przed publikacją.
//
//   npm run check:tresc          # wymaga działającego serwera na :3000
//
// Kończy się kodem 1, gdy cokolwiek znajdzie, więc nadaje się na bramkę przed
// publikacją. Źródła: dokumenty w Sanity + wyrenderowane strony.
const BASE = process.env.BASE_URL || 'http://localhost:3000'
const PROJECT = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'kleyi1aa'
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const APIV = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-10-01'
const SANITY = `https://${PROJECT}.api.sanity.io/v${APIV}/data/query/${DATASET}`

const PATTERNS = [
  ['nawias kwadratowy (placeholder)', /\[[^\]]{2,120}\]/g],
  ['„do uzupełnienia”', /do uzupełnieni\w*/gi],
  ['„do potwierdzenia”', /do potwierdzeni\w*/gi],
  ['„do ustalenia”', /do ustaleni\w*/gi],
  ['„przykład/przykładow”', /przykładow\w*/gi],
  ['„roboczy/robocza”', /robocz\w*/gi],
  // Notatki adresowane do klientki („Do uzupełnienia przez Martę…") łapią już
  // reguły wyżej. Samo imię nie może być sygnałem: prawdziwe opinie z Google
  // wspominają „Panią Martę" kilkanaście razy i to jest treść docelowa.
  ['TODO/FIXME', /\b(TODO|FIXME|XXX)\b/g],
]

async function groq(q) {
  const r = await fetch(`${SANITY}?query=${encodeURIComponent(q)}`)
  if (!r.ok) throw new Error('Sanity HTTP ' + r.status)
  return (await r.json()).result
}

function walk(node, path, out) {
  if (typeof node === 'string') {
    for (const [name, re] of PATTERNS) {
      const m = node.match(re)
      if (m) out.push({ path, rule: name, hits: [...new Set(m)].slice(0, 4) })
    }
    return
  }
  if (Array.isArray(node)) return node.forEach((v, i) => walk(v, `${path}[${i}]`, out))
  if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      if (k.startsWith('_')) continue
      walk(v, path ? `${path}.${k}` : k, out)
    }
  }
}

const docs = await groq('*[!(_id in path("drafts.**"))]')
console.log(`\n=== SANITY: ${docs.length} dokumentów ===\n`)
const byDoc = {}
for (const d of docs) {
  const out = []
  walk(d, '', out)
  if (out.length) byDoc[`${d._type} / ${d._id}`] = out
}
for (const [doc, hits] of Object.entries(byDoc)) {
  console.log(`--- ${doc}`)
  for (const h of hits) console.log(`    ${h.path}  [${h.rule}]  ${JSON.stringify(h.hits)}`)
}
if (!Object.keys(byDoc).length) console.log('(czysto)')

// obrazki i pola puste
console.log('\n=== SANITY: braki obrazków i linków ===')
const imgless = await groq(`{
  "servicesBezZdjecia": *[_type=="service" && !defined(image)].title,
  "aboutBezZdjecia": count(*[_type=="aboutPage" && !defined(image)]),
  "voucherBezZdjecia": count(*[_type=="voucherPage" && !defined(image)]),
  "galeria": count(*[_type=="galleryItem"]),
  "opinie": count(*[_type=="review"]),
  "fb": *[_type=="siteSettings"][0].facebookUrl,
  "ig": *[_type=="siteSettings"][0].instagramUrl,
  "mapa": *[_type=="siteSettings"][0].googleMapsEmbedUrl,
  "formularz": *[_type=="siteSettings"][0].formEndpoint,
  "mail": *[_type=="siteSettings"][0].contactEmail,
  "linkOpinie": *[_type=="siteSettings"][0].googleReviewUrl,
  "promoWlaczona": *[_type=="siteSettings"][0].showPromo,
  "promoTresc": *[_type=="siteSettings"][0].promoText,
  "adres": *[_type=="siteSettings"][0].address,
  "godziny": *[_type=="siteSettings"][0].hours
}`)
console.log(JSON.stringify(imgless, null, 2))

// strony
const ROUTES = ['/', '/o-mnie', '/zabiegi', '/zabiegi/depilacja-laserowa',
  '/zabiegi/pielegnacja-twarzy', '/cennik', '/vouchery', '/regulamin',
  '/kontakt', '/polityka-prywatnosci']
console.log('\n=== STRONY: placeholdery w tekście widocznym ===')
let problemy = Object.keys(byDoc).length
let stockRazem = 0
let martweRazem = 0
for (const r of ROUTES) {
  const html = await (await fetch(BASE + r)).text()
  const text = html.replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ')
  const found = []
  for (const [name, re] of PATTERNS) {
    const m = text.match(re)
    if (m) found.push(`${name}: ${JSON.stringify([...new Set(m)].slice(0, 5))}`)
  }
  const stock = (html.match(/images\.pexels\.com/g) || []).length
  const deadLinks = (html.match(/href="#"/g) || []).length
  stockRazem += stock
  martweRazem += deadLinks
  problemy += found.length
  console.log(`--- ${r}  | zdjęcia stockowe: ${stock} | martwe linki href="#": ${deadLinks}`)
  found.forEach((f) => console.log('    ' + f))
}

console.log('\n=== PODSUMOWANIE ===')
console.log(`dokumenty z placeholderami: ${Object.keys(byDoc).length}`)
console.log(`odsłony zdjęć stockowych:   ${stockRazem}`)
console.log(`martwe linki href="#":      ${martweRazem}`)
const czysto = problemy === 0 && stockRazem === 0 && martweRazem === 0
console.log(czysto ? '\nCZYSTO — treść gotowa do publikacji.' : '\nSĄ RZECZY DO UZUPEŁNIENIA (szczegóły wyżej).')
if (!czysto) process.exit(1)
