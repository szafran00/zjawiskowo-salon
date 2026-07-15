'use client'

import { useEffect, useState } from 'react'

// Mapa Google odporna na RODO: iframe (który ustawia cookies Google) NIE ładuje
// się dopóki użytkownik nie kliknie „Pokaż mapę" lub nie wyrazi zgody marketingowej
// w Cookiebot. Bez ustawionego URL-a pokazuje placeholder.
export default function MapEmbed({ embedUrl }: { embedUrl?: string }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cb = (window as any).Cookiebot
    if (cb?.consent?.marketing) setShow(true)
    const onAccept = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const c = (window as any).Cookiebot
      if (c?.consent?.marketing) setShow(true)
    }
    window.addEventListener('CookiebotOnAccept', onAccept)
    return () => window.removeEventListener('CookiebotOnAccept', onAccept)
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
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => setShow(true)}
        >
          Pokaż mapę
        </button>
      </div>
    )
  }

  return <iframe src={embedUrl} loading="lazy" title="Mapa Google" />
}
