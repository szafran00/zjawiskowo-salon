import Link from 'next/link'
import { sanityFetch } from '@/sanity/lib/fetch'
import { PRICELIST_QUERY } from '@/sanity/lib/queries'
import type { Pricelist } from '@/app/lib/types'
import { fallbackPricelist } from '@/app/lib/fallback'

export const revalidate = 60

export const metadata = {
  title: 'Cennik — ZJAWISKOWO Krzeszowice',
}

export default async function CennikPage() {
  let p: Pricelist | null = null
  try {
    p = await sanityFetch<Pricelist>(PRICELIST_QUERY)
  } catch {
    p = null
  }
  const pl = p && p.groups && p.groups.length ? p : fallbackPricelist

  return (
    <section className="sec reveal">
      <div className="wrap">
        <div className="page-head">
          <p className="kicker">Cennik</p>
          <h1 className="h2">Cennik usług</h1>
          {pl.intro && (
            <p className="lead" style={{ maxWidth: 640, margin: '4px auto 0' }}>
              {pl.intro}
            </p>
          )}
        </div>
        <div className="cennik">
          {pl.groups?.map((g, i) => (
            <div className="cennik-group" key={i}>
              <h3 className="cennik-group-title">{g.title}</h3>
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
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <Link href="/kontakt" className="btn btn-cta">
            Umów wizytę
          </Link>
        </div>
      </div>
    </section>
  )
}
