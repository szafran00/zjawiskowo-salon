'use client'

import { useState } from 'react'
import type { Faq as FaqType } from '../lib/types'

export default function Faq({ faqs }: { faqs: FaqType[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0)
  return (
    <section className="sec reveal" id="faq">
      <div className="wrap">
        <div className="faq-head">
          <p className="kicker">Najczęstsze pytania</p>
          <h2 className="h2">FAQ</h2>
        </div>
        <div className="faq">
          {faqs.map((f, i) => {
            const isOpen = openIdx === i
            return (
              <div className="faq-item" key={i}>
                <button
                  className="faq-q"
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                >
                  {f.question}
                  <span className="faq-sign">{isOpen ? '–' : '+'}</span>
                </button>
                <div className={`faq-a ${isOpen ? 'open' : ''}`}>{f.answer}</div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
