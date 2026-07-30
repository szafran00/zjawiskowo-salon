import Link from 'next/link'
import { imgUrl } from '../lib/img'
import { STOCK } from '../lib/fallback'
import type { Settings, Treatment } from '../lib/types'

/* eslint-disable @next/next/no-img-element */
export default function Hero({
  s,
  featured,
}: {
  s: Settings
  featured: Treatment[]
}) {
  const theme = s.theme || 'gold'
  const tel = 'tel:' + (s.phone || '').replace(/\s/g, '')

  // Filary rozpoznajemy po kolejności ustawionej w panelu (pierwszy = depilacja),
  // ze wsparciem dla slugów, gdyby klientka zmieniła kolejność.
  const bySlug = (needle: string) =>
    featured.find((t) => (t.slug || '').includes(needle))
  const laser = bySlug('depilacj') || bySlug('laser') || featured[0]
  const twarz = bySlug('twarz') || bySlug('pielegnacj') || featured[1] || featured[0]

  const faceImg = imgUrl(twarz?.image || s.heroFaceImage, STOCK.face)
  const laserImg = imgUrl(laser?.image || s.heroLaserImage, STOCK.laser)
  const mainImg = imgUrl(s.heroMainImage, STOCK.main, 1600)
  const twarzHref = `/zabiegi/${twarz?.slug || 'pielegnacja-twarzy'}`
  const laserHref = `/zabiegi/${laser?.slug || 'depilacja-laserowa'}`
  const twarzCap = twarz?.navLabel || twarz?.kicker || 'Pielęgnacja twarzy'
  const laserCap = laser?.navLabel || laser?.kicker || 'Depilacja laserowa'

  const phoneBtn = (
    <a href={tel} className="btn btn-cta">
      Umów się: <span className="tel-num">{s.phone}</span>
    </a>
  )

  if (theme === 'lavender') {
    const fallbackSlides = [STOCK.slide1, STOCK.slide2, STOCK.slide3]
    const slides =
      s.heroSlides && s.heroSlides.length
        ? s.heroSlides.slice(0, 3).map((im, i) => imgUrl(im, fallbackSlides[i % 3], 1400))
        : fallbackSlides
    return (
      <section className="hero hero-b">
        <div className="slider" aria-hidden="true">
          {slides.map((src, i) => (
            <div className="slide" key={i}>
              <div className="ph">
                <img src={src} alt="" />
              </div>
            </div>
          ))}
        </div>
        <div className="hero-overlay">
          <div className="wrap">
            <p className="kicker">{s.heroKicker}</p>
            <h1 className="h1">{s.tagline}</h1>
            <p className="lead">{s.heroLead}</p>
            {phoneBtn}
            <div className="pillar-chips">
              <Link href={laserHref} className="chip">
                <b />
                {laserCap}
              </Link>
              <Link href={twarzHref} className="chip">
                <b />
                {twarzCap}
              </Link>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (theme === 'white') {
    return (
      <section className="hero hero-c">
        <div className="wrap">
          <div className="ph hero-c-img">
            <img src={mainImg} alt={s.salonName || 'Salon'} />
          </div>
          <div className="hero-c-body">
            <p className="kicker">{s.heroKicker}</p>
            <h1 className="h1">{s.tagline}</h1>
            <p className="lead">{s.heroLead}</p>
            {phoneBtn}
          </div>
          <div className="hero-c-tiles">
            <Link href={laserHref} className="svc-tile">
              <div className="ph">
                <img src={laserImg} alt={laserCap} />
              </div>
              <div className="tile-cap">{laserCap}</div>
            </Link>
            <Link href={twarzHref} className="svc-tile">
              <div className="ph">
                <img src={faceImg} alt={twarzCap} />
              </div>
              <div className="tile-cap">{twarzCap}</div>
            </Link>
          </div>
        </div>
      </section>
    )
  }

  // Złota elegancja — wariant zaakceptowany przez klientkę.
  // Kadry hero to element, po którym liczony jest czas załadowania strony
  // (LCP), więc pobierają się z wysokim priorytetem i bez leniwego ładowania.
  return (
    <section className="hero hero-a">
      <Link href={laserHref} className="hero-tile">
        <div className="ph">
          <img src={laserImg} alt={laserCap} fetchPriority="high" />
        </div>
        <div className="tile-cap">{laserCap}</div>
      </Link>
      <div className="hero-center">
        <p className="kicker">{s.heroKicker}</p>
        <h1 className="h1">{s.tagline}</h1>
        <p className="lead">{s.heroLead}</p>
        {phoneBtn}
      </div>
      <Link href={twarzHref} className="hero-tile">
        <div className="ph">
          <img src={faceImg} alt={twarzCap} fetchPriority="high" />
        </div>
        <div className="tile-cap">{twarzCap}</div>
      </Link>
    </section>
  )
}
