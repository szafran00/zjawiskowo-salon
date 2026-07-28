// Numerowane karty wyróżników („Dlaczego ZJAWISKOWO” na stronie głównej,
// „Co mnie wyróżnia” na stronie O mnie). Treść zawsze z panelu.
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
              <div className="why-num" aria-hidden="true">
                {i + 1}
              </div>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
