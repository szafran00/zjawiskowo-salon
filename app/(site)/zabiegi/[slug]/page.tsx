import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PortableText } from '@portabletext/react'
import { sanityFetch } from '@/sanity/lib/fetch'
import { TREATMENT_QUERY, SETTINGS_QUERY } from '@/sanity/lib/queries'
import type { Treatment, Settings } from '@/app/lib/types'
import { fallbackTreatments, fallbackSettings, STOCK } from '@/app/lib/fallback'
import { imgUrl } from '@/app/lib/img'
import PageHead from '@/app/components/PageHead'
import PhoneCta from '@/app/components/PhoneCta'
import { pl, plBloki } from '@/app/lib/typografia'

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
  const priceHref = t.pricelistAnchor ? `/cennik#${t.pricelistAnchor}` : '/cennik'

  return (
    <>
      {/* Nadtytuł nazywa dział, nie zabieg: pole „Nadtytuł” w panelu bywa równe
          tytułowi, a powtórzona nazwa tuż nad H1 wygląda jak pomyłka. */}
      <PageHead
        crumbs={[
          { label: 'Strona główna', href: '/' },
          { label: 'Zabiegi', href: '/zabiegi' },
          { label: t.title || 'Zabieg' },
        ]}
        kicker="Zabiegi"
        title={t.title || 'Zabieg'}
        lead={t.excerpt}
      />

      <section className="sec reveal">
        <div className="wrap">
          <div className={`svc ${isFace ? '' : 'rev-order'}`}>
            <div className="svc-media">
              <div className="ph">
                <img src={img} alt={t.title || ''} />
              </div>
            </div>
            <div className="svc-body">
              <h2 className="h2">{t.introHeading || 'Na czym polega'}</h2>
              {t.atuty && t.atuty.length > 0 && (
                <ul className="atuty">
                  {t.atuty.map((a, j) => (
                    <li key={j}>{pl(a)}</li>
                  ))}
                </ul>
              )}
              <div className="btn-row">
                <a
                  href={'tel:' + (s.phone || '').replace(/\s/g, '')}
                  className="btn btn-cta"
                >
                  {t.ctaLabel || 'Umów wizytę'}: {s.phone}
                </a>
                <Link href={priceHref} className="btn btn-ghost">
                  Zobacz cennik
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {hasBody && (
        <section className="sec reveal" style={{ background: 'var(--bg2)' }}>
          <div className="wrap">
            <div className="faq-head">
              <p className="kicker">{t.detailsKicker || 'Szczegóły'}</p>
              <h2 className="h2">{t.detailsHeading || 'Więcej o zabiegu'}</h2>
            </div>
            <div className="prose" style={{ margin: '0 auto' }}>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <PortableText value={plBloki(t.description) as any} />
            </div>
          </div>
        </section>
      )}

      <PhoneCta
        phone={s.phone || ''}
        kicker={t.ctaKicker || 'Pierwszy krok jest bezpłatny'}
        heading={t.ctaHeading || 'Umów konsultację'}
        lead={s.ctaLead}
      />
    </>
  )
}
