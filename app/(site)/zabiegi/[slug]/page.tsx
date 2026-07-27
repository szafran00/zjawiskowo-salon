import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PortableText } from '@portabletext/react'
import { sanityFetch } from '@/sanity/lib/fetch'
import { TREATMENT_QUERY, SETTINGS_QUERY } from '@/sanity/lib/queries'
import type { Treatment, Settings } from '@/app/lib/types'
import { fallbackTreatments, fallbackSettings, STOCK } from '@/app/lib/fallback'
import { imgUrl } from '@/app/lib/img'
import PhoneCta from '@/app/components/PhoneCta'

/* eslint-disable @next/next/no-img-element */

export async function generateMetadata({
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
  if (!t) return { title: 'Zabieg — ZJAWISKOWO Krzeszowice' }
  return {
    title: `${t.title} — ZJAWISKOWO Krzeszowice`,
    description: t.excerpt,
  }
}

// Bez generateStaticParams: treść pobieramy z cache: 'no-store', żeby zmiana
// opublikowana w panelu była widoczna od razu, więc trasa i tak jest dynamiczna.

export default async function TreatmentPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  let t: Treatment | null = null
  let settings: Settings | null = null
  try {
    ;[t, settings] = await Promise.all([
      sanityFetch<Treatment>(TREATMENT_QUERY, { slug }),
      sanityFetch<Settings>(SETTINGS_QUERY),
    ])
  } catch {
    t = null
    settings = null
  }
  if (!t) t = fallbackTreatments.find((x) => x.slug === slug) || null
  if (!t) notFound()

  const s: Settings = { ...fallbackSettings, ...(settings || {}) }
  const isFace = (t.slug || '').includes('twarz')
  const img = imgUrl(t.image, isFace ? STOCK.face : STOCK.laserWide)
  const hasBody = Array.isArray(t.description) && t.description.length > 0

  return (
    <>
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
              {t.excerpt && <p className="lead">{t.excerpt}</p>}
              {t.atuty && t.atuty.length > 0 && (
                <ul className="atuty">
                  {t.atuty.map((a, j) => (
                    <li key={j}>{a}</li>
                  ))}
                </ul>
              )}
              <div className="pillar-links">
                <Link href="/kontakt" className="btn btn-cta">
                  {t.ctaLabel || 'Umów wizytę'}
                </Link>
                <Link
                  href={t.pricelistAnchor ? `/cennik#${t.pricelistAnchor}` : '/cennik'}
                  className="btn btn-ghost"
                >
                  Zobacz ceny
                </Link>
              </div>
            </div>
          </div>

          {hasBody && (
            <div className="svc-desc" style={{ maxWidth: 820, margin: '56px auto 0' }}>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <PortableText value={t.description as any} />
            </div>
          )}
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
