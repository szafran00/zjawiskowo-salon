// Zrzut treści z panelu do pliku JSON — narzędzie robocze do oglądania stanu
// przed wprowadzaniem uwag klientki. Nic nie zapisuje do Sanity.
//
// Uruchomienie: node scripts/zrzut-tresci.mjs [typ]
import fs from 'node:fs'

const env = fs.readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
const token = env.match(/SANITY_API_WRITE_TOKEN=(.+)/)?.[1].trim()
if (!token) throw new Error('Brak SANITY_API_WRITE_TOKEN w .env.local')

const BAZA = 'https://kleyi1aa.api.sanity.io/v2024-01-01/data'

const q = process.argv[2] || '*[!(_id in path("drafts.**"))]'
const r = await fetch(`${BAZA}/query/production?query=${encodeURIComponent(q)}`, {
  headers: { Authorization: `Bearer ${token}` },
})
const d = await r.json()
if (!r.ok) throw new Error(JSON.stringify(d))
console.log(JSON.stringify(d.result, null, 2))
