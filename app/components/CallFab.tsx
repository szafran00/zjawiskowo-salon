// Przyklejony przycisk telefonu, widoczny wyłącznie na wąskich ekranach (CSS).
// Rezerwacja jest tylko telefoniczna, więc numer zostaje w zasięgu kciuka.
export default function CallFab({ phone }: { phone: string }) {
  if (!phone) return null
  const tel = 'tel:' + phone.replace(/\s/g, '')
  return (
    <a href={tel} className="callfab btn btn-cta">
      Zadzwoń: {phone}
    </a>
  )
}
