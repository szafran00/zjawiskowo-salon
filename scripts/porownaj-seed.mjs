// Porównuje treść w sanity/seed/content.mjs z tym, co naprawdę stoi w panelu.
//
//   npm run check:seed
//
// PO CO TO JEST. Plik content.mjs pełni dwie role naraz: zasila `npm run seed`
// i służy jako treść zastępcza, gdy pobranie danych z Sanity zawiedzie
// (app/lib/fallback.ts). Poprawki klientki wchodzą jednak skryptami migracji
// prosto do panelu, więc plik w repozytorium powoli się rozjeżdża z rzeczywistością.
//
// Rozjazd ma dwa skutki, oba ciche:
//   * przy awarii Sanity strona pokazuje starą treść, o której nikt nie pamięta,
//   * `npm run seed` używa createOrReplace, więc jedno uruchomienie cofa
//     wszystkie uwagi klientki naraz.
//
// Ten skrypt nie naprawia niczego. Ma tylko głośno powiedzieć, co się rozjechało.
// Kończy się kodem 1, jeśli są różnice, żeby dało się go wpiąć w kontrolę przed wydaniem.
import * as seed from '../sanity/seed/content.mjs'

const PROJEKT = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'kleyi1aa'
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const API = `https://${PROJEKT}.api.sanity.io/v2024-01-01/data/query/${DATASET}`

async function pytaj(q) {
  const r = await fetch(`${API}?query=${encodeURIComponent(q)}`)
  if (!r.ok) throw new Error(`Sanity HTTP ${r.status}`)
  return (await r.json()).result
}

// Twarde spacje wiąże kod przy renderowaniu, a nie treść, więc różnica w samym
// rodzaju odstępu nie jest rozjazdem.
const norm = (v) => (typeof v === 'string' ? v.replace(/ /g, ' ').trim() : v)

const roznice = []
const porownaj = (etykieta, wSeedzie, wPanelu) => {
  if (norm(wSeedzie) !== norm(wPanelu)) {
    roznice.push({ etykieta, seed: norm(wSeedzie), panel: norm(wPanelu) })
  }
}

const [settings, uslugi, cennik, faqs, badges, voucher] = await Promise.all([
  pytaj(
    `*[_type=="siteSettings"][0]{promoText,galleryHeading,heroKicker,tagline,hours,contactNotes}`
  ),
  pytaj(
    `*[_type=="service"]|order(order asc){"slug":slug.current,title,excerpt,atuty,description}`
  ),
  pytaj(`*[_type=="pricelist"][0].groups[]{anchor,title,note,items[]{name,price,oldPrice,saving,gratis,note}}`),
  pytaj(`*[_type=="faqItem"]|order(order asc){question,answer}`),
  pytaj(`*[_type=="trustBadge"]|order(order asc){text}`),
  pytaj(`*[_type=="voucherPage"][0]{bullets,body}`),
])

// Portable Text sprowadzamy do jednej linii „styl|znaczniki|tekst" — porównanie
// ma wychwycić zmianę treści i układu, a nie różnicę w kluczach bloków.
const plasko = (bloki) =>
  (bloki || [])
    .map((b) => {
      const marks = (b.children?.[0]?.marks || []).filter((m) => m === 'strong')
      const rodzaj = b.listItem ? `•${b.style || 'normal'}` : b.style || 'normal'
      const zn = marks.length ? `[${marks.join(',')}]` : ''
      return `${rodzaj}${zn}|${norm((b.children || []).map((c) => c.text).join(''))}`
    })
    .join('\n')

const pozycjeTekstem = (items) =>
  (items || [])
    .map((it) =>
      [it.name, it.price, it.oldPrice, it.saving, it.gratis, it.note]
        .map((v) => norm(v) ?? '')
        .join(' | ')
    )
    .join('\n')

for (const pole of ['promoText', 'galleryHeading', 'heroKicker', 'tagline', 'hours']) {
  porownaj(`settings.${pole}`, seed.settings?.[pole], settings?.[pole])
}
porownaj(
  'settings.contactNotes',
  (seed.settings?.contactNotes || []).join(' | '),
  (settings?.contactNotes || []).join(' | ')
)

for (const u of uslugi || []) {
  const s = (seed.treatments || []).find((x) => x.slug === u.slug)
  if (!s) {
    roznice.push({ etykieta: `service ${u.slug}`, seed: '(brak w seedzie)', panel: u.title })
    continue
  }
  porownaj(`service ${u.slug}.excerpt`, s.excerpt, u.excerpt)
  porownaj(`service ${u.slug}.atuty`, (s.atuty || []).join(' | '), (u.atuty || []).join(' | '))
  porownaj(`service ${u.slug}.description`, plasko(s.description), plasko(u.description))
}

for (const g of cennik || []) {
  const s = (seed.pricelist?.groups || []).find((x) => x.anchor === g.anchor)
  porownaj(`cennik ${g.anchor}.note`, s?.note ?? '', g.note ?? '')
  porownaj(`cennik ${g.anchor}.items`, pozycjeTekstem(s?.items), pozycjeTekstem(g.items))
}

porownaj(
  'voucher.bullets',
  (seed.voucher?.bullets || []).join(' | '),
  (voucher?.bullets || []).join(' | ')
)
porownaj('voucher.body', plasko(seed.voucher?.body), plasko(voucher?.body))

// FAQ porównujemy najpierw jako listę pytań w kolejności (bo kolejność jest
// wymogiem klientki), a dopiero potem odpowiedź przy każdym wspólnym pytaniu.
const pytaniaSeed = (seed.faqs || []).map((f) => norm(f.question))
const pytaniaPanel = (faqs || []).map((f) => norm(f.question))
if (pytaniaSeed.join(' | ') !== pytaniaPanel.join(' | ')) {
  roznice.push({
    etykieta: `FAQ: lista pytań (${pytaniaSeed.length} w seedzie, ${pytaniaPanel.length} w panelu)`,
    seed: pytaniaSeed.join(' | '),
    panel: pytaniaPanel.join(' | '),
  })
}
for (const f of faqs || []) {
  const s = (seed.faqs || []).find((x) => norm(x.question) === norm(f.question))
  if (s) porownaj(`FAQ „${norm(f.question).slice(0, 40)}…".answer`, s.answer, f.answer)
}

const bS = (seed.badges || []).map((b) => norm(b.text)).join(' | ')
const bP = (badges || []).map((b) => norm(b.text)).join(' | ')
if (bS !== bP) roznice.push({ etykieta: 'punkty „Dlaczego ZJAWISKOWO"', seed: bS, panel: bP })

if (roznice.length === 0) {
  console.log('Seed zgadza się z panelem. Nic do zrobienia.')
  process.exit(0)
}

console.log(`ROZJAZD: ${roznice.length} różnic między sanity/seed/content.mjs a panelem.\n`)
for (const r of roznice) {
  console.log(`— ${r.etykieta}`)
  console.log(`   seed:  ${String(r.seed).slice(0, 200)}`)
  console.log(`   panel: ${String(r.panel).slice(0, 200)}\n`)
}
console.log('Panel jest źródłem prawdy. Przenieś te wartości do sanity/seed/content.mjs,')
console.log('inaczej `npm run seed` cofnie je jednym uruchomieniem (createOrReplace).')
process.exit(1)
