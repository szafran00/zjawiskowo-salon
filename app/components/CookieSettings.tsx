'use client'

// Link w stopce do ponownego otwarcia zgody na cookies.
// Cookiebot → renew(); własny popup → event 'open-cookie-settings'.
export default function CookieSettings() {
  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const cb = (window as any).Cookiebot
        if (cb && typeof cb.renew === 'function') cb.renew()
        else window.dispatchEvent(new Event('open-cookie-settings'))
      }}
    >
      Ustawienia cookies
    </a>
  )
}
