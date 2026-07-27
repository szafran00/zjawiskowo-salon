import Link from 'next/link'
import { sanityFetch } from '@/sanity/lib/fetch'
import { HOME_QUERY } from '@/sanity/lib/queries'
import type { HomeData, Settings, Voucher } from '@/app/lib/types'
import {
  STOCK,
  fallbackSettings,
  fallbackTreatments,
  fallbackFaqs,
  fallbackVoucher,
} from '@/app/lib/fallback'
import { imgUrl } from '@/app/lib/img'
import Hero from '@/app/components/Hero'
import Faq from '@/app/components/Faq'
import PhoneCta from '@/app/components/PhoneCta'

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
  const faqs = data.faqs && data.faqs.length ? data.faqs : fallbackFaqs
  const gallery = data.gallery && data.gallery.length ? data.gallery : []
  const voucher: Voucher = data.voucher || fallbackVoucher

  const galleryImages = gallery.length
    ? gallery.map((g, i) => ({
        src: imgUrl(g.image, STOCK.gal[i % STOCK.gal.length], 900),
        cap: g.caption,
      }))
    : STOCK.gal.map((src) => ({ src, cap: undefined as string | undefined }))

  return (
    <>
      <Hero s={s} featured={featured} />

      {/* Dwa filary salonu: depilacja laserowa i pielęgnacja twarzy. */}
      <section className="sec reveal" id="zabiegi">
        <div className="wrap">
          <div className="page-head">
            <p className="kicker">{s.pillarsKicker}</p>
            <h2 className="h2">{s.pillarsHeading}</h2>
            {s.pillarsLead && (
              <p className="lead" style={{ maxWidth: 640 }}>
                {s.pillarsLead}
              </p>
            )}
          </div>
          <div className="pillars">
            {featured.map((t, i) => {
              const img = imgUrl(
                t.image,
                i === 0 ? STOCK.laserWide : STOCK.face,
                1200
              )
              return (
                <div className={`svc ${i % 2 ? 'rev-order' : ''}`} key={t.slug || i}>
                  <div className="svc-media">
                    <div className="ph">
                      <img src={img} alt={t.title || ''} />
                    </div>
                  </div>
                  <div className="svc-body">
                    <p className="kicker">{t.kicker}</p>
                    <h3 className="h2" style={{ fontSize: 'clamp(26px,3vw,36px)' }}>
                      {t.title}
                    </h3>
                    {t.excerpt && <p className="lead">{t.excerpt}</p>}
                    {t.atuty && t.atuty.length > 0 && (
                      <ul className="atuty pillar-atuty">
                        {t.atuty.slice(0, 5).map((a, j) => (
                          <li key={j}>{a}</li>
                        ))}
                      </ul>
                    )}
                    <div className="pillar-links">
                      <Link href={`/zabiegi/${t.slug}`} className="btn btn-cta">
                        Poznaj zabieg
                      </Link>
                      {t.pricelistAnchor && (
                        <Link
                          href={`/cennik#${t.pricelistAnchor}`}
                          className="btn btn-ghost"
                        >
                          Zobacz ceny
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {voucher.showOnHome !== false && (
        <section className="voucher reveal" id="vouchery">
          <div className="wrap sec">
            <div className="voucher-grid">
              <div className="voucher-media">
                <div className="ph">
                  <img
                    src={imgUrl(voucher.image, STOCK.voucher)}
                    alt={voucher.heading || 'Vouchery'}
                  />
                </div>
              </div>
              <div className="voucher-body">
                <p className="kicker">{voucher.kicker}</p>
                <h2 className="h2">{voucher.heading}</h2>
                {voucher.lead && <p className="lead">{voucher.lead}</p>}
                {voucher.bullets && voucher.bullets.length > 0 && (
                  <ul className="atuty">
                    {voucher.bullets.slice(0, 4).map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                )}
                <div className="pillar-links">
                  <Link href="/vouchery" className="btn btn-cta">
                    {voucher.ctaLabel || 'Zapytaj o voucher'}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {s.showFaq !== false && <Faq faqs={faqs} />}

      {s.showGallery !== false && (
        <section className="sec reveal" id="galeria">
          <div className="wrap">
            <div className="page-head">
              <p className="kicker">{s.galleryKicker}</p>
              <h2 className="h2">{s.galleryHeading}</h2>
            </div>
            <div className="gal">
              {galleryImages.map((g, i) => (
                <div className="ph" key={i}>
                  <img src={g.src} alt={g.cap || ''} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <PhoneCta
        phone={s.phone || ''}
        heading={s.ctaHeading || 'Umów wizytę'}
        lead={s.ctaLead}
      />
    </>
  )
}
