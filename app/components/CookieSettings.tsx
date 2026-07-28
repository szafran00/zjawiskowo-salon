'use client'

// Przycisk w stopce do ponownego otwarcia zgody na cookies.
// Cookiebot → renew(); własny pasek → zdarzenie 'open-cookie-settings'.
export default function CookieSettings() {
  return (
    <button
      type="button"
      onClick={() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const cb = (window as any).Cookiebot
        if (cb && typeof cb.renew === 'function') cb.renew()
        else window.dispatchEvent(new Event('open-cookie-settings'))
      }}
    >
      Ustawienia cookies
    </button>
  )
}
