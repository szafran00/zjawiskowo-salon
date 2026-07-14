// Gruntowne testy strony ZJAWISKOWO: integralność Sanity + trasy HTTP + spójność.
// Uruchom lokalnie przy działającym serwerze: `npm run start` (lub `npm run dev`) w innym oknie, potem `npm test`.
const BASE = process.env.BASE_URL || 'http://localhost:3000'
const PROJECT = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'kleyi1aa'
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const APIV = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-10-01'
const SANITY = `https://${PROJECT}.api.sanity.io/v${APIV}/data/query/${DATASET}`

let pass = 0
let fail = 0
const fails = []
const ok = (n) => { pass++; console.log(`  PASS  ${n}`) }
const no = (n, d) => { fail++; fails.push(n); console.log(`  FAIL  ${n}${d ? ` — ${d}` : ''}`) }
const check = (n, cond, d) => (cond ? ok(n) : no(n, d))

async function sanityQuery(q) {
  const res = await fetch(`${SANITY}?query=${encodeURIComponent(q)}`)
  if (!res.ok) throw new Error(`Sanity HTTP ${res.status}`)
  return (await res.json()).result
}
async function getHtml(path) {
  const res = await fetch(BASE + path, { redirect: 'manual' })
  return { status: res.status, text: await res.text() }
}

async function main() {
  console.log('\n=== 1. Sanity: integralność danych ===')
  const settings = await sanityQuery(`*[_type=="siteSettings"][0]{salonName,tagline,phone,promoText,showPromo}`)
  check('siteSettings istnieje', !!settings)
  check('settings.salonName', !!settings?.salonName)
  check('settings.tagline', !!settings?.tagline)
  check('settings.phone', !!settings?.phone)

  const services = await sanityQuery(`*[_type=="service"]|order(order asc){title,"slug":slug.current,atuty}`)
  check('>=2 zabiegi', Array.isArray(services) && services.length >= 2, `jest ${services?.length}`)
  check('kazdy zabieg ma slug', services.every((s) => !!s.slug), JSON.stringify(services.map((s) => s.slug)))
  check('kazdy zabieg ma tytul', services.every((s) => !!s.title))
  check('kazdy zabieg ma atuty', services.every((s) => Array.isArray(s.atuty) && s.atuty.length > 0))

  const pricelist = await sanityQuery(`*[_type=="pricelist"][0]{groups[]{title,"items":items[].name}}`)
  check('cennik istnieje z grupami', !!pricelist && Array.isArray(pricelist.groups) && pricelist.groups.length > 0)
  const allPriceItems = (pricelist?.groups || []).flatMap((g) => g.items || []).filter(Boolean)
  check('cennik ma pozycje', allPriceItems.length > 0, `${allPriceItems.length} pozycji`)

  const counts = await sanityQuery(`{"badges":count(*[_type=="trustBadge"]),"reviews":count(*[_type=="review"]),"faqs":count(*[_type=="faqItem"]),"about":count(*[_type=="aboutPage"])}`)
  check('>=1 odznaka zaufania', counts.badges >= 1)
  check('>=1 opinia', counts.reviews >= 1)
  check('>=1 FAQ', counts.faqs >= 1)
  check('aboutPage istnieje', counts.about >= 1)

  console.log('\n=== 2. HTTP: trasy zwracaja 200 ===')
  const routes = ['/', '/o-salonie', '/zabiegi', '/cennik', '/kontakt', '/studio', ...services.map((s) => `/zabiegi/${s.slug}`)]
  const html = {}
  for (const r of routes) {
    const { status, text } = await getHtml(r)
    check(`GET ${r} -> 200`, status === 200, `status ${status}`)
    html[r] = text || ''
  }

  console.log('\n=== 3. HTTP: 404 dla nieistniejacego zabiegu ===')
  const bad = await getHtml('/zabiegi/nie-istnieje-xyz')
  check('GET /zabiegi/nie-istnieje-xyz -> 404', bad.status === 404, `status ${bad.status}`)

  console.log('\n=== 4. Tresc stron ===')
  const home = html['/'] || ''
  check('home: haslo hero z Sanity', settings.tagline ? home.includes(settings.tagline) : false)
  for (const label of ['Strona główna', 'O salonie', 'Zabiegi', 'Cennik', 'Kontakt']) {
    check(`nav zawiera "${label}"`, home.includes(`>${label}<`))
  }
  const navMatch = home.match(/<nav[\s\S]*?<\/nav>/)
  check('nav NIE ma osobnej zakladki "Depilacja laserowa"', !!navMatch && !navMatch[0].includes('Depilacja laserowa'))
  check('/o-salonie: naglowek', (html['/o-salonie'] || '').includes('O salonie'))
  check('/kontakt: telefon', (html['/kontakt'] || '').includes(settings.phone))
  check('/kontakt: naglowek', (html['/kontakt'] || '').includes('Odwiedź nas'))
  check('/cennik: naglowek', (html['/cennik'] || '').includes('Cennik'))

  console.log('\n=== 5. Spojnosc Sanity <-> strona ===')
  if (settings.showPromo && settings.promoText) {
    check('home pokazuje promoText z Sanity', home.includes(settings.promoText), settings.promoText)
  }
  for (const s of services) {
    check(`/zabiegi pokazuje zabieg "${s.title}"`, (html['/zabiegi'] || '').includes(s.title))
    check(`/zabiegi/${s.slug} pokazuje tytul`, (html[`/zabiegi/${s.slug}`] || '').includes(s.title))
  }
  for (const name of allPriceItems) {
    check(`/cennik pokazuje pozycje "${name}"`, (html['/cennik'] || '').includes(name))
  }

  console.log(`\n=== WYNIK: ${pass} PASS, ${fail} FAIL ===`)
  if (fail > 0) {
    console.log('Nieudane: ' + fails.join(' | '))
    process.exit(1)
  }
}
main().catch((e) => { console.error('BLAD testow:', e.message); process.exit(2) })
