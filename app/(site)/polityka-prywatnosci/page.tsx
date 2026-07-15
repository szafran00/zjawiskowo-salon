export const metadata = {
  title: 'Polityka prywatności i cookies — ZJAWISKOWO',
}

export default function PrivacyPage() {
  return (
    <section className="sec reveal">
      <div className="wrap" style={{ maxWidth: 820 }}>
        <div className="page-head" style={{ alignItems: 'flex-start', textAlign: 'left' }}>
          <p className="kicker">Informacje prawne</p>
          <h1 className="h2">Polityka prywatności i plików cookies</h1>
        </div>

        <div className="svc-desc">
          <p style={{ color: 'var(--muted)', fontSize: 13 }}>
            [Dokument roboczy — do weryfikacji prawnej przed publikacją. Uzupełnij pola w nawiasach.]
          </p>

          <h3>1. Administrator danych</h3>
          <p>
            Administratorem danych jest Salon Kosmetyczny ZJAWISKOWO,
            [pełna nazwa i adres], NIP [NIP], e-mail [e-mail], tel. 517 899 229.
          </p>

          <h3>2. Jakie dane zbieramy i w jakim celu</h3>
          <p>
            Jeśli korzystasz z formularza kontaktowego, przetwarzamy podane przez
            Ciebie dane (imię, numer telefonu oraz treść wiadomości) wyłącznie w
            celu udzielenia odpowiedzi na zapytanie i umówienia wizyty. Podstawą
            przetwarzania jest nasz prawnie uzasadniony interes oraz podjęcie
            działań na Twoje żądanie (art. 6 ust. 1 lit. b i f RODO).
          </p>

          <h3>3. Odbiorcy danych</h3>
          <p>
            Wiadomości z formularza obsługuje dostawca usługi Formspree
            (Formspree, Inc.), który w naszym imieniu przekazuje treść zgłoszenia
            na nasz adres e-mail. Stronę utrzymuje dostawca hostingu. Podmioty te
            przetwarzają dane wyłącznie w zakresie niezbędnym do świadczenia usługi.
          </p>

          <h3>4. Pliki cookies</h3>
          <p>
            Strona używa niezbędnych plików cookies zapewniających jej poprawne
            działanie. Treści zewnętrzne ustawiające cookies (np. mapa Google)
            oraz ewentualne statystyki uruchamiają się dopiero po wyrażeniu zgody.
            Zgodę możesz w każdej chwili zmienić przez „Ustawienia cookies" w
            stopce strony.
          </p>

          <h3>5. Okres przechowywania</h3>
          <p>
            Dane z zapytań przechowujemy przez czas niezbędny do obsługi sprawy,
            a następnie przez okres wynikający z przepisów lub do czasu wniesienia
            skutecznego sprzeciwu.
          </p>

          <h3>6. Twoje prawa</h3>
          <p>
            Masz prawo dostępu do swoich danych, ich sprostowania, usunięcia,
            ograniczenia przetwarzania, przenoszenia oraz wniesienia sprzeciwu, a
            także prawo wniesienia skargi do Prezesa Urzędu Ochrony Danych
            Osobowych (ul. Stawki 2, 00-193 Warszawa).
          </p>

          <h3>7. Kontakt</h3>
          <p>
            W sprawach dotyczących danych osobowych napisz na [e-mail] lub zadzwoń
            pod numer 517 899 229.
          </p>
        </div>
      </div>
    </section>
  )
}
