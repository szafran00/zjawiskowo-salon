import Link from 'next/link'
import { sanityFetch } from '@/sanity/lib/fetch'
import { HOME_QUERY, PRICELIST_QUERY } from '@/sanity/lib/queries'
import type { HomeData, Pricelist, Settings, Voucher } from '@/app/lib/types'
import {
  STOCK,
  fallbackSettings,
  fallbackTreatments,
  fallbackFaqs,
  fallbackVoucher,
  fallbackBadges,
  fallbackReviews,
  fallbackPricelist,
} from '@/app/lib/fallback'
import { imgUrl } from '@/app/lib/img'
import { embedUrl } from '@/app/lib/video'
import Hero from '@/app/components/Hero'
import Faq from '@/app/components/Faq'
import PhoneCta from '@/app/components/PhoneCta'
import ReviewsCarousel from '@/app/components/ReviewsCarousel'
import WhySection from '@/app/components/WhySection'

/* eslint-disable @next/next/no-img-element */

export default async function HomePage() {
  let data: HomeData = {}
  let price: Pricelist | null = null
  try {
    ;[data, price] = await Promise.all([
      sanityFetch<HomeData>(HOME_QUERY),
      sanityFetch<Pricelist>(PRICELIST_QUERY),
    ])
  } catch {
    data = {}
    price = null
  }

  const s: Settings = { ...fallbackSettings, ...(data.settings || {}) }
  const treatments =
    data.treatments && data.treatments.length ? data.treatments : fallbackTreatments
  const featuredList = treatments.filter((t) => t.featured)
  const featured = featuredList.length ? featuredList : treatments.slice(0, 2)
  const faqs = data.faqs && data.faqs.length ? data.faqs : fallbackFaqs
  const gallery = data.gallery && data.gallery.length ? data.gallery : []
  const voucher: Voucher = data.voucher || fallbackVoucher
  const badges = data.badges && data.badges.length ? data.badges : fallbackBadges
  const reviews = data.reviews && data.reviews.length ? data.reviews : fallbackReviews
  const pl = price && price.groups && price.groups.length ? price : fallbackPricelist
  const priceGroups = (pl.groups || []).filter((g) => g.anchor)

  const galleryImages = gallery.length
    ? gallery.map((g, i) => ({
        src: imgUrl(g.image, STOCK.gal[i % STOCK.gal.length], 900),
        cap: g.caption,
        video: embedUrl(g.videoUrl),
      }))
    : STOCK.gal.slice(0, 6).map((src) => ({
        src,
        cap: undefined as string | undefined,
        video: undefined as string | undefined,
      }))

  return (
    <>
      <Hero s={s} featured={featured} />

      {/* „Dlaczego ZJAWISKOWO” — punkty wyróżniające, edytowalne w panelu. */}
      {s.showTrust !== false && (
        <WhySection
          id="dlaczego"
          kicker={s.trustKicker}
          heading={s.trustHeading}
          items={badges.map((b) => b.text || '').filter(Boolean)}
        />
      )}

      {/* Dwa filary salonu: depilacja laserowa i pielęgnacja twarzy. */}
      <section className="sec reveal" id="zabiegi">
        <div className="wrap">
          <div className="faq-head" style={{ marginBottom: 0 }}>
            <p className="kicker">{s.pillarsKicker}</p>
            <h2 className="h2">{s.pillarsHeading}</h2>
            {s.pillarsLead && (
              <p className="lead" style={{ maxWidth: 640 }}>
                {s.pillarsLead}
              </p>
            )}
          </div>
          <div className="pillar-teasers">
            {featured.map((t, i) => (
              <div className="teaser" key={t.slug || i}>
                <div className="ph">
                  <img
                    src={imgUrl(t.image, i === 0 ? STOCK.laserWide : STOCK.face, 1200)}
                    alt={t.title || ''}
                  />
                </div>
                <div className="teaser-body">
                  <h3 className="h3">{t.title}</h3>
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

      {/* Cennik w skrócie: karty grup prowadzą prosto w odpowiednią sekcję cennika. */}
      {priceGroups.length > 0 && (
        <section className="pricing sec reveal">
          <div className="wrap">
            <div className="faq-head" style={{ marginBottom: 8 }}>
              <p className="kicker">Cennik w skrócie</p>
              <h2 className="h2">Ceny i pakiety</h2>
              {pl.intro && (
                <p className="lead" style={{ maxWidth: 660 }}>
                  {pl.intro}
                </p>
              )}
            </div>
            <div className="pkg-grid" style={{ marginTop: 36 }}>
              {priceGroups.map((g, i) => (
                <div className="pkg" key={g.anchor || i}>
                  <h3 className="pkg-name">{g.title}</h3>
                  {g.note && <p className="pkg-note">{g.note}</p>}
                  <Link href={`/cennik#${g.anchor}`} className="pkg-link">
                    Zobacz ceny →
                  </Link>
                </div>
              ))}
            </div>
            <div
              className="btn-row"
              style={{ justifyContent: 'center', marginTop: 36 }}
            >
              <Link href="/cennik" className="btn btn-cta">
                Zobacz pełny cennik
              </Link>
            </div>
          </div>
        </section>
      )}

      {voucher.showOnHome !== false && (
        <section className="vouchers reveal" id="vouchery">
          <div className="wrap sec">
            <div className="vouch-grid">
              <div className="vouch-body">
                <p className="kicker">{voucher.kicker}</p>
                <h2 className="h2">{voucher.heading}</h2>
                {voucher.lead && <p className="lead">{voucher.lead}</p>}
                <div className="btn-row">
                  <Link href="/vouchery" className="btn btn-cta">
                    {voucher.ctaLabel || 'Zapytaj o voucher'}
                  </Link>
                  <Link href="/cennik" className="btn btn-ghost">
                    Zobacz cennik
                  </Link>
                </div>
              </div>
              <div className="ph">
                <img
                  src={imgUrl(voucher.image, STOCK.voucher)}
                  alt={voucher.heading || 'Vouchery'}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {s.showReviews !== false && (
        <ReviewsCarousel
          reviews={reviews}
          kicker={s.reviewsKicker}
          heading={s.reviewsHeading}
          googleReviewUrl={s.googleReviewUrl}
        />
      )}

      {s.showFaq !== false && <Faq faqs={faqs} />}

      {s.showGallery !== false && (
        <section className="sec reveal" id="galeria">
          <div className="wrap">
            <div className="faq-head">
              <p className="kicker">{s.galleryKicker}</p>
              <h2 className="h2">{s.galleryHeading}</h2>
            </div>
            <div className="gal">
              {galleryImages.map((g, i) =>
                g.video ? (
                  <div className="ph gal-video" key={i}>
                    <iframe
                      src={g.video}
                      title={g.cap || `Film ${i + 1}`}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="ph" key={i}>
                    <img src={g.src} alt={g.cap || ''} />
                  </div>
                )
              )}
            </div>
          </div>
        </section>
      )}

      <PhoneCta
        phone={s.phone || ''}
        kicker="Rezerwacja tylko telefoniczna"
        heading={s.ctaHeading || 'Umów wizytę'}
        lead={s.ctaLead}
        hint="Nie odbieram, gdy trwa zabieg. Oddzwonię, gdy tylko skończę."
      />
    </>
  )
}
