import Kwiatuszek from './Kwiatuszek'

// Logotyp salonu, wariant „Pozioma" z księgi znaku (Logo.pdf) — ten sam, który
// księga wskazuje wprost do użycia w nagłówku strony i w cenniku: znak po lewej,
// obok niego trzy linijki wyśrodkowane względem siebie.
//
// Kolejność i proporcje są narzucone przez księgę („nie rozciągać, nie zmieniać
// proporcji ani kolejności elementów"), dlatego lockup siedzi w jednym miejscu,
// a nie jest składany osobno w nagłówku i w stopce.
//
// Podpis przychodzi z panelu jako jedno pole („Salon Kosmetyczny · Depilacja
// laserowa"). Rozdzielamy je na kropce: pierwsza część idzie złotem, druga
// między kreski. Gdy klientka wpisze podpis bez kropki, zostaje jedna linijka.
export default function Logotyp({
  name,
  subtitle,
  variant = 'light',
}: {
  name: string
  subtitle?: string
  /** 'dark' = na ciemnym tle (stopka). */
  variant?: 'light' | 'dark'
}) {
  const [gora, dol] = (subtitle || '')
    .split('·')
    .map((s) => s.trim())
    .filter(Boolean)

  return (
    <span className={`logotyp ${variant === 'dark' ? 'logotyp-dark' : ''}`}>
      <Kwiatuszek size={44} outline={variant === 'dark' ? '#F4EEE2' : '#2C2722'} />
      <span className="logotyp-text">
        <b>{name}</b>
        {gora && <small className="logotyp-sub">{gora}</small>}
        {dol && (
          <small className="logotyp-rule">
            <i aria-hidden="true" />
            {dol}
            <i aria-hidden="true" />
          </small>
        )}
      </span>
    </span>
  )
}
