'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const LINKS: [string, string][] = [
  ['/', 'Strona główna'],
  ['/o-salonie', 'O salonie'],
  ['/zabiegi', 'Zabiegi'],
  ['/cennik', 'Cennik'],
  ['/kontakt', 'Kontakt'],
]

export default function Header({
  phone,
  salonName,
}: {
  phone: string
  salonName: string
}) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const tel = 'tel:' + phone.replace(/\s/g, '')
  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)
  return (
    <header className="hdr">
      <div className="wrap hdr-in">
        <Link href="/" className="logo" onClick={() => setOpen(false)}>
          {salonName}
        </Link>
        <nav className={`nav ${open ? 'open' : ''}`}>
          {LINKS.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={isActive(href) ? 'active' : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="hdr-right">
          <a href={tel} className="btn btn-cta hide-sm">
            Umów wizytę
          </a>
          <button
            className="burger"
            aria-label="Menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  )
}
