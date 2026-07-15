'use client'

// Link do ponownego otwarcia okna zgody Cookiebot (działa gdy Cookiebot jest włączony).
export default function CookieSettings() {
  return (
    <button
      type="button"
      className="btn btn-ghost"
      onClick={() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const cb = (window as any).Cookiebot
        if (cb && typeof cb.renew === 'function') cb.renew()
      }}
    >
      Zmień ustawienia cookies
    </button>
  )
}
