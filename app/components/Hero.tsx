import { imgUrl } from '../lib/img'
import { STOCK } from '../lib/fallback'
import type { Settings } from '../lib/types'

/* eslint-disable @next/next/no-img-element */
export default function Hero({ s }: { s: Settings }) {
  const theme = s.theme || 'gold'
  const face = imgUrl(s.heroFaceImage, STOCK.face)
  const laser = imgUrl(s.heroLaserImage, STOCK.laser)
  const main = imgUrl(s.heroMainImage, STOCK.main, 1600)
  const tel = 'tel:' + (s.phone || '').replace(/\s/g, '')
  const cta = `Umów się: ${s.phone}`

  if (theme === 'lavender') {
    const fallbackSlides = [STOCK.slide1, STOCK.slide2, STOCK.slide3]
    const slides =
      s.heroSlides && s.heroSlides.length
        ? s.heroSlides
            .slice(0, 3)
            .map((im, i) => imgUrl(im, fallbackSlides[i % 3], 1400))
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
              <a href="#twarz" className="chip">
                <b></b>Kosmetyka twarzy
              </a>
              <a href="#laser" className="chip">
                <b></b>Depilacja laserowa
              </a>
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
            <img src={main} alt={s.salonName || 'Salon'} />
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
            <a href="#twarz" className="svc-tile">
              <div className="ph">
                <img src={face} alt="Kosmetyka twarzy" />
              </div>
              <div className="tile-cap">Kosmetyka twarzy</div>
            </a>
            <a href="#laser" className="svc-tile">
              <div className="ph">
                <img src={laser} alt="Depilacja laserowa" />
              </div>
              <div className="tile-cap">Depilacja laserowa</div>
            </a>
          </div>
        </div>
      </section>
    )
  }

  // gold (default)
  return (
    <section className="hero hero-a">
      <a href="#twarz" className="hero-tile">
        <div className="ph">
          <img src={face} alt="Kosmetyka twarzy" />
        </div>
        <div className="tile-cap">Kosmetyka twarzy</div>
      </a>
      <div className="hero-center">
        <p className="kicker">{s.heroKicker}</p>
        <h1 className="h1">{s.tagline}</h1>
        <p className="lead">{s.heroLead}</p>
        <a href={tel} className="btn btn-cta">
          {cta}
        </a>
      </div>
      <a href="#laser" className="hero-tile">
        <div className="ph">
          <img src={laser} alt="Depilacja laserowa" />
        </div>
        <div className="tile-cap">Depilacja laserowa</div>
      </a>
    </section>
  )
}
