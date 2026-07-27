import Link from 'next/link'

// Duży przycisk telefonu — główne wezwanie do działania na stronie.
// Klientka umawia wizyty telefonicznie, więc numer ma być trudny do przeoczenia.
export default function PhoneCta({
  phone,
  heading,
  lead,
  hint,
}: {
  phone: string
  heading: string
  lead?: string
  hint?: string
}) {
  const tel = 'tel:' + phone.replace(/\s/g, '')
  return (
    <section className="cta-band reveal">
      <div className="wrap">
        <h2 className="h2">{heading}</h2>
        {lead && (
          <p className="lead" style={{ maxWidth: 560, margin: '12px auto 26px' }}>
            {lead}
          </p>
        )}
        <div className="cta-actions">
          <a href={tel} className="btn btn-cta btn-phone">
            Zadzwoń <span className="tel-num">{phone}</span>
          </a>
          <Link href="/kontakt" className="btn btn-ghost">
            Formularz kontaktowy
          </Link>
        </div>
        <p className="phone-hint">
          {hint || 'Nie odbieram, gdy trwa zabieg. Oddzwonię, gdy tylko skończę.'}
        </p>
      </div>
    </section>
  )
}
