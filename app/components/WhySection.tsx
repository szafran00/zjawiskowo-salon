import Kwiatuszek from './Kwiatuszek'
import { pl } from '@/app/lib/typografia'

// Karty wyróżników („Dlaczego ZJAWISKOWO” na stronie głównej, „Co mnie
// wyróżnia” na stronie O mnie). Zamiast numerów znak graficzny salonu.
// Treść zawsze z panelu.
export default function WhySection({
  kicker,
  heading,
  items,
  id,
}: {
  kicker?: string
  heading?: string
  items: string[]
  id?: string
}) {
  if (!items.length) return null
  return (
    <section className="sec why reveal" id={id}>
      <div className="wrap">
        {(kicker || heading) && (
          <div className="faq-head" style={{ marginBottom: 0 }}>
            {kicker && <p className="kicker">{kicker}</p>}
            {heading && <h2 className="h2">{heading}</h2>}
          </div>
        )}
        <div className="why-grid">
          {items.map((text, i) => (
            <div className="why-card" key={i}>
              <div className="why-num">
                <Kwiatuszek size={44} />
              </div>
              <p>{pl(text)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
