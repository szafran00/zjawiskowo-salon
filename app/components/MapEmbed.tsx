'use client'

import { useEffect, useState } from 'react'
import { CONSENT_KEY } from './CookieConsent'

// Mapa Google odporna na RODO: iframe (ustawiający cookies Google) ładuje się
// dopiero po zgodzie (własny popup lub Cookiebot) albo po kliknięciu „Pokaż mapę".
export default function MapEmbed({ embedUrl }: { embedUrl?: string }) {
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

  if (!embedUrl) {
    return (
      <div className="ph">
        <span>osadzona mapa Google: [do wklejenia]</span>
      </div>
    )
  }

  if (!show) {
    return (
      <div className="ph map-consent">
        <p>Mapa Google używa plików cookies Google.</p>
        <button type="button" className="btn btn-ghost" onClick={() => setShow(true)}>
          Pokaż mapę
        </button>
      </div>
    )
  }

  return <iframe src={embedUrl} loading="lazy" title="Mapa Google" />
}
