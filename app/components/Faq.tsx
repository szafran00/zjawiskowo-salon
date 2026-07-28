'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Faq as FaqType } from '../lib/types'

export default function Faq({
  faqs,
  kicker = 'Najczęstsze pytania',
  heading = 'FAQ',
}: {
  faqs: FaqType[]
  kicker?: string
  heading?: string
}) {
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  if (!faqs.length) return null

  return (
    <section className="sec reveal" id="faq" style={{ background: 'var(--bg2)' }}>
      <div className="wrap">
        <div className="faq-head">
          <p className="kicker">{kicker}</p>
          <h2 className="h2">{heading}</h2>
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
                  {f.answer}
                </div>
              </div>
            )
          })}
        </div>
        <div className="btn-row" style={{ justifyContent: 'center', marginTop: 36 }}>
          <Link href="/kontakt" className="btn btn-ghost">
            Masz inne pytanie? Napisz do mnie
          </Link>
        </div>
      </div>
    </section>
  )
}
