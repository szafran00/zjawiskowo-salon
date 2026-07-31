'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Faq as FaqType } from '../lib/types'
import { pl } from '@/app/lib/typografia'

export default function Faq({
  faqs,
  kicker,
  heading,
  ctaLabel,
}: {
  faqs: FaqType[]
  kicker?: string | null
  heading?: string | null
  /** Puste = przycisk pod pytaniami się nie pokazuje. */
  ctaLabel?: string | null
}) {
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  // Pole niewypełnione w panelu przychodzi z Sanity jako null, więc `??`:
  // brak wartości bierze zapas, a celowo wyczyszczone pole zostaje puste.
  const kickerText = kicker || 'Najczęstsze pytania'
  const headingText = heading || 'FAQ'
  const ctaText = ctaLabel ?? 'Masz inne pytanie? Napisz do mnie'

  if (!faqs.length) return null

  return (
    <section className="sec reveal" id="faq" style={{ background: 'var(--bg2)' }}>
      <div className="wrap">
        <div className="faq-head">
          <p className="kicker">{kickerText}</p>
          <h2 className="h2">{headingText}</h2>
        </div>
        <div className="faq">
          {faqs.map((f, i) => {
            const isOpen = openIdx === i
            const panelId = `faq-panel-${i}`
            const btnId = `faq-q-${i}`
            return (
              <div className="faq-item" key={i}>
                <button
                  type="button"
                  id={btnId}
                  className="faq-q"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                >
                  {f.question}
                  <span className="faq-sign" aria-hidden="true">
                    {isOpen ? '–' : '+'}
                  </span>
                </button>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  className={`faq-a ${isOpen ? 'open' : ''}`}
                >
                  {pl(f.answer)}
                </div>
              </div>
            )
          })}
        </div>
        {ctaText && (
          <div className="btn-row" style={{ justifyContent: 'center', marginTop: 36 }}>
            <Link href="/kontakt" className="btn btn-ghost">
              {ctaText}
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
