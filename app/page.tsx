import { PortableText } from '@portabletext/react'
import { sanityFetch } from '@/sanity/lib/fetch'
import { HOME_QUERY } from '@/sanity/lib/queries'
import type { HomeData, Settings } from './lib/types'
import {
  STOCK,
  fallbackSettings,
  fallbackServices,
  fallbackBadges,
  fallbackReviews,
  fallbackFaqs,
} from './lib/fallback'
import { imgUrl } from './lib/img'
import Header from './components/Header'
import Hero from './components/Hero'
import Faq from './components/Faq'
import ContactForm from './components/ContactForm'
import RevealInit from './components/RevealInit'

/* eslint-disable @next/next/no-img-element */

export const revalidate = 60

export default async function Home() {
  let data: HomeData = {}
  try {
    data = await sanityFetch<HomeData>(HOME_QUERY)
  } catch {
    data = {}
  }

  const s: Settings = { ...fallbackSettings, ...(data.settings || {}) }
  const services =
    data.services && data.services.length ? data.services : fallbackServices
  const badges = data.badges && data.badges.length ? data.badges : fallbackBadges
  const reviews =
    data.reviews && data.reviews.length ? data.reviews : fallbackReviews
  const faqs = data.faqs && data.faqs.length ? data.faqs : fallbackFaqs
  const gallery = data.gallery && data.gallery.length ? data.gallery : []
  const theme = s.theme || 'gold'
  const tel = 'tel:' + (s.phone || '').replace(/\s/g, '')

  const galleryImages =
    gallery.length > 0
      ? gallery.map((g, i) => ({
          src: imgUrl(g.image, STOCK.gal[i % STOCK.gal.length], 900),
          cap: g.caption,
        }))
      : STOCK.gal.map((src) => ({ src, cap: undefined as string | undefined }))

  return (
    <div className={`shell theme-${theme}`}>
      <RevealInit />
      <Header phone={s.phone || ''} salonName={s.salonName || 'ZJAWISKOWO'} />

      {s.showPromo && s.promoText && (
        <div className="promo">
          <b>{s.promoText}</b>
        </div>
      )}

      <Hero s={s} />

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

      {services.map((svc, i) => {
        const imgSrc = imgUrl(
          svc.image,
          svc.anchor === 'twarz' ? STOCK.face : STOCK.laserWide
        )
        return (
          <section className="sec reveal" id={svc.anchor || undefined} key={i}>
            <div className="wrap">
              <div className={`svc ${svc.reverse ? 'rev-order' : ''}`}>
                <div className="svc-media">
                  <div className="ph">
                    <img src={imgSrc} alt={svc.title || ''} />
                  </div>
                </div>
                <div className="svc-body">
                  <p className="kicker">{svc.kicker}</p>
                  <h2 className="h2">{svc.title}</h2>
                  <ul className="atuty">
                    {(svc.atuty || []).map((a, j) => (
                      <li key={j}>{a}</li>
                    ))}
                  </ul>
                  {Array.isArray(svc.description) && svc.description.length > 0 && (
                    <div className="svc-desc">
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      <PortableText value={svc.description as any} />
                    </div>
                  )}
                  <div>
                    <a href={tel} className="btn btn-cta">
                      {svc.ctaLabel || 'Umów wizytę'}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )
      })}

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

      <section className="sec reveal" id="galeria">
        <div className="wrap">
          <div className="faq-head">
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
                <span>
                  filmik 9:16 (pionowy) — krótkie wideo z zabiegu / atmosfery, do
                  30 s
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="contact reveal" id="kontakt">
        <div className="wrap sec">
          <div
            className="faq-head"
            style={{ alignItems: 'flex-start', textAlign: 'left', marginBottom: 36 }}
          >
            <p className="kicker">Kontakt</p>
            <h2 className="h2">Odwiedź nas w Krzeszowicach</h2>
          </div>
          <div className="contact-grid">
            <div className="contact-info">
              <div className="info-row">
                <span className="lbl">Adres</span>
                <span className="val">{s.address}</span>
              </div>
              <div className="info-row">
                <span className="lbl">Telefon</span>
                <a className="val" href={tel}>
                  {s.phone}
                </a>
              </div>
              <div className="info-row">
                <span className="lbl">Godziny otwarcia</span>
                <span className="val">{s.hours}</span>
              </div>
              <div className="map">
                <div className="ph">
                  {s.googleMapsEmbedUrl ? (
                    <iframe
                      src={s.googleMapsEmbedUrl}
                      loading="lazy"
                      title="Mapa Google"
                    />
                  ) : (
                    <span>osadzona mapa Google — [do wklejenia]</span>
                  )}
                </div>
              </div>
              <div className="socials">
                <a
                  className="soc"
                  href={s.facebookUrl || '#'}
                  target="_blank"
                  rel="noopener"
                >
                  Facebook
                </a>
                <a
                  className="soc"
                  href={s.instagramUrl || '#'}
                  target="_blank"
                  rel="noopener"
                >
                  Instagram
                </a>
              </div>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="wrap footer-in">
          <div>
            <div className="logo">{s.salonName}</div>
            <p style={{ margin: '10px 0 0', fontSize: 13, opacity: 0.8 }}>
              Salon kosmetyczny · Krzeszowice
            </p>
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.9 }}>
            <a href={tel} style={{ textDecoration: 'none' }}>
              {s.phone}
            </a>
            <br />
            <a href={`https://${s.domain}`} style={{ textDecoration: 'none' }}>
              {s.domain}
            </a>
          </div>
        </div>
        <div className="wrap">
          <small>
            © {s.salonName}, Krzeszowice. Wszelkie prawa zastrzeżone. {s.footerNote}
          </small>
        </div>
      </footer>
    </div>
  )
}
