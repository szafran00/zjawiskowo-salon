import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PortableText } from '@portabletext/react'
import { sanityFetch } from '@/sanity/lib/fetch'
import { TREATMENT_QUERY } from '@/sanity/lib/queries'
import type { Treatment } from '@/app/lib/types'
import { fallbackTreatments, STOCK } from '@/app/lib/fallback'
import { imgUrl } from '@/app/lib/img'

/* eslint-disable @next/next/no-img-element */

export default async function TreatmentPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  let t: Treatment | null = null
  try {
    t = await sanityFetch<Treatment>(TREATMENT_QUERY, { slug })
  } catch {
    t = null
  }
  if (!t) t = fallbackTreatments.find((x) => x.slug === slug) || null
  if (!t) notFound()

  const img = imgUrl(t.image, t.slug === 'twarz' ? STOCK.face : STOCK.laserWide)
  const hasBody = Array.isArray(t.description) && t.description.length > 0

  return (
    <section className="sec reveal">
      <div className="wrap">
        <div className="breadcrumb">
          <Link href="/zabiegi">← Wszystkie zabiegi</Link>
        </div>
        <div className="svc">
          <div className="svc-media">
            <div className="ph">
              <img src={img} alt={t.title || ''} />
            </div>
          </div>
          <div className="svc-body">
            <p className="kicker">{t.kicker}</p>
            <h1 className="h2">{t.title}</h1>
            {t.atuty && t.atuty.length > 0 && (
              <ul className="atuty">
                {t.atuty.map((a, j) => (
                  <li key={j}>{a}</li>
                ))}
              </ul>
            )}
            {hasBody && (
              <div className="svc-desc">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                <PortableText value={t.description as any} />
              </div>
            )}
            <div>
              <Link href="/kontakt" className="btn btn-cta">
                {t.ctaLabel || 'Umów wizytę'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
