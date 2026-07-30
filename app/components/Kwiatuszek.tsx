// Znak graficzny salonu: kwiatuszek, wariant B „Dwie warstwy" wybrany przez
// klientkę. Rysowany w kodzie, a nie wczytywany jako plik, bo pojawia się
// kilka razy na stronie i bywa barwiony pod tło (stopka jest ciemna).
//
// Bez <defs> i <use>: ten sam znak renderuje się na stronie wielokrotnie,
// a powtórzone identyfikatory w SVG kolidowałyby ze sobą.

const PET_OUT = 'M100,74 C118,64 120,40 100,22 C80,40 82,64 100,74 Z'
const PET_IN = 'M100,76 C110,68 112,54 100,44 C88,54 90,68 100,76 Z'
const OUT_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315]
const IN_ANGLES = [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5]

export default function Kwiatuszek({
  size = 40,
  className,
  /** Kolor konturu zewnętrznego; złoto wewnętrzne zostaje bez zmian. */
  outline = '#2c2722',
  gold = '#B28A3C',
}: {
  size?: number
  className?: string
  outline?: string
  gold?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" stroke={outline} strokeWidth="1.7" strokeLinejoin="round">
        {OUT_ANGLES.map((a) => (
          <path key={a} d={PET_OUT} transform={`rotate(${a} 100 100)`} />
        ))}
      </g>
      <g fill="none" stroke={gold} strokeWidth="1.5" strokeLinejoin="round">
        {IN_ANGLES.map((a) => (
          <path key={a} d={PET_IN} transform={`rotate(${a} 100 100)`} />
        ))}
      </g>
      <circle cx="100" cy="100" r="23" fill="none" stroke={outline} strokeWidth="1.7" />
    </svg>
  )
}
