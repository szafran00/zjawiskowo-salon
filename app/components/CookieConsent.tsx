'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export const CONSENT_KEY = 'zjw-cookie-consent'

// Własny pasek zgody na cookies. Chowa się, jeśli skonfigurowany jest Cookiebot
// (wtedy zgodę obsługuje Cookiebot). Wybór zapamiętywany w localStorage.
// Mapa Google ładuje się dopiero po zgodzie — zob. MapEmbed.
export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_COOKIEBOT_ID) return
    if (!localStorage.getItem(CONSENT_KEY)) setVisible(true)
    const reopen = () => setVisible(true)
    window.addEventListener('open-cookie-settings', reopen)
    return () => window.removeEventListener('open-cookie-settings', reopen)
  }, [])

  function choose(value: 'all' | 'necessary') {
    try {
      localStorage.setItem(CONSENT_KEY, value)
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new CustomEvent('cookie-consent', { detail: value }))
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="cookie" role="dialog" aria-label="Zgoda na pliki cookies">
      <p>
        Używamy plików cookies niezbędnych do działania strony. Mapa Google
        wczytuje się dopiero po Twojej zgodzie.{' '}
        <Link href="/polityka-prywatnosci">Więcej</Link>
      </p>
      <div className="c-actions">
        <button className="btn btn-ghost" onClick={() => choose('necessary')}>
          Tylko niezbędne
        </button>
        <button className="btn btn-cta" onClick={() => choose('all')}>
          Akceptuję
        </button>
      </div>
    </div>
  )
}
