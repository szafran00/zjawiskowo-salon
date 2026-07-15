import Link from 'next/link'
import type { Settings } from '../lib/types'

export default function Footer({ s }: { s: Settings }) {
  const tel = 'tel:' + (s.phone || '').replace(/\s/g, '')
  return (
    <footer className="footer">
      <div className="wrap footer-in">
        <div>
          <div className="logo">{s.salonName}</div>
          <p style={{ margin: '10px 0 0', fontSize: 13, opacity: 0.8 }}>
            Salon kosmetyczny · Krzeszowice
          </p>
        </div>
        <nav className="footer-nav">
          <Link href="/o-salonie">O salonie</Link>
          <Link href="/zabiegi">Zabiegi</Link>
          <Link href="/cennik">Cennik</Link>
          <Link href="/kontakt">Kontakt</Link>
          <Link href="/polityka-prywatnosci">Polityka prywatności</Link>
        </nav>
        <div style={{ fontSize: 13, lineHeight: 1.9 }}>
          <a href={tel} style={{ textDecoration: 'none' }}>
            {s.phone}
          </a>
          <br />
          <a href={`https://${s.domain}`} style={{ textDecoration: 'none' }}>
            {s.domain}
          </a>
        </div>
      </div>
      <div className="wrap">
        <small>
          © {s.salonName}, Krzeszowice. Wszelkie prawa zastrzeżone. {s.footerNote}
        </small>
      </div>
    </footer>
  )
}
