import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { sanityFetch } from '@/sanity/lib/fetch'
import { VOUCHER_QUERY, SETTINGS_QUERY } from '@/sanity/lib/queries'
import type { Voucher, Settings } from '@/app/lib/types'
import { fallbackVoucher, fallbackSettings, STOCK } from '@/app/lib/fallback'
import { imgUrl } from '@/app/lib/img'
import PageHead from '@/app/components/PageHead'
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
  const tel = 'tel:' + (s.phone || '').replace(/\s/g, '')

  return (
    <>
      <PageHead
        crumbs={[{ label: 'Strona główna', href: '/' }, { label: 'Vouchery' }]}
        kicker={voucher.kicker || 'Vouchery'}
        title={voucher.heading || 'Vouchery podarunkowe'}
        lead={voucher.lead}
      />

      <section className="sec reveal">
        <div className="wrap">
          <div className="vouch-grid">
            <div className="vouch-body">
              <p className="kicker">Jak to działa</p>
              <h2 className="h2">Prezent, który sprawia radość</h2>
              {voucher.bullets && voucher.bullets.length > 0 && (
                <ul className="atuty">
                  {voucher.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              )}
              <div className="btn-row">
                <a href={tel} className="btn btn-cta">
                  {voucher.ctaLabel || 'Zapytaj o voucher'}: {s.phone}
                </a>
                <Link href="/cennik" className="btn btn-ghost">
                  Zobacz cennik
                </Link>
              </div>
            </div>
            <div className="ph">
              <img
                src={imgUrl(voucher.image, STOCK.voucher)}
                alt={voucher.heading || 'Voucher'}
              />
            </div>
          </div>
        </div>
      </section>

      {hasBody && (
        <section className="sec reveal" style={{ background: 'var(--bg2)' }}>
          <div className="wrap">
            <div className="faq-head">
              <p className="kicker">Warunki</p>
              <h2 className="h2">Dobrze wiedzieć</h2>
            </div>
            <div className="prose" style={{ margin: '0 auto' }}>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <PortableText value={voucher.body as any} />
            </div>
          </div>
        </section>
      )}

      <PhoneCta
        phone={s.phone || ''}
        kicker="Zamów voucher"
        heading="Zadzwoń, przygotuję go dla Ciebie"
        lead="Ustalimy kwotę albo zabieg, a voucher przygotuję do odbioru w salonie."
      />
    </>
  )
}
