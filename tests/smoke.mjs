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
// Widoczny tekst strony, bez znaczników i bez danych serializowanych przez React.
// Bez tego asercje na treść przechodzą także wtedy, gdy fraza siedzi wyłącznie
// w payloadzie w <script>, a na stronie nie widać jej wcale.
function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
}

// Porownanie tekstu bez rozrozniania rodzaju spacji.
//
// Strona wiaze jednoliterowe slowa i separatory twarda spacja przy renderowaniu
// (app/lib/typografia.ts), wiec HTML rozni sie od wartosci w panelu o same
// U+00A0. Asercja ma sprawdzic, czy tresc z panelu jest widoczna na stronie,
// a nie czy zgadza sie bajt w bajt, bo to drugie kazaloby wpisywac niewidoczne
// znaki do pol edycyjnych.
const bezNbsp = (s) => (s || '').replace(/\u00a0/g, ' ')

async function getHtml(path) {
  const res = await fetch(BASE + path, { redirect: 'manual' })
  return { status: res.status, text: await res.text(), location: res.headers.get('location') }
}

async function main() {
  console.log('\n=== 1. Sanity: integralność danych ===')
  const settings = await sanityQuery(
    `*[_type=="siteSettings"][0]{salonName,salonSubtitle,heroKicker,tagline,phone,promoText,showPromo,address,hours,contactNotes,googleMapsEmbedUrl}`
  )
  check('siteSettings istnieje', !!settings)
  check('settings.salonName', !!settings?.salonName)
  check('settings.tagline', !!settings?.tagline)
  check('settings.phone', !!settings?.phone)
  check('settings.address', !!settings?.address)
  check('settings.hours', !!settings?.hours)
  check('settings.contactNotes (udogodnienia)', Array.isArray(settings?.contactNotes) && settings.contactNotes.length > 0)
  check('settings.googleMapsEmbedUrl', !!settings?.googleMapsEmbedUrl)

  const services = await sanityQuery(
    `*[_type=="service"]|order(order asc){title,navLabel,"slug":slug.current,atuty,pricelistAnchor,"desc":count(description)}`
  )
  check('>=2 zabiegi', Array.isArray(services) && services.length >= 2, `jest ${services?.length}`)
  check('kazdy zabieg ma slug', services.every((s) => !!s.slug), JSON.stringify(services.map((s) => s.slug)))
  check('kazdy zabieg ma tytul', services.every((s) => !!s.title))
  check('kazdy zabieg ma nazwe w menu', services.every((s) => !!s.navLabel))
  check('kazdy zabieg ma atuty', services.every((s) => Array.isArray(s.atuty) && s.atuty.length > 0))
  check('kazdy zabieg ma pelny opis', services.every((s) => s.desc > 0))
  check('kazdy zabieg wskazuje sekcje cennika', services.every((s) => !!s.pricelistAnchor))

  const pricelist = await sanityQuery(
    `*[_type=="pricelist"][0]{groups[]{title,anchor,showInMenu,"items":items[].name},outro}`
  )
  check('cennik istnieje z grupami', !!pricelist && Array.isArray(pricelist.groups) && pricelist.groups.length > 0)
  const groups = pricelist?.groups || []
  check('kazda grupa cennika ma identyfikator sekcji', groups.every((g) => !!g.anchor), JSON.stringify(groups.map((g) => g.anchor)))
  const menuGroups = groups.filter((g) => g.showInMenu !== false)
  check('menu "Cennik" ma dokladnie 2 pozycje', menuGroups.length === 2, `jest ${menuGroups.length}`)
  const allPriceItems = groups.flatMap((g) => g.items || []).filter(Boolean)
  check('cennik ma pozycje', allPriceItems.length > 0, `${allPriceItems.length} pozycji`)
  check('cennik ma note pod tabela', !!pricelist?.outro)

  const counts = await sanityQuery(
    `{"faqs":count(*[_type=="faqItem"]),"about":count(*[_type=="aboutPage"]),"voucher":count(*[_type=="voucherPage"]),"terms":count(*[_type=="termsPage"])}`
  )
  check('>=1 FAQ', counts.faqs >= 1)
  check('aboutPage istnieje', counts.about >= 1)
  check('voucherPage istnieje', counts.voucher >= 1)
  check('termsPage istnieje', counts.terms >= 1)

  console.log('\n=== 2. HTTP: trasy zwracaja 200 ===')
  const routes = [
    '/', '/o-mnie', '/zabiegi', '/cennik', '/vouchery', '/regulamin',
    '/kontakt', '/polityka-prywatnosci', '/studio',
    ...services.map((s) => `/zabiegi/${s.slug}`),
  ]
  const html = {}
  for (const r of routes) {
    const { status, text } = await getHtml(r)
    check(`GET ${r} -> 200`, status === 200, `status ${status}`)
    html[r] = text || ''
  }

  console.log('\n=== 3. HTTP: przekierowania i 404 ===')
  const old = await getHtml('/o-salonie')
  check('GET /o-salonie -> przekierowanie na /o-mnie', old.status === 308 && (old.location || '').endsWith('/o-mnie'), `status ${old.status}, location ${old.location}`)
  const bad = await getHtml('/zabiegi/nie-istnieje-xyz')
  check('GET /zabiegi/nie-istnieje-xyz -> 404', bad.status === 404, `status ${bad.status}`)

  console.log('\n=== 4. Menu i tresc stron ===')
  const home = html['/'] || ''
  check('home: haslo hero z Sanity', settings.tagline ? home.includes(settings.tagline) : false)

  // Wymog klientki: "depilacja laserowa" widoczna na pierwszy rzut oka, obok "salon kosmetyczny".
  const headMatch = home.match(/<header[\s\S]*?<\/header>/)
  const head = headMatch ? headMatch[0] : ''
  const hasBoth = (s) => /depilacj/i.test(s) && /salon kosmetyczn/i.test(s)
  check('home: podpis pod logo ma depilacje laserowa i salon kosmetyczny', hasBoth(head))
  check('home: nadtytul hero ma depilacje laserowa', settings.heroKicker ? /depilacj/i.test(settings.heroKicker) && bezNbsp(home).includes(bezNbsp(settings.heroKicker)) : false)
  check('home: tytul strony ma depilacje laserowa', /<title>[^<]*depilacj/i.test(home))

  const navMatch = home.match(/<nav[\s\S]*?<\/nav>/)
  const nav = navMatch ? navMatch[0] : ''
  for (const label of ['O mnie', 'Zabiegi', 'Cennik', 'Vouchery', 'Regulamin', 'Kontakt']) {
    check(`nav zawiera "${label}"`, nav.includes(label))
  }
  check('nav NIE ma juz zakladki "Strona główna"', !nav.includes('Strona główna'))
  check('nav NIE ma juz zakladki "O salonie"', !nav.includes('O salonie'))
  check('nav: Kontakt jest ostatni', nav.lastIndexOf('Kontakt') > nav.lastIndexOf('Regulamin'))
  for (const s of services) {
    check(`rozwijane menu "Zabiegi" ma "${s.navLabel}"`, nav.includes(`/zabiegi/${s.slug}`))
  }
  for (const g of menuGroups) {
    check(`rozwijane menu "Cennik" ma "${g.title}"`, nav.includes(`/cennik#${g.anchor}`))
  }

  check('/o-mnie: naglowek', (html['/o-mnie'] || '').includes('O mnie'))
  check('/kontakt: telefon', (html['/kontakt'] || '').includes(settings.phone))
  check('/kontakt: adres z Sanity', (html['/kontakt'] || '').includes(settings.address))
  for (const n of settings.contactNotes || []) {
    check(`/kontakt pokazuje udogodnienie "${n}"`, (html['/kontakt'] || '').includes(n))
  }
  check('/kontakt: mapa za zgoda (bez iframe przed zgoda)', !(html['/kontakt'] || '').includes('<iframe'))
  check('/cennik: naglowek', (html['/cennik'] || '').includes('Cennik'))
  check('/vouchery: naglowek', (html['/vouchery'] || '').includes('Vouchery'))
  check('/regulamin: naglowek', (html['/regulamin'] || '').includes('Regulamin'))
  check('/regulamin: odnosnik do polityki prywatnosci', (html['/regulamin'] || '').includes('/polityka-prywatnosci'))

  console.log('\n=== 5. Pelny zakres z oferty ===')
  // Selektory zgodne z redesignem 2026-07-28 (design/2026-07-28/styles.css):
  // karuzela .carousel > .rev-card + .dots > .dot, wyróżniki .why-grid > .why-card.
  check('home: karuzela opinii', home.includes('class="carousel"'))
  check('home: opinie przesuwaja sie pojedynczo', (home.match(/class="rev-card/g) || []).length >= 2)
  check('home: kropki nawigacji karuzeli', home.includes('class="dots"') && /class="dot[ "]/.test(home))
  check('home: nota o opiniach z wizytowki Google', home.includes('wizytówki Google'))
  check('home: sekcja Dlaczego ZJAWISKOWO', home.includes('why-grid') && /Dlaczego ZJAWISKOWO/i.test(home))
  check('home: sekcja voucherow', home.includes('id="vouchery"'))
  check('home: sekcja FAQ', home.includes('faq'))
  check('home: galeria', home.includes('class="gal"'))
  check('home: bezplatna konsultacja jako zachet', /bezpłatn/i.test(visibleText(home)))

  const reviewsLive = await sanityQuery(`count(*[_type=="review" && hidden != true])`)
  check('Sanity: sa opinie do pokazania', typeof reviewsLive === 'number' && reviewsLive > 0, `${reviewsLive}`)
  const badgesLive = await sanityQuery(`count(*[_type=="trustBadge"])`)
  check('Sanity: sa punkty Dlaczego ZJAWISKOWO', typeof badgesLive === 'number' && badgesLive > 0, `${badgesLive}`)
  const hideable = await sanityQuery(`count(*[_type=="review" && defined(hidden)])`)
  check('Sanity: opinie maja przelacznik ukrywania', typeof hideable === 'number' && hideable > 0, `${hideable}`)

  console.log('\n=== 6. Spojnosc Sanity <-> strona ===')
  if (settings.showPromo && settings.promoText) {
    // Pasek wyroznia kwoty i procenty osobnym znacznikiem (prosba klientki
    // z 6.08), wiec w surowym HTML tresc z panelu nie jest juz ciagla.
    // Porownujemy widoczny tekst, po sprowadzeniu odstepow do jednej spacji.
    const odstepy = (s) => bezNbsp(s).replace(/\s+/g, ' ').trim()
    check(
      'home pokazuje promoText z Sanity',
      odstepy(visibleText(home)).includes(odstepy(settings.promoText)),
      settings.promoText
    )
  }
  check('home: duzy przycisk telefonu', home.includes('btn-phone') && home.includes(settings.phone))
  for (const s of services) {
    check(`/zabiegi pokazuje zabieg "${s.title}"`, (html['/zabiegi'] || '').includes(s.title))
    check(`/zabiegi/${s.slug} pokazuje tytul`, (html[`/zabiegi/${s.slug}`] || '').includes(s.title))
  }
  for (const g of groups) {
    check(`/cennik ma sekcje "${g.anchor}"`, (html['/cennik'] || '').includes(`id="${g.anchor}"`))
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
