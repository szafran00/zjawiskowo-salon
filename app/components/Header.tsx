'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import type { NavTreatment, NavPriceGroup } from '../lib/types'
import Kwiatuszek from './Kwiatuszek'

type SubLink = { href: string; label: string; active: boolean }
type NavItem = { href: string; label: string; active: boolean; sub?: SubLink[] }

export default function Header({
  phone,
  salonName,
  salonSubtitle,
  treatments,
  priceGroups,
}: {
  phone: string
  salonName: string
  salonSubtitle?: string
  treatments: NavTreatment[]
  priceGroups: NavPriceGroup[]
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [openSub, setOpenSub] = useState<number | null>(null)
  const navRef = useRef<HTMLElement | null>(null)
  const pathname = usePathname()
  const tel = 'tel:' + phone.replace(/\s/g, '')

  const closeAll = () => {
    setMenuOpen(false)
    setOpenSub(null)
  }

  // Zamknięcie panelu zwija też rozwiniętą podlistę — inaczej po ponownym
  // otwarciu menu wita nas stan sprzed chwili.
  const toggleMenu = () => {
    if (menuOpen) closeAll()
    else setMenuOpen(true)
  }

  // Zmiana trasy zamyka menu — inaczej panel zostaje otwarty nad nową stroną.
  useEffect(() => {
    closeAll()
  }, [pathname])

  // Escape zamyka, klik poza nagłówkiem zwija rozwiniętą listę.
  useEffect(() => {
    if (!menuOpen && openSub === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAll()
    }
    const onDown = (e: MouseEvent) => {
      if (!navRef.current?.parentElement?.contains(e.target as Node)) closeAll()
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onDown)
    }
  }, [menuOpen, openSub])

  // Otwarty panel na telefonie blokuje przewijanie tła.
  useEffect(() => {
    if (!menuOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [menuOpen])

  const onPath = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/')

  // Rozwijane listy budują się z treści w panelu; pierwsza pozycja prowadzi
  // do strony nadrzędnej, bo pozycja z listą sama w sobie nie jest odnośnikiem.
  const treatmentSub: SubLink[] = [
    { href: '/zabiegi', label: 'Wszystkie zabiegi', active: pathname === '/zabiegi' },
    ...treatments
      .filter((t) => t.slug)
      .map((t) => ({
        href: `/zabiegi/${t.slug}`,
        label: t.navLabel || t.kicker || t.title || '',
        active: pathname === `/zabiegi/${t.slug}`,
      })),
  ]

  const priceSub: SubLink[] = [
    { href: '/cennik', label: 'Pełny cennik', active: pathname === '/cennik' },
    ...priceGroups
      .filter((g) => g.anchor && g.showInMenu !== false)
      .map((g) => ({
        href: `/cennik#${g.anchor}`,
        label: g.title || '',
        active: false,
      })),
  ]

  // Kolejność ustalona z klientką: Kontakt zawsze na końcu.
  const items: NavItem[] = [
    { href: '/o-mnie', label: 'O mnie', active: onPath('/o-mnie') },
    { href: '/zabiegi', label: 'Zabiegi', active: onPath('/zabiegi'), sub: treatmentSub },
    { href: '/cennik', label: 'Cennik', active: onPath('/cennik'), sub: priceSub },
    { href: '/vouchery', label: 'Vouchery', active: onPath('/vouchery') },
    { href: '/regulamin', label: 'Regulamin', active: onPath('/regulamin') },
    { href: '/kontakt', label: 'Kontakt', active: onPath('/kontakt') },
  ]

  return (
    <header className="hdr">
      <div className="wrap hdr-in">
        <Link href="/" className="logo" onClick={closeAll}>
          <Kwiatuszek size={38} />
          <span className="logo-text">
            <b>{salonName}</b>
            {salonSubtitle && <small>{salonSubtitle}</small>}
          </span>
        </Link>

        <nav
          ref={navRef}
          id="menu-glowne"
          className={`nav ${menuOpen ? 'open' : ''}`}
          aria-label="Menu główne"
        >
          {items.map((item, i) =>
            item.sub && item.sub.length ? (
              <div
                className={`navitem has-sub ${openSub === i ? 'open' : ''}`}
                key={item.href}
              >
                <button
                  type="button"
                  className={`navtrigger ${item.active ? 'active' : ''}`}
                  aria-expanded={openSub === i}
                  aria-current={item.active ? 'page' : undefined}
                  onClick={() => setOpenSub((v) => (v === i ? null : i))}
                >
                  {item.label}
                  <i className="caret" aria-hidden="true" />
                </button>
                <div className="submenu">
                  {item.sub.map((s) => (
                    <Link
                      key={s.href}
                      href={s.href}
                      className={s.active ? 'active' : undefined}
                      aria-current={s.active ? 'page' : undefined}
                      onClick={closeAll}
                    >
                      {s.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="navitem" key={item.href}>
                <Link
                  href={item.href}
                  className={`navlink ${item.active ? 'active' : ''}`}
                  aria-current={item.active ? 'page' : undefined}
                  onClick={closeAll}
                >
                  {item.label}
                </Link>
              </div>
            )
          )}
        </nav>

        <div className="hdr-right">
          <a href={tel} className="btn btn-cta hide-sm">
            {phone ? `Umów wizytę · ${phone}` : 'Umów wizytę'}
          </a>
          <button
            className="burger"
            aria-label="Menu"
            aria-controls="menu-glowne"
            aria-expanded={menuOpen}
            onClick={toggleMenu}
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
