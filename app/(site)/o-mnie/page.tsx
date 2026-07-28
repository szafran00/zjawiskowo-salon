import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { sanityFetch } from '@/sanity/lib/fetch'
import { ABOUT_QUERY, SETTINGS_QUERY } from '@/sanity/lib/queries'
import type { About, Settings } from '@/app/lib/types'
import {
  fallbackAbout,
  fallbackAboutBody,
  fallbackSettings,
  STOCK,
} from '@/app/lib/fallback'
import { imgUrl } from '@/app/lib/img'
import PageHead from '@/app/components/PageHead'
import PhoneCta from '@/app/components/PhoneCta'
import WhySection from '@/app/components/WhySection'

/* eslint-disable @next/next/no-img-element */

export const metadata = {
  title: 'O mnie — ZJAWISKOWO Krzeszowice',
  description:
    'Salon ZJAWISKOWO w Krzeszowicach prowadzi jedna osoba: od konsultacji przez całą serię zabiegów jesteś w tych samych rękach.',
}

export default async function AboutPage() {
  let about: About | null = null
  let settings: Settings | null = null
  try {
    ;[about, settings] = await Promise.all([
      sanityFetch<About>(ABOUT_QUERY),
      sanityFetch<Settings>(SETTINGS_QUERY),
    ])
  } catch {
    about = null
    settings = null
  }
  const a = about && (about.lead || about.body) ? about : fallbackAbout
  const s: Settings = { ...fallbackSettings, ...(settings || {}) }
  const img = imgUrl(a.image, STOCK.about)
  const hasBody = Array.isArray(a.body) && a.body.length > 0

  return (
    <>
      <PageHead
        crumbs={[{ label: 'Strona główna', href: '/' }, { label: 'O mnie' }]}
        kicker={a.kicker || 'O mnie'}
        title={a.heading || 'O mnie'}
        lead={a.lead}
      />

      <section className="sec reveal">
        <div className="wrap">
          <div className="about-grid">
            <div className="about-media">
              <div className="ph">
                <img src={img} alt="Salon ZJAWISKOWO" />
              </div>
            </div>
            <div className="svc-body">
              <p className="kicker">Kilka słów</p>
              <h2 className="h2">{s.tagline}</h2>
              <div className="prose">
                {hasBody ? (
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  <PortableText value={a.body as any} />
                ) : (
                  <p>{fallbackAboutBody}</p>
                )}
              </div>
              <div className="btn-row">
                <a
                  href={'tel:' + (s.phone || '').replace(/\s/g, '')}
                  className="btn btn-cta"
                >
                  Umów wizytę: {s.phone}
                </a>
                <Link href="/zabiegi" className="btn btn-ghost">
                  Zobacz zabiegi
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bez nadtytułu: treść „O mnie” z panelu ma już własny śródtytuł
          „Jak pracuję”, a dwa takie same napisy obok siebie wyglądają na błąd. */}
      <WhySection heading="Co mnie wyróżnia" items={a.atuty || []} />

      <PhoneCta
        phone={s.phone || ''}
        kicker="Poznajmy się"
        heading="Zapraszam na bezpłatną konsultację"
        lead={s.ctaLead}
      />
    </>
  )
}
