import { sanityFetch } from '@/sanity/lib/fetch'
import { SETTINGS_QUERY } from '@/sanity/lib/queries'
import type { Settings } from '@/app/lib/types'
import { fallbackSettings } from '@/app/lib/fallback'
import ContactForm from '@/app/components/ContactForm'

export const revalidate = 60

export const metadata = {
  title: 'Kontakt — ZJAWISKOWO Krzeszowice',
}

export default async function KontaktPage() {
  let settings: Settings | null = null
  try {
    settings = await sanityFetch<Settings>(SETTINGS_QUERY)
  } catch {
    settings = null
  }
  const s: Settings = { ...fallbackSettings, ...(settings || {}) }
  const tel = 'tel:' + (s.phone || '').replace(/\s/g, '')

  return (
    <section className="sec reveal">
      <div className="wrap">
        <div
          className="page-head"
          style={{ alignItems: 'flex-start', textAlign: 'left' }}
        >
          <p className="kicker">Kontakt</p>
          <h1 className="h2">Odwiedź nas w Krzeszowicach</h1>
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
                  <iframe src={s.googleMapsEmbedUrl} loading="lazy" title="Mapa Google" />
                ) : (
                  <span>osadzona mapa Google: [do wklejenia]</span>
                )}
              </div>
            </div>
            <div className="socials">
              <a className="soc" href={s.facebookUrl || '#'} target="_blank" rel="noopener">
                Facebook
              </a>
              <a className="soc" href={s.instagramUrl || '#'} target="_blank" rel="noopener">
                Instagram
              </a>
            </div>
          </div>
          <ContactForm />
        </div>
      </div>
    </section>
  )
}
