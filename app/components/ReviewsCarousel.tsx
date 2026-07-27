'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { Review } from '../lib/types'

const AUTO_MS = 6500

export default function ReviewsCarousel({
  reviews,
  kicker,
  heading,
  googleReviewUrl,
}: {
  reviews: Review[]
  kicker?: string
  heading?: string
  googleReviewUrl?: string
}) {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const count = reviews.length
  const touchX = useRef<number | null>(null)

  const go = useCallback(
    (next: number) => setI(((next % count) + count) % count),
    [count]
  )

  // Automatyczne przewijanie zatrzymuje się, gdy ktoś najedzie myszą,
  // ustawi fokus klawiaturą albo gdy system prosi o ograniczenie animacji.
  useEffect(() => {
    if (count < 2 || paused) return
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    const t = setInterval(() => setI((p) => (p + 1) % count), AUTO_MS)
    return () => clearInterval(t)
  }, [count, paused])

  if (!count) return null

  return (
    <section
      className="reviews reveal"
      id="opinie"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="wrap sec">
        <div className="rev-head">
          <p className="kicker">{kicker || 'Opinie klientek'}</p>
          <h2 className="h2">{heading || 'Co mówią klientki'}</h2>
        </div>

        <div
          className="rev-carousel"
          onTouchStart={(e) => {
            touchX.current = e.touches[0].clientX
          }}
          onTouchEnd={(e) => {
            if (touchX.current === null) return
            const dx = e.changedTouches[0].clientX - touchX.current
            if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1))
            touchX.current = null
          }}
        >
          {count > 1 && (
            <button
              type="button"
              className="rev-arrow rev-prev"
              aria-label="Poprzednia opinia"
              onClick={() => go(i - 1)}
            >
              ‹
            </button>
          )}

          <div className="rev-viewport" aria-live="polite">
            {reviews.map((r, idx) => (
              <figure
                key={idx}
                className={`rev rev-slide ${idx === i ? 'is-active' : ''}`}
                aria-hidden={idx === i ? undefined : true}
              >
                <div className="stars" aria-label={`Ocena ${r.rating || 5} na 5`}>
                  {'★'.repeat(r.rating || 5)}
                </div>
                <blockquote className="rev-q">{r.quote}</blockquote>
                {r.author && <figcaption className="rev-name">{r.author}</figcaption>}
              </figure>
            ))}
          </div>

          {count > 1 && (
            <button
              type="button"
              className="rev-arrow rev-next"
              aria-label="Następna opinia"
              onClick={() => go(i + 1)}
            >
              ›
            </button>
          )}
        </div>

        {count > 1 && (
          <div className="rev-dots" role="tablist" aria-label="Wybierz opinię">
            {reviews.map((_, idx) => (
              <button
                key={idx}
                type="button"
                role="tab"
                aria-selected={idx === i}
                aria-label={`Opinia ${idx + 1} z ${count}`}
                className={`rev-dot ${idx === i ? 'is-active' : ''}`}
                onClick={() => go(idx)}
              />
            ))}
          </div>
        )}

        <div className="google-note">
          <span aria-hidden="true">★</span>
          <span>Opinie pochodzą z wizytówki Google</span>
          {googleReviewUrl && (
            <a
              href={googleReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rev-google-link"
            >
              Wystaw opinię
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
