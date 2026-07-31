'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export const CONSENT_KEY = 'zjw-cookie-consent'
const CONSENT_DATA_KEY = 'zjw-cookie-consent-data'

// Zgoda wygasa po roku. Przepis nie podaje terminu wprost, ale wynika on
// z zasady, że zgoda ma być aktualna; organy nadzorcze przyjmują mniej więcej
// dwanaście miesięcy.
const WAZNOSC_MS = 365 * 24 * 60 * 60 * 1000

// Własny pasek zgody na cookies. Chowa się, jeśli skonfigurowany jest Cookiebot
// (wtedy zgodę obsługuje Cookiebot). Wybór zapamiętywany w localStorage.
// Mapa Google ładuje się dopiero po zgodzie — zob. MapEmbed.
export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_COOKIEBOT_ID) return

    // Datę trzymamy w osobnym kluczu: MapEmbed czyta CONSENT_KEY jako zwykły
    // napis, więc format tamtego klucza zostaje nienaruszony.
    let przeterminowana = false
    try {
      const kiedy = Number(localStorage.getItem(CONSENT_DATA_KEY))
      if (kiedy && Date.now() - kiedy > WAZNOSC_MS) {
        localStorage.removeItem(CONSENT_KEY)
        localStorage.removeItem(CONSENT_DATA_KEY)
        przeterminowana = true
      }
    } catch {
      /* brak localStorage — pytamy tak czy inaczej */
    }

    if (przeterminowana || !localStorage.getItem(CONSENT_KEY)) setVisible(true)
    const reopen = () => setVisible(true)
    window.addEventListener('open-cookie-settings', reopen)
    return () => window.removeEventListener('open-cookie-settings', reopen)
  }, [])

  function choose(value: 'all' | 'necessary') {
    try {
      localStorage.setItem(CONSENT_KEY, value)
      localStorage.setItem(CONSENT_DATA_KEY, String(Date.now()))
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new CustomEvent('cookie-consent', { detail: value }))
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="cookie" role="dialog" aria-label="Zgoda na pliki cookies">
      {/* Nazwa dostawcy jest tu celowo: zgoda ma być świadoma, a jedyna rzecz
          wymagająca zgody na tej stronie to mapa Google. Ogólne „treści
          zewnętrzne” nie mówiło odwiedzającemu, na co się zgadza. */}
      <p>
        Używamy plików cookies, żeby strona działała poprawnie. Za Twoją zgodą
        wczytujemy też mapę Google. Szczegóły w{' '}
        <Link href="/polityka-prywatnosci">polityce prywatności</Link>.
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
