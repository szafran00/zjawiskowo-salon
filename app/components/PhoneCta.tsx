import { pl } from '@/app/lib/typografia'

// Złoty pasek z numerem — główne wezwanie do działania, zamyka każdą podstronę.
// Klientka umawia wizyty telefonicznie, więc numer ma być trudny do przeoczenia.
export default function PhoneCta({
  phone,
  kicker,
  heading,
  lead,
  hint,
}: {
  phone: string
  kicker?: string
  heading: string
  lead?: string
  hint?: string
}) {
  const tel = 'tel:' + phone.replace(/\s/g, '')
  return (
    <section className="phonebar reveal">
      <div className="wrap phonebar-in">
        {kicker && <p className="kicker">{kicker}</p>}
        <h2 className="h2">{heading}</h2>
        {lead && <p className="lead">{pl(lead)}</p>}
        <a href={tel} className="btn btn-phone">
          <span className="tel-num">{phone}</span>
        </a>
        {hint && <p className="phone-hint">{pl(hint)}</p>}
      </div>
    </section>
  )
}
