import Link from 'next/link'
import { sanityFetch } from '@/sanity/lib/fetch'
import { HOME_QUERY } from '@/sanity/lib/queries'
import type { HomeData, Settings } from '@/app/lib/types'
import {
  STOCK,
  fallbackSettings,
  fallbackTreatments,
  fallbackBadges,
  fallbackReviews,
  fallbackFaqs,
} from '@/app/lib/fallback'
import { imgUrl } from '@/app/lib/img'
import Hero from '@/app/components/Hero'
import Faq from '@/app/components/Faq'

/* eslint-disable @next/next/no-img-element */


export default async function HomePage() {
  let data: HomeData = {}
  try {
    data = await sanityFetch<HomeData>(HOME_QUERY)
  } catch {
    data = {}
  }

  const s: Settings = { ...fallbackSettings, ...(data.settings || {}) }
  const treatments =
    data.treatments && data.treatments.length ? data.treatments : fallbackTreatments
  const featuredList = treatments.filter((t) => t.featured)
  const featured = featuredList.length ? featuredList : treatments.slice(0, 2)
  const badges = data.badges && data.badges.length ? data.badges : fallbackBadges
  const reviews = data.reviews && data.reviews.length ? data.reviews : fallbackReviews
  const faqs = data.faqs && data.faqs.length ? data.faqs : fallbackFaqs
  const gallery = data.gallery && data.gallery.length ? data.gallery : []
  const tel = 'tel:' + (s.phone || '').replace(/\s/g, '')

  const galleryImages = gallery.length
    ? gallery.map((g, i) => ({
        src: imgUrl(g.image, STOCK.gal[i % STOCK.gal.length], 900),
        cap: g.caption,
      }))
    : STOCK.gal.map((src) => ({ src, cap: undefined as string | undefined }))

  return (
    <>
      <Hero s={s} featured={featured} />

      <section className="trust reveal">
        <div className="wrap sec" style={{ paddingTop: 56, paddingBottom: 56 }}>
          <div className="trust-grid">
            {badges.map((b, i) => (
              <div className="badge" key={i}>
                <div className="crest">✦</div>
                <p>{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec reveal" id="zabiegi">
        <div className="wrap">
          <div className="page-head">
            <p className="kicker">Nasza oferta</p>
            <h2 className="h2">Zabiegi</h2>
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
          <div style={{ textAlign: 'center', marginTop: 36 }}>
            <Link href="/zabiegi" className="btn btn-ghost">
              Zobacz wszystkie zabiegi
            </Link>
          </div>
        </div>
      </section>

      <section className="reviews reveal" id="opinie">
        <div className="wrap sec">
          <div className="rev-head">
            <p className="kicker">Opinie klientek</p>
            <h2 className="h2">Co mówią o nas kobiety</h2>
          </div>
          <div className="rev-grid">
            {reviews.map((r, i) => (
              <div className="rev" key={i}>
                <div className="stars">{'★'.repeat(r.rating || 5)}</div>
                <p className="rev-q">{r.quote}</p>
                <p className="rev-name">{r.author}</p>
              </div>
            ))}
          </div>
          <div className="google-note">
            <span>★</span>
            <span>Opinie pochodzą z wizytówki Google</span>
          </div>
        </div>
      </section>

      <Faq faqs={faqs} />

      <section className="sec reveal">
        <div className="wrap">
          <div className="page-head">
            <p className="kicker">Galeria</p>
            <h2 className="h2">Efekty i wnętrze salonu</h2>
          </div>
          <div className="gal">
            {galleryImages.map((g, i) => (
              <div className="ph" key={i}>
                <img src={g.src} alt={g.cap || ''} />
              </div>
            ))}
            <div className="video">
              <div className="ph">
                <span>filmik 9:16 (pionowy) · krótkie wideo z zabiegu, do 30 s</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-band reveal">
        <div className="wrap">
          <h2 className="h2">Umów wizytę w ZJAWISKOWO</h2>
          <p className="lead" style={{ maxWidth: 560, margin: '12px auto 24px' }}>
            Zadzwoń lub napisz, dobierzemy zabieg i termin dopasowany do Ciebie.
          </p>
          <div className="cta-actions">
            <a href={tel} className="btn btn-cta">{`Zadzwoń: ${s.phone}`}</a>
            <Link href="/kontakt" className="btn btn-ghost">
              Formularz kontaktowy
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
