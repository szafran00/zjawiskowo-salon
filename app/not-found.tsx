import Link from 'next/link'

export const metadata = {
  title: 'Nie znaleziono strony — ZJAWISKOWO Krzeszowice',
}

// Domyślna strona 404 Next.js jest po angielsku i nie ma żadnego wyjścia.
// Klientka trafia tu ze starego odnośnika, więc musi dostać drogę dalej.
export default function NotFound() {
  return (
    <div className="shell">
      <section className="sec">
        <div className="wrap" style={{ maxWidth: 640, textAlign: 'center' }}>
          <p className="kicker">Błąd 404</p>
          <h1 className="h2" style={{ margin: '12px 0 16px' }}>
            Tej strony nie ma
          </h1>
          <p className="lead">
            Adres jest nieaktualny albo zawiera literówkę. Poniżej znajdziesz
            najczęściej odwiedzane miejsca.
          </p>
          <div
            className="btn-row"
            style={{ justifyContent: 'center', marginTop: 28 }}
          >
            <Link href="/" className="btn btn-cta">
              Strona główna
            </Link>
            <Link href="/cennik" className="btn btn-ghost">
              Cennik
            </Link>
            <Link href="/kontakt" className="btn btn-ghost">
              Kontakt
            </Link>
          </div>
          <p className="lead" style={{ marginTop: 28, fontSize: 15 }}>
            Wizyty umawiamy telefonicznie:{' '}
            <a href="tel:517899229" style={{ fontWeight: 600 }}>
              517 899 229
            </a>
          </p>
        </div>
      </section>
    </div>
  )
}
