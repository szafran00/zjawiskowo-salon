'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import type { NavTreatment, NavPriceGroup } from '../lib/types'

type SubLink = { href: string; label: string }
type NavItem = { href: string; label: string; sub?: SubLink[] }

export default function Header({
  phone,
  salonName,
  treatments,
  priceGroups,
}: {
  phone: string
  salonName: string
  treatments: NavTreatment[]
  priceGroups: NavPriceGroup[]
}) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const tel = 'tel:' + phone.replace(/\s/g, '')

  const treatmentSub: SubLink[] = treatments
    .filter((t) => t.slug)
    .map((t) => ({
      href: `/zabiegi/${t.slug}`,
      label: t.navLabel || t.kicker || t.title || '',
    }))

  const priceSub: SubLink[] = priceGroups
    .filter((g) => g.anchor && g.showInMenu !== false)
    .map((g) => ({ href: `/cennik#${g.anchor}`, label: g.title || '' }))

  // Kolejność ustalona z klientką: Kontakt zawsze na końcu.
  const items: NavItem[] = [
    { href: '/o-mnie', label: 'O mnie' },
    { href: '/zabiegi', label: 'Zabiegi', sub: treatmentSub },
    { href: '/cennik', label: 'Cennik', sub: priceSub },
    { href: '/vouchery', label: 'Vouchery' },
    { href: '/regulamin', label: 'Regulamin' },
    { href: '/kontakt', label: 'Kontakt' },
  ]

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <header className="hdr">
      <div className="wrap hdr-in">
        <Link href="/" className="logo" onClick={() => setOpen(false)}>
          {salonName}
        </Link>
        <nav className={`nav ${open ? 'open' : ''}`} aria-label="Menu główne">
          {items.map((item) =>
            item.sub && item.sub.length ? (
              <div className="nav-item has-sub" key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={isActive(item.href) ? 'active' : undefined}
                >
                  {item.label}
                  <span className="nav-caret" aria-hidden="true">
                    ▾
                  </span>
                </Link>
                <div className="nav-sub">
                  {item.sub.map((s) => (
                    <Link key={s.href} href={s.href} onClick={() => setOpen(false)}>
                      {s.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="nav-item" key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={isActive(item.href) ? 'active' : undefined}
                >
                  {item.label}
                </Link>
              </div>
            )
          )}
        </nav>
        <div className="hdr-right">
          <a href={tel} className="btn btn-cta hide-sm">
            {phone ? `Zadzwoń ${phone}` : 'Umów wizytę'}
          </a>
          <button
            className="burger"
            aria-label="Menu"
            aria-expanded={open}
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
