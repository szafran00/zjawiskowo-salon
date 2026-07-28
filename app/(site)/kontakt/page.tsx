import { sanityFetch } from '@/sanity/lib/fetch'
import { SETTINGS_QUERY } from '@/sanity/lib/queries'
import type { Settings } from '@/app/lib/types'
import { fallbackSettings } from '@/app/lib/fallback'
import ContactForm from '@/app/components/ContactForm'
import MapEmbed from '@/app/components/MapEmbed'
import PageHead from '@/app/components/PageHead'

export const metadata = {
  title: 'Kontakt — ZJAWISKOWO Krzeszowice',
  description:
    'Salon kosmetyczny ZJAWISKOWO, ul. 3 Maja w Krzeszowicach. Bezpłatny parking, budynek przy automyjni. Wizyty umawiamy telefonicznie.',
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
  const notes = s.contactNotes && s.contactNotes.length ? s.contactNotes : []

  return (
    <>
      <PageHead
        crumbs={[{ label: 'Strona główna', href: '/' }, { label: 'Kontakt' }]}
        kicker="Kontakt"
        title="Odwiedź mnie w Krzeszowicach"
        lead="Rezerwacja wyłącznie telefoniczna — zadzwoń, a wspólnie ustalimy dogodny termin. Poniżej znajdziesz adres, godziny i dojazd."
      />

      <section className="contact reveal">
        <div className="wrap sec">
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
              {notes.length > 0 && (
                <div className="info-row">
                  <span className="lbl">Jak trafić</span>
                  <ul className="contact-notes">
                    {notes.map((n, i) => (
                      <li key={i}>{n}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="map">
                <MapEmbed embedUrl={s.googleMapsEmbedUrl} />
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
            <ContactForm
              endpoint={s.formEndpoint}
              email={s.contactEmail}
              phone={s.phone}
            />
          </div>
        </div>
      </section>
    </>
  )
}
