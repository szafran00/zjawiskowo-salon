'use client'

import { useState } from 'react'

const LINKS: [string, string][] = [
  ['#start', 'Start'],
  ['#laser', 'Depilacja laserowa'],
  ['#twarz', 'Kosmetyka twarzy'],
  ['#opinie', 'Opinie'],
  ['#faq', 'FAQ'],
  ['#kontakt', 'Kontakt'],
]

export default function Header({
  phone,
  salonName,
}: {
  phone: string
  salonName: string
}) {
  const [open, setOpen] = useState(false)
  const tel = 'tel:' + phone.replace(/\s/g, '')
  return (
    <header className="hdr" id="start">
      <div className="wrap hdr-in">
        <a href="#start" className="logo" onClick={() => setOpen(false)}>
          {salonName}
        </a>
        <nav className={`nav ${open ? 'open' : ''}`}>
          {LINKS.map(([href, label]) => (
            <a key={href} href={href} onClick={() => setOpen(false)}>
              {label}
            </a>
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
