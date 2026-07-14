import Link from 'next/link'
import { sanityFetch } from '@/sanity/lib/fetch'
import { TREATMENTS_QUERY } from '@/sanity/lib/queries'
import type { Treatment } from '@/app/lib/types'
import { fallbackTreatments, STOCK } from '@/app/lib/fallback'
import { imgUrl } from '@/app/lib/img'

/* eslint-disable @next/next/no-img-element */

export const revalidate = 60

export const metadata = {
  title: 'Zabiegi — ZJAWISKOWO Krzeszowice',
}

export default async function ZabiegiPage() {
  let treatments: Treatment[] = []
  try {
    treatments = await sanityFetch<Treatment[]>(TREATMENTS_QUERY)
  } catch {
    treatments = []
  }
  if (!treatments || !treatments.length) treatments = fallbackTreatments

  return (
    <section className="sec reveal">
      <div className="wrap">
        <div className="page-head">
          <p className="kicker">Nasza oferta</p>
          <h1 className="h2">Zabiegi</h1>
          <p className="lead" style={{ maxWidth: 640, margin: '4px auto 0' }}>
            Depilacja laserowa i kosmetyka twarzy w kameralnym salonie w Krzeszowicach.
          </p>
        </div>
        <div className="zabieg-grid">
          {treatments.map((t, i) => {
            const img = imgUrl(t.image, t.slug === 'twarz' ? STOCK.face : STOCK.laserWide, 900)
            return (
              <Link href={`/zabiegi/${t.slug}`} className="zabieg-card" key={i}>
                <div className="ph">
                  <img src={img} alt={t.title || ''} />
                </div>
                <div className="zabieg-card-body">
                  <p className="kicker">{t.kicker}</p>
                  <h3 className="zabieg-card-title">{t.title}</h3>
                  {t.excerpt && <p className="zabieg-card-ex">{t.excerpt}</p>}
                  <span className="zabieg-more">Dowiedz się więcej →</span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
