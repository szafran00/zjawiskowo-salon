import Link from 'next/link'
import { sanityFetch } from '@/sanity/lib/fetch'
import { TREATMENTS_QUERY, SETTINGS_QUERY } from '@/sanity/lib/queries'
import type { Settings, Treatment } from '@/app/lib/types'
import { fallbackTreatments, fallbackSettings, STOCK } from '@/app/lib/fallback'
import { imgUrl } from '@/app/lib/img'
import PageHead from '@/app/components/PageHead'
import PhoneCta from '@/app/components/PhoneCta'

/* eslint-disable @next/next/no-img-element */

export const metadata = {
  title: 'Zabiegi — ZJAWISKOWO Krzeszowice',
  description:
    'Depilacja laserowa i pielęgnacja twarzy w kameralnym salonie ZJAWISKOWO w Krzeszowicach.',
}

export default async function ZabiegiPage() {
  let treatments: Treatment[] = []
  let settings: Settings | null = null
  try {
    ;[treatments, settings] = await Promise.all([
      sanityFetch<Treatment[]>(TREATMENTS_QUERY),
      sanityFetch<Settings>(SETTINGS_QUERY),
    ])
  } catch {
    treatments = []
    settings = null
  }
  if (!treatments || !treatments.length) treatments = fallbackTreatments
  const s: Settings = { ...fallbackSettings, ...(settings || {}) }

  return (
    <>
      <PageHead
        crumbs={[{ label: 'Strona główna', href: '/' }, { label: 'Zabiegi' }]}
        kicker={s.pillarsKicker || 'Oferta salonu'}
        title={s.treatmentsHeading || 'Moje zabiegi'}
        lead={s.pillarsLead}
      />

      <section className="sec reveal">
        <div className="wrap">
          <div className="svc-cards">
            {treatments.map((t, i) => (
              <div className="svc-card" key={t.slug || i}>
                <div className="ph">
                  <img
                    src={imgUrl(t.image, i === 0 ? STOCK.laserWide : STOCK.face, 1200)}
                    alt={t.title || ''}
                  />
                </div>
                <div className="svc-card-body">
                  <p className="kicker">{t.kicker}</p>
                  <h2 className="h3">{t.title}</h2>
                  {t.excerpt && <p>{t.excerpt}</p>}
                  <div className="btn-row">
                    <Link href={`/zabiegi/${t.slug}`} className="btn btn-cta">
                      Poznaj zabieg
                    </Link>
                    <Link
                      href={
                        t.pricelistAnchor ? `/cennik#${t.pricelistAnchor}` : '/cennik'
                      }
                      className="btn btn-ghost"
                    >
                      Zobacz ceny
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PhoneCta
        phone={s.phone || ''}
        kicker={s.treatmentsCtaKicker || 'Nie wiesz, co wybrać?'}
        heading={s.treatmentsCtaHeading || 'Zadzwoń — doradzę podczas konsultacji'}
        lead={s.ctaLead}
      />
    </>
  )
}
