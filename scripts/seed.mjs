// Wypełnia panel Sanity przykładową treścią z sanity/seed/content.mjs.
//
//   npm run seed            — zapisuje treść (nadpisuje dokumenty o tych samych ID)
//   npm run seed -- --dry   — tylko wypisuje, co zostałoby zapisane
//
// Token zapisu czytany jest z .env.local (SANITY_API_WRITE_TOKEN) i nigdy nie
// trafia do repozytorium. Zdjęcia zostają placeholderami — klientka wgra własne.

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import * as c from '../sanity/seed/content.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')

function readEnv() {
  const env = {}
  try {
    const raw = readFileSync(resolve(root, '.env.local'), 'utf8')
    for (const line of raw.split(/\r?\n/)) {
      if (!line.includes('=') || line.trim().startsWith('#')) continue
      const i = line.indexOf('=')
      env[line.slice(0, i).trim()] = line.slice(i + 1).trim()
    }
  } catch {
    /* brak .env.local — zmienne mogą pochodzić ze środowiska */
  }
  return { ...env, ...process.env }
}

const env = readEnv()
const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'kleyi1aa'
const dataset = env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-10-01'
const token = env.SANITY_API_WRITE_TOKEN
const dryRun = process.argv.includes('--dry')

/** Dokument singleton bez pola undefined (Sanity odrzuca undefined). */
function clean(obj) {
  const out = {}
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined) out[k] = v
  }
  return out
}

const documents = []

documents.push(
  clean({
    _id: 'siteSettings',
    _type: 'siteSettings',
    ...c.settings,
  })
)

documents.push(
  clean({
    _id: 'aboutPage',
    _type: 'aboutPage',
    ...c.about,
  })
)

documents.push(
  clean({
    _id: 'pricelist',
    _type: 'pricelist',
    ...c.pricelist,
    groups: (c.pricelist.groups || []).map((g, i) => ({
      _key: `group-${i}`,
      _type: 'group',
      ...g,
      items: (g.items || []).map((it, j) => ({
        _key: `group-${i}-item-${j}`,
        _type: 'item',
        ...it,
      })),
    })),
  })
)

documents.push(clean({ _id: 'voucherPage', _type: 'voucherPage', ...c.voucher }))
documents.push(clean({ _id: 'termsPage', _type: 'termsPage', ...c.terms }))

// Zabiegi zachowują dotychczasowe ID dokumentów, żeby nie zostawiać sierot
// po wcześniejszym seedzie (slugi zmieniły się na depilacja-laserowa / pielegnacja-twarzy).
const serviceIds = ['service-laser', 'service-twarz']
c.treatments.forEach((t, i) => {
  documents.push(
    clean({
      _id: serviceIds[i] || `service-${t.slug}`,
      _type: 'service',
      ...t,
      slug: { _type: 'slug', current: t.slug },
    })
  )
})

c.faqs.forEach((f, i) => {
  documents.push(
    clean({ _id: `faq-${i + 1}`, _type: 'faqItem', ...f, order: i })
  )
})

c.badges.forEach((b, i) => {
  documents.push(
    clean({ _id: `badge-${i + 1}`, _type: 'trustBadge', ...b, order: b.order ?? i })
  )
})

c.reviews.forEach((r, i) => {
  documents.push(
    clean({
      _id: `review-${i + 1}`,
      _type: 'review',
      hidden: false,
      ...r,
      order: r.order ?? i,
    })
  )
})

if (dryRun) {
  for (const d of documents) {
    const size = JSON.stringify(d).length
    console.log(`${d._id.padEnd(16)} ${d._type.padEnd(14)} ${size} B`)
  }
  console.log(`\n${documents.length} dokumentów (próba, nic nie zapisano).`)
  process.exit(0)
}

if (!token) {
  console.error(
    'Brak SANITY_API_WRITE_TOKEN w .env.local — bez niego nie da się zapisać treści.'
  )
  process.exit(1)
}

// Zabezpieczenie przed skasowaniem pracy klientki.
//
// Ten skrypt używa createOrReplace, więc na zapełnionym zbiorze danych nadpisuje
// każdy dokument o tym samym identyfikatorze. Poprawki klientki wchodzą skryptami
// migracji prosto do panelu, a nie przez ten plik, więc jedno bezmyślne
// uruchomienie cofa je wszystkie naraz i nie zostawia po tym śladu.
//
// Dlatego: na pustym zbiorze działa jak dotąd, na zapełnionym wymaga świadomej
// zgody. Zanim ją dasz, uruchom `npm run check:seed` — pokaże, co zostanie cofnięte.
const ileJuzJest = await fetch(
  `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${encodeURIComponent(
    'count(*[!(_id in path("drafts.**"))])'
  )}`
)
  .then((r) => r.json())
  .then((d) => d.result ?? 0)
  .catch(() => 0)

if (ileJuzJest > 0 && !process.argv.includes('--nadpisz')) {
  console.error(
    `\nZbiór ${projectId}/${dataset} ma już ${ileJuzJest} dokumentów, a ten skrypt je NADPISZE.\n\n` +
      'Treść w panelu jest źródłem prawdy: poprawki klientki wchodzą tam skryptami\n' +
      'migracji, nie przez ten plik. Zasianie od nowa cofnie je wszystkie.\n\n' +
      'Co zrobić:\n' +
      '  npm run check:seed                  — pokaże, co się rozjechało z panelem\n' +
      '  node scripts/synchronizuj-seed.mjs  — przeniesie treść z panelu do repozytorium\n' +
      '  npm run seed -- --dry               — wypisze, co zostałoby zapisane\n\n' +
      'Jeśli naprawdę chcesz nadpisać panel treścią z repozytorium:\n' +
      '  npm run seed -- --nadpisz\n'
  )
  process.exit(1)
}

const mutations = documents.map((doc) => ({ createOrReplace: doc }))

const res = await fetch(
  `https://${projectId}.api.sanity.io/v${apiVersion}/data/mutate/${dataset}`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ mutations }),
  }
)

const body = await res.json()
if (!res.ok) {
  console.error('Zapis nie powiódł się:', JSON.stringify(body, null, 2))
  process.exit(1)
}

console.log(`Zapisano ${documents.length} dokumentów do ${projectId}/${dataset}.`)
console.log(documents.map((d) => `  ${d._id}`).join('\n'))
