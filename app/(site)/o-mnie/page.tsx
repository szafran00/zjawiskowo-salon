import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { sanityFetch } from '@/sanity/lib/fetch'
import { ABOUT_QUERY } from '@/sanity/lib/queries'
import type { About } from '@/app/lib/types'
import { fallbackAbout, fallbackAboutBody, STOCK } from '@/app/lib/fallback'
import { imgUrl } from '@/app/lib/img'

/* eslint-disable @next/next/no-img-element */

export const metadata = {
  title: 'O mnie — ZJAWISKOWO Krzeszowice',
  description:
    'Salon ZJAWISKOWO w Krzeszowicach prowadzi jedna osoba: od konsultacji przez całą serię zabiegów jesteś w tych samych rękach.',
}

export default async function AboutPage() {
  let about: About | null = null
  try {
    about = await sanityFetch<About>(ABOUT_QUERY)
  } catch {
    about = null
  }
  const a = about && (about.lead || about.body) ? about : fallbackAbout
  const img = imgUrl(a.image, STOCK.about)
  const hasBody = Array.isArray(a.body) && a.body.length > 0

  return (
    <section className="sec reveal">
      <div className="wrap">
        <div className="page-head">
          <p className="kicker">{a.kicker || 'Salon'}</p>
          <h1 className="h2">{a.heading || 'O mnie'}</h1>
        </div>
        <div className="about-grid">
          <div className="about-media">
            <div className="ph">
              <img src={img} alt="Salon ZJAWISKOWO" />
            </div>
          </div>
          <div className="about-body">
            {a.lead && <p className="lead">{a.lead}</p>}
            {a.atuty && a.atuty.length > 0 && (
              <ul className="atuty">
                {a.atuty.map((x, i) => (
                  <li key={i}>{x}</li>
                ))}
              </ul>
            )}
            <div className="svc-desc">
              {hasBody ? (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                <PortableText value={a.body as any} />
              ) : (
                <p>{fallbackAboutBody}</p>
              )}
            </div>
            <div className="pillar-links">
              <Link href="/zabiegi" className="btn btn-cta">
                Zobacz zabiegi
              </Link>
              <Link href="/kontakt" className="btn btn-ghost">
                Kontakt
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
