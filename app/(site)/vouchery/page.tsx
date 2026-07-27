import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { sanityFetch } from '@/sanity/lib/fetch'
import { VOUCHER_QUERY, SETTINGS_QUERY } from '@/sanity/lib/queries'
import type { Voucher, Settings } from '@/app/lib/types'
import { fallbackVoucher, fallbackSettings, STOCK } from '@/app/lib/fallback'
import { imgUrl } from '@/app/lib/img'
import PhoneCta from '@/app/components/PhoneCta'

/* eslint-disable @next/next/no-img-element */

export const metadata = {
  title: 'Vouchery — ZJAWISKOWO Krzeszowice',
  description:
    'Vouchery podarunkowe do salonu ZJAWISKOWO w Krzeszowicach: na konkretny zabieg albo na wybraną kwotę.',
}

export default async function VoucheryPage() {
  let v: Voucher | null = null
  let settings: Settings | null = null
  try {
    ;[v, settings] = await Promise.all([
      sanityFetch<Voucher>(VOUCHER_QUERY),
      sanityFetch<Settings>(SETTINGS_QUERY),
    ])
  } catch {
    v = null
    settings = null
  }
  const voucher = v && (v.lead || v.body) ? v : fallbackVoucher
  const s: Settings = { ...fallbackSettings, ...(settings || {}) }
  const hasBody = Array.isArray(voucher.body) && voucher.body.length > 0

  return (
    <>
      <section className="sec reveal">
        <div className="wrap">
          <div className="page-head">
            <p className="kicker">{voucher.kicker || 'Prezent'}</p>
            <h1 className="h2">{voucher.heading || 'Vouchery podarunkowe'}</h1>
            {voucher.lead && (
              <p className="lead" style={{ maxWidth: 660 }}>
                {voucher.lead}
              </p>
            )}
          </div>
          <div className="voucher-grid">
            <div className="voucher-media">
              <div className="ph">
                <img
                  src={imgUrl(voucher.image, STOCK.voucher)}
                  alt={voucher.heading || 'Voucher'}
                />
              </div>
            </div>
            <div className="voucher-body">
              {voucher.bullets && voucher.bullets.length > 0 && (
                <div className="voucher-card">
                  <ul className="atuty">
                    {voucher.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                  <Link href="/kontakt" className="btn btn-cta">
                    {voucher.ctaLabel || 'Zapytaj o voucher'}
                  </Link>
                </div>
              )}
              {hasBody && (
                <div className="svc-desc">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  <PortableText value={voucher.body as any} />
                </div>
              )}
              <div className="pillar-links">
                <Link href="/cennik" className="btn btn-ghost">
                  Zobacz cennik
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PhoneCta
        phone={s.phone || ''}
        heading="Zamów voucher telefonicznie"
        lead="Ustalimy kwotę albo zabieg, a voucher przygotuję do odbioru w salonie."
      />
    </>
  )
}
