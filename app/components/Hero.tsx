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
  const cta = `Umów się: ${s.phone}`

  const twarz = featured.find((t) => t.slug === 'twarz') || featured[1] || featured[0]
  const laser = featured.find((t) => t.slug === 'laser') || featured[0]

  const faceImg = imgUrl(twarz?.image || s.heroFaceImage, STOCK.face)
  const laserImg = imgUrl(laser?.image || s.heroLaserImage, STOCK.laser)
  const mainImg = imgUrl(s.heroMainImage, STOCK.main, 1600)
  const twarzHref = `/zabiegi/${twarz?.slug || 'twarz'}`
  const laserHref = `/zabiegi/${laser?.slug || 'laser'}`
  const twarzCap = twarz?.kicker || 'Kosmetyka twarzy'
  const laserCap = laser?.kicker || 'Depilacja laserowa'

  if (theme === 'lavender') {
    const fallbackSlides = [STOCK.slide1, STOCK.slide2, STOCK.slide3]
    const slides =
      s.heroSlides && s.heroSlides.length
        ? s.heroSlides.slice(0, 3).map((im, i) => imgUrl(im, fallbackSlides[i % 3], 1400))
        : fallbackSlides
    return (
      <section className="hero hero-b">
        <div className="slider">
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
            <a href={tel} className="btn btn-cta">
              {cta}
            </a>
            <div className="pillar-chips">
              <Link href={twarzHref} className="chip">
                <b></b>
                {twarzCap}
              </Link>
              <Link href={laserHref} className="chip">
                <b></b>
                {laserCap}
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
            <a href={tel} className="btn btn-cta">
              {cta}
            </a>
          </div>
          <div className="hero-c-tiles">
            <Link href={twarzHref} className="svc-tile">
              <div className="ph">
                <img src={faceImg} alt={twarzCap} />
              </div>
              <div className="tile-cap">{twarzCap}</div>
            </Link>
            <Link href={laserHref} className="svc-tile">
              <div className="ph">
                <img src={laserImg} alt={laserCap} />
              </div>
              <div className="tile-cap">{laserCap}</div>
            </Link>
          </div>
        </div>
      </section>
    )
  }

  // gold (default)
  return (
    <section className="hero hero-a">
      <Link href={twarzHref} className="hero-tile">
        <div className="ph">
          <img src={faceImg} alt={twarzCap} />
        </div>
        <div className="tile-cap">{twarzCap}</div>
      </Link>
      <div className="hero-center">
        <p className="kicker">{s.heroKicker}</p>
        <h1 className="h1">{s.tagline}</h1>
        <p className="lead">{s.heroLead}</p>
        <a href={tel} className="btn btn-cta">
          {cta}
        </a>
      </div>
      <Link href={laserHref} className="hero-tile">
        <div className="ph">
          <img src={laserImg} alt={laserCap} />
        </div>
        <div className="tile-cap">{laserCap}</div>
      </Link>
    </section>
  )
}
