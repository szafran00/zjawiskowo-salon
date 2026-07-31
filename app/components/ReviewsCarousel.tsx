'use client'

import { useCallback, useRef, useState } from 'react'
import type { Review } from '../lib/types'
import { pl } from '@/app/lib/typografia'

// Karuzela opinii: przesuwa się pojedynczo (strzałki, kropki, gest na ekranie
// dotykowym). Pojedyncze opinie ukrywa się w panelu — odfiltrowuje je zapytanie
// do Sanity, więc tutaj wystarczy wyświetlić to, co przyszło.
//
// Bez automatycznego przewijania — tak jest w projekcie, a przy okazji znika
// problem z WCAG 2.2.2: na ekranie dotykowym nie ma najechania ani fokusu,
// więc samoprzesuwającej się karuzeli nie dałoby się zatrzymać.
export default function ReviewsCarousel({
  reviews,
  kicker,
  heading,
  note,
  googleReviewUrl,
}: {
  reviews: Review[]
  kicker?: string
  heading?: string
  /** Puste = dopisek pod opiniami się nie pokazuje. */
  note?: string | null
  googleReviewUrl?: string
}) {
  const noteText = note ?? 'Opinie pochodzą z wizytówki Google'
  const [i, setI] = useState(0)
  const count = reviews.length
  const touchX = useRef<number | null>(null)

  const go = useCallback(
    (next: number) => setI(((next % count) + count) % count),
    [count]
  )

  if (!count) return null

  return (
    <section className="reviews reveal" id="opinie">
      <div className="wrap sec">
        <div className="rev-head">
          <p className="kicker">{kicker || 'Opinie klientek'}</p>
          <h2 className="h2">{heading || 'Co mówią klientki'}</h2>
        </div>

        <div
          className="carousel"
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
              className="car-btn"
              aria-label="Poprzednia opinia"
              onClick={() => go(i - 1)}
            >
              ‹
            </button>
          )}

          <div className="car-view" aria-live="polite">
            {reviews.map((r, idx) => (
              <figure
                key={idx}
                className={`rev-card ${idx === i ? 'is-active' : ''}`}
                aria-hidden={idx === i ? undefined : true}
              >
                <div className="stars" aria-label={`Ocena ${r.rating || 5} na 5`}>
                  {'★'.repeat(r.rating || 5)}
                </div>
                <blockquote className="rev-q">{pl(r.quote)}</blockquote>
                {r.author && <figcaption className="rev-name">{r.author}</figcaption>}
              </figure>
            ))}
          </div>

          {count > 1 && (
            <button
              type="button"
              className="car-btn"
              aria-label="Następna opinia"
              onClick={() => go(i + 1)}
            >
              ›
            </button>
          )}
        </div>

        {/* Zwykłe przyciski, nie role="tab": zakładki bez powiązanych paneli
            czytnik ekranu ogłasza jako „zakładka 1 z 5”, która donikąd nie prowadzi. */}
        {count > 1 && (
          <div className="dots">
            {reviews.map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-current={idx === i ? 'true' : undefined}
                aria-label={`Pokaż opinię ${idx + 1} z ${count}`}
                className={`dot ${idx === i ? 'on' : ''}`}
                onClick={() => go(idx)}
              />
            ))}
          </div>
        )}

        {(noteText || googleReviewUrl) && (
          <div className="google-note">
            {noteText && <span>{noteText}</span>}
            {googleReviewUrl && (
              <>
                {noteText && <span aria-hidden="true">·</span>}
                <a href={googleReviewUrl} target="_blank" rel="noopener noreferrer">
                  Wystaw opinię
                </a>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
