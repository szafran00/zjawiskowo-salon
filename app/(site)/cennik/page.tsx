import Link from 'next/link'
import { sanityFetch } from '@/sanity/lib/fetch'
import { PRICELIST_QUERY, SETTINGS_QUERY } from '@/sanity/lib/queries'
import type { Pricelist, Settings } from '@/app/lib/types'
import { fallbackPricelist, fallbackSettings } from '@/app/lib/fallback'
import PhoneCta from '@/app/components/PhoneCta'

export const metadata = {
  title: 'Cennik — ZJAWISKOWO Krzeszowice',
  description:
    'Cennik depilacji laserowej i pielęgnacji twarzy w salonie ZJAWISKOWO w Krzeszowicach, wraz z pakietami.',
}

export default async function CennikPage() {
  let p: Pricelist | null = null
  let settings: Settings | null = null
  try {
    ;[p, settings] = await Promise.all([
      sanityFetch<Pricelist>(PRICELIST_QUERY),
      sanityFetch<Settings>(SETTINGS_QUERY),
    ])
  } catch {
    p = null
    settings = null
  }
  const pl = p && p.groups && p.groups.length ? p : fallbackPricelist
  const s: Settings = { ...fallbackSettings, ...(settings || {}) }
  const groups = pl.groups || []

  return (
    <>
      <section className="sec reveal">
        <div className="wrap">
          <div className="page-head">
            <p className="kicker">Cennik</p>
            <h1 className="h2">Cennik usług</h1>
            {pl.intro && (
              <p className="lead" style={{ maxWidth: 660, margin: '4px auto 0' }}>
                {pl.intro}
              </p>
            )}
          </div>

          {groups.length > 1 && (
            <nav className="cennik-nav" aria-label="Skróty do sekcji cennika">
              {groups
                .filter((g) => g.anchor)
                .map((g, i) => (
                  <a className="chip" href={`#${g.anchor}`} key={i}>
                    <b></b>
                    {g.title}
                  </a>
                ))}
            </nav>
          )}

          <div className="cennik">
            {groups.map((g, i) => (
              <div className="cennik-group" id={g.anchor || undefined} key={i}>
                <h2 className="cennik-group-title">{g.title}</h2>
                {g.note && <p className="cennik-group-note">{g.note}</p>}
                <div className="cennik-list">
                  {g.items?.map((it, j) => (
                    <div className="cennik-row" key={j}>
                      <span className="cennik-name">
                        {it.name}
                        {it.note && <em className="cennik-note"> · {it.note}</em>}
                      </span>
                      <span className="cennik-dots" />
                      <span className="cennik-price">{it.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {pl.outro && <p className="cennik-outro">{pl.outro}</p>}

          <div style={{ textAlign: 'center', marginTop: 36 }}>
            <Link href="/vouchery" className="btn btn-ghost">
              Vouchery podarunkowe
            </Link>
          </div>
        </div>
      </section>

      <PhoneCta
        phone={s.phone || ''}
        heading={s.ctaHeading || 'Umów wizytę'}
        lead={s.ctaLead}
      />
    </>
  )
}
