'use client'

import { useEffect, useState } from 'react'
import { CONSENT_KEY } from './CookieConsent'

// Mapa Google odporna na RODO: iframe (ustawiający cookies Google) ładuje się
// dopiero po zgodzie (własny pasek lub Cookiebot) albo po kliknięciu w kadr.
//
// Zgoda siedzi w localStorage, więc jest osobna dla każdego urządzenia. Klientka
// zaakceptowała cookies na komputerze i nie na telefonie, i zgłosiła to jako
// „na telefonie nie widać mapy dojazdu, na kompie jest". Dlatego kadr przed
// zgodą przestał być pustym prostokątem z napisem: pokazuje adres, przycisk
// wczytania mapy i odnośnik prosto do Map Google, który działa zawsze.
export default function MapEmbed({
  embedUrl,
  address,
}: {
  embedUrl?: string
  address?: string
}) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cb = (window as any).Cookiebot
    if (cb?.consent?.marketing) {
      setShow(true)
      return
    }
    try {
      if (localStorage.getItem(CONSENT_KEY) === 'all') {
        setShow(true)
        return
      }
    } catch {
      /* ignore */
    }
    const onConsent = (e: Event) => {
      if ((e as CustomEvent).detail === 'all') setShow(true)
    }
    const onCb = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const c = (window as any).Cookiebot
      if (c?.consent?.marketing) setShow(true)
    }
    window.addEventListener('cookie-consent', onConsent)
    window.addEventListener('CookiebotOnAccept', onCb)
    return () => {
      window.removeEventListener('cookie-consent', onConsent)
      window.removeEventListener('CookiebotOnAccept', onCb)
    }
  }, [])

  const wMapach = address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
    : 'https://www.google.com/maps'

  if (!embedUrl) {
    return (
      <div className="ph" style={{ height: 300 }}>
        <span>osadzona mapa Google: [do wklejenia w panelu]</span>
      </div>
    )
  }

  if (!show) {
    return (
      <div className="mapcard">
        <p className="mapcard-adres">
          <span aria-hidden="true">✦</span> {address}
        </p>
        <p className="mapcard-info">
          Mapa Google zapisuje własne pliki cookie, więc wczytuje się dopiero na
          Twoje życzenie.
        </p>
        <div className="btn-row mapcard-akcje">
          <button type="button" className="btn btn-cta" onClick={() => setShow(true)}>
            Pokaż mapę
          </button>
          <a
            className="btn btn-ghost"
            href={wMapach}
            target="_blank"
            rel="noopener"
          >
            Otwórz w Mapach Google
          </a>
        </div>
      </div>
    )
  }

  return <iframe src={embedUrl} loading="lazy" title="Mapa Google" />
}
