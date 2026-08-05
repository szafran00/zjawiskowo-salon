import Link from 'next/link'
import { sanityFetch } from '@/sanity/lib/fetch'
import { TERMS_QUERY } from '@/sanity/lib/queries'
import type { Terms } from '@/app/lib/types'
import PageHead from '@/app/components/PageHead'

export const metadata = {
  title: 'Polityka prywatności i cookies — ZJAWISKOWO',
  description:
    'Zasady przetwarzania danych osobowych i korzystania z plików cookies na stronie salonu ZJAWISKOWO w Krzeszowicach.',
}

// Treść dokumentu nie ma osobnego typu w panelu (schemat termsPage niesie tylko
// wstęp), więc zostaje w kodzie. Warstwę wizualną wyrównano do reszty stron.
const SECTIONS = [
  { id: 'administrator', title: '1. Administrator danych' },
  { id: 'zakres', title: '2. Jakie dane zbieramy i w jakim celu' },
  { id: 'odbiorcy', title: '3. Odbiorcy danych' },
  { id: 'cookies', title: '4. Pliki cookies' },
  { id: 'okres', title: '5. Okres przechowywania' },
  { id: 'prawa', title: '6. Twoje prawa' },
  { id: 'kontakt', title: '7. Kontakt' },
]

export default async function PrivacyPage() {
  // Sama treść dokumentu zostaje w kodzie (wymaga weryfikacji prawnej),
  // ale jej nagłówek jest edytowalny w panelu, w dokumencie „Regulamin”.
  let t: Terms | null = null
  try {
    t = await sanityFetch<Terms>(TERMS_QUERY)
  } catch {
    t = null
  }

  return (
    <>
      <PageHead
        crumbs={[
          { label: 'Strona główna', href: '/' },
          { label: 'Polityka prywatności' },
        ]}
        kicker={t?.privacyKicker || 'Dokumenty'}
        title={t?.privacyHeading || 'Polityka prywatności i plików cookies'}
      />

      <section className="sec">
        <div className="wrap">
          <div className="legal-nav">
            <Link href="/regulamin">Regulamin</Link>
            <Link href="/polityka-prywatnosci" className="active" aria-current="page">
              Polityka prywatności
            </Link>
          </div>

          <nav className="legal-toc" aria-label="Spis treści">
            <strong>Spis treści</strong>
            <ol>
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`}>{s.title.replace(/^\d+\.\s*/, '')}</a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="prose">
            <h3 id="administrator">1. Administrator danych</h3>
            <p>
              Administratorem danych jest Salon Kosmetyczny ZJAWISKOWO Marta Pikul,
              ul. 3 Maja 4, 32-065 Krzeszowice, NIP 676-207-35-90, tel.{' '}
              <a href="tel:517899229">517 899 229</a>.
            </p>

            <h3 id="zakres">2. Jakie dane zbieramy i w jakim celu</h3>
            <p>
              Jeśli umawiasz się telefonicznie, przetwarzamy podane przez Ciebie dane
              (imię, numer telefonu oraz informacje potrzebne do umówienia i
              wykonania zabiegu) wyłącznie w celu obsługi wizyty. Podstawą
              przetwarzania jest podjęcie działań na Twoje żądanie oraz nasz prawnie
              uzasadniony interes (art. 6 ust. 1 lit. b i f RODO).
            </p>

            <h3 id="odbiorcy">3. Odbiorcy danych</h3>
            <p>
              Danych podanych przy umawianiu wizyty nie udostępniamy osobom trzecim.
              Samą stronę internetową utrzymuje dostawca hostingu, a jej treść
              dostawca systemu zarządzania treścią; podmioty te przetwarzają
              wyłącznie dane techniczne niezbędne do wyświetlenia strony. Osadzona
              mapa Google uruchamia się dopiero po wyrażeniu przez Ciebie zgody.
            </p>

            <h3 id="cookies">4. Pliki cookies</h3>
            <p>
              Strona używa niezbędnych plików cookies zapewniających jej poprawne
              działanie. Treści zewnętrzne ustawiające cookies (np. mapa Google) oraz
              ewentualne statystyki uruchamiają się dopiero po wyrażeniu zgody. Zgodę
              możesz w każdej chwili zmienić przez „Ustawienia cookies” w stopce
              strony.
            </p>

            <h3 id="okres">5. Okres przechowywania</h3>
            <p>
              Dane z zapytań przechowujemy przez czas niezbędny do obsługi sprawy, a
              następnie przez okres wynikający z przepisów lub do czasu wniesienia
              skutecznego sprzeciwu.
            </p>

            <h3 id="prawa">6. Twoje prawa</h3>
            <p>
              Masz prawo dostępu do swoich danych, ich sprostowania, usunięcia,
              ograniczenia przetwarzania, przenoszenia oraz wniesienia sprzeciwu, a
              także prawo wniesienia skargi do Prezesa Urzędu Ochrony Danych
              Osobowych (ul. Stawki 2, 00-193 Warszawa).
            </p>

            <h3 id="kontakt">7. Kontakt</h3>
            <p>
              W sprawach dotyczących danych osobowych zadzwoń pod numer{' '}
              <a href="tel:517899229">517 899 229</a>.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
