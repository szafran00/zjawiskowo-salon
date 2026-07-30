import Link from 'next/link'
import type { Settings } from '../lib/types'
import CookieSettings from './CookieSettings'
import Kwiatuszek from './Kwiatuszek'

export default function Footer({ s }: { s: Settings }) {
  const tel = 'tel:' + (s.phone || '').replace(/\s/g, '')
  const year = 2026

  return (
    <footer className="footer">
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-brand">
            <Link href="/" className="logo">
              {/* Na ciemnym tle kontur znaku musi być jasny, inaczej znika. */}
              <Kwiatuszek size={38} outline="#F4EEE2" />
              <span className="logo-text">
                <b>{s.salonName}</b>
                {s.salonSubtitle && <small>{s.salonSubtitle}</small>}
              </span>
            </Link>
            {s.footerNote && <p>{s.footerNote}</p>}
          </div>

          <div className="foot-col">
            <h2>Nawigacja</h2>
            <ul className="foot-links">
              <li>
                <Link href="/">Strona główna</Link>
              </li>
              <li>
                <Link href="/o-mnie">O mnie</Link>
              </li>
              <li>
                <Link href="/zabiegi">Zabiegi</Link>
              </li>
              <li>
                <Link href="/cennik">Cennik</Link>
              </li>
            </ul>
          </div>

          <div className="foot-col">
            <h2>Więcej</h2>
            <ul className="foot-links">
              <li>
                <Link href="/vouchery">Vouchery</Link>
              </li>
              <li>
                <Link href="/kontakt">Kontakt</Link>
              </li>
              <li>
                <Link href="/regulamin">Regulamin</Link>
              </li>
              <li>
                <Link href="/polityka-prywatnosci">Polityka prywatności</Link>
              </li>
              <li>
                <CookieSettings />
              </li>
            </ul>
          </div>

          <div className="foot-col">
            <h2>Kontakt</h2>
            <div className="foot-contact">
              {s.phone && <a href={tel}>{s.phone}</a>}
              {s.address && <span>{s.address}</span>}
              {s.hours && <span>{s.hours}</span>}
            </div>
          </div>
        </div>

        <div className="foot-bottom">
          <span>
            © {year} {s.salonName}, Krzeszowice. Wszelkie prawa zastrzeżone.
          </span>
          {s.domain && (
            <a href={`https://${s.domain}`} rel="noopener">
              {s.domain}
            </a>
          )}
        </div>
      </div>
    </footer>
  )
}
