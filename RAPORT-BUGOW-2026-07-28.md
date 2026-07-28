# Raport testów UI / UX / funkcjonalnych

Data: 28.07.2026
Testowany build: commit `23df3bf` („Treści dodane w redesignie edytowalne w panelu + braki dostępności")
Priorytet testów: mobile, następnie przeglądarka desktopowa

## Jak testowano

Playwright, trzy profile urządzeń, wszystkie 10 podstron:

| Profil | Silnik | Rozdzielczość |
| --- | --- | --- |
| Pixel 5 | Chromium | 393 × 727 |
| iPhone 13 | WebKit (Safari) | 390 × 664 |
| desktop | Chromium | 1280 × 800 |

Dodatkowo szerokości 320, 360, 375, 390 i 414 px oraz wariant z wyłączonym JavaScriptem.

Uwaga metodyczna: podczas sesji `.next` był trzykrotnie przebudowywany pod działającym serwerem, co psuło hydrację i dawało fałszywe wyniki. Wszystkie liczby poniżej pochodzą z jednego, sprawnego przebiegu na commicie `23df3bf`, po restarcie serwera. Ustalenia z popsutych przebiegów zostały odrzucone.

---

## Podsumowanie

| Waga | Liczba |
| --- | --- |
| Krytyczne (blokują publikację) | 2 |
| Wysokie | 5 |
| Średnie | 11 |
| Operacyjne (proces, nie kod) | 1 |

Stan ogólny jest dobry. Warstwa wizualna, responsywność i logika zgody na cookies działają poprawnie. Problemy skupiają się w trzech obszarach: niedokończone treści, dostępność sterowania dotykiem i klawiaturą oraz braki SEO.

---

## Krytyczne

### K1. Treści zastępcze widoczne na wszystkich 10 podstronach

Placeholdery redakcyjne renderują się na produkcyjnej stronie. Dotknięte są wszystkie podstrony.

Znalezione ciągi:

- `[numer do uzupełnienia]` w adresie w stopce, czyli na każdej podstronie: „ul. 3 Maja [numer do uzupełnienia], 32-065 Krzeszowice"
- `[Do uzupełnienia przez Martę: kilka zdań o drodze zawodowej…]` na `/o-mnie`
- `[Do uzupełnienia przez Martę: dlaczego salon powstał tutaj…]` na `/o-mnie`
- `[Do uzupełnienia przez Martę: formy płatności, czy możliwa jest wysyłka…]` na `/vouchery`
- `[do ustalenia, np. 6 miesięcy od daty zakupu]` na `/vouchery`, dotyczy terminu ważności vouchera

Odtworzenie: wejść na dowolną podstronę i przewinąć do stopki.

### K2. Regulamin oznaczony jako dokument roboczy, z trzema lukami

Na `/regulamin` widnieje wprost: `[Dokument roboczy, treść przykładowa do uzupełnienia i weryfikacji prawnej przed publikacją.]`

Nieuzupełnione punkty:

- `[Do uzupełnienia: konsekwencje późnego odwołania lub niestawienia się, ewentualny zadatek przy dłuższych zabiegach.]`
- `[Do uzupełnienia: zasady przy rezygnacji z rozpoczętego pakietu.]`
- `[Do uzupełnienia: zasady dotyczące dzieci, zwierząt, rzeczy wartościowych.]`

To nie jest wyłącznie kwestia wyglądu. Regulamin i polityka prywatności są dokumentami, na które strona się powołuje przy formularzu kontaktowym i zgodzie na cookies, więc ich niekompletność niesie ryzyko prawne.

Plik: `app/(site)/regulamin/page.tsx:101`

---

## Wysokie

### W1. Strona 404 jest domyślna, angielska i bez wyjścia

| Sprawdzenie | Wynik |
| --- | --- |
| Status HTTP | 404, poprawny |
| Tytuł | `404: This page could not be found.` |
| Nagłówek strony | brak |
| Stopka | brak |
| Link do strony głównej | brak |
| Cała treść | „404 / This page could not be found." |

Klientka, która trafi na nieaktualny adres, na przykład ze starego posta lub wizytówki, zobaczy angielski komunikat i nie będzie miała żadnego odnośnika dalej. Brakuje `app/not-found.tsx`.

Odtworzenie: `http://localhost:3000/dowolny-zly-adres`

### W2. Menu mobilne nie przejmuje fokusu klawiatury

Panel menu leży w DOM przed przyciskiem hamburgera. Po otwarciu fokus zostaje na przycisku, więc TAB w przód idzie do treści strony pod panelem, a nie do pozycji menu.

| Pomiar | Pixel 5 | iPhone 13 |
| --- | --- | --- |
| Panel otwiera się poprawnie | tak | tak |
| Fokus po otwarciu trafia do panelu | nie | nie |
| Ile TAB w przód, by wejść do menu | nie osiągnięto w 40 krokach | 20 |
| Ile SHIFT+TAB wstecz, by wejść do menu | 1 | 1 |
| ESC zamyka panel | tak | tak |
| ESC przywraca fokus na hamburger | nie | nie |

Brakuje też `role="dialog"` i `aria-modal` na panelu oraz pułapki fokusu. Pod panelem nie ma przyciemnienia, więc tło pozostaje aktywne. Atrybut `aria-controls="menu-glowne"` już jest, został dodany w ostatnim commicie.

Plik: `app/components/Header.tsx:119`

### W3. 53 elementy dotykowe poniżej progu 44 × 44 px

Próg z WCAG 2.5.5 i wytycznych Apple. Najpoważniejsze przypadki:

| Element | Rozmiar | Zasięg |
| --- | --- | --- |
| Kropki karuzeli opinii | 9 × 9 px, aktywna 11 × 11 | strona główna |
| Przycisk hamburgera | 40 × 32 px | wszystkie 10 stron |
| Strzałki karuzeli | 42 × 42 px | strona główna |
| Linki nawigacyjne w stopce | wysokość 15–16 px | wszystkie 10 stron |
| „Ustawienia cookies" w stopce | 129 × 16 px | wszystkie 10 stron |
| „Zobacz ceny →" w skrócie cennika | 299 × 17 px | strona główna |
| Spis treści na `/regulamin` i `/polityka-prywatnosci` | wysokość 18 px | 2 strony |

Kropki karuzeli o boku 9 px są praktycznie nietrafialne kciukiem. Hamburger jest głównym elementem nawigacji na telefonie, więc jego rozmiar waży najwięcej.

### W4. Pola formularza kontaktowego nie mają dostępnej nazwy

Etykiety `<label>` stoją obok pól, ale nie są z nimi powiązane. Brakuje `id` na polu i `htmlFor` na etykiecie.

| Pole | Ma `id` | Powiązana etykieta | Dostępna nazwa |
| --- | --- | --- | --- |
| `name` | nie | nie | nie |
| `phone` | nie | nie | nie |
| `message` | nie | nie | nie |

Skutki potwierdzone w działającej przeglądarce: kliknięcie w etykietę nie ustawia fokusu w polu (fokus zostaje na `body`), a czytnik ekranu nie odczyta nazwy pola. Jedyną wskazówką jest placeholder, który znika po rozpoczęciu pisania.

Plik: `app/components/ContactForm.tsx:70-81`

### W5. Brak `og:image` na wszystkich stronach

Tagi `og:title`, `og:description`, `og:locale` i `twitter:card` są ustawione, ale obrazka nie ma na żadnej z 10 podstron. Link wysłany na Facebooku, Messengerze lub WhatsAppie pokaże kartę bez zdjęcia. Dla lokalnego salonu to główny kanał polecania.

Plik: `app/layout.tsx:14` (sekcja `openGraph` bez klucza `images`)

---

## Średnie

### S1. Karuzela opinii przewija się sama i nie da się jej zatrzymać

Slajd zmienia się co 6,5 sekundy (`AUTO_MS = 6500`). Nie ma przycisku pauzy ani zatrzymania na najechaniu lub fokusie. WCAG 2.2.2 (poziom A) wymaga mechanizmu zatrzymania dla treści, która sama się zmienia dłużej niż 5 sekund. Potwierdzone na obu silnikach mobilnych.

Plik: `app/components/ReviewsCarousel.tsx:40`

### S2. Karuzela: wzorzec ARIA jest niekompletny

Jest `role="tablist"` i 5 elementów `role="tab"`, ale zero `role="tabpanel"` i zero zakładek z `aria-controls`. Czytnik ekranu ogłosi „zakładka 1 z 5", która nie prowadzi do żadnego panelu.

Plik: `app/components/ReviewsCarousel.tsx:113-118`

### S3. Komunikat po wysłaniu formularza nie jest ogłaszany

Na `/kontakt` nie ma żadnego obszaru `aria-live` ani `role="status"`. Komunikat „Dziękujemy! Odezwiemy się…" pojawia się wizualnie, ale osoba korzystająca z czytnika ekranu nie dostanie informacji, czy wysyłka się udała.

Plik: `app/components/ContactForm.tsx:94-106`

### S4. Formularz melduje sukces bez potwierdzenia wysyłki

W wariancie bez `formEndpoint` formularz otwiera `mailto:` i od razu ustawia status `ok` z komunikatem „Dziękujemy! Odezwiemy się najszybciej jak to możliwe." Jeśli na urządzeniu nie ma skonfigurowanego klienta poczty, nic nie zostanie wysłane, a klientka zobaczy potwierdzenie. Lepszy komunikat: „Otworzyliśmy Twój program pocztowy. Wyślij wiadomość, żeby dokończyć."

Plik: `app/components/ContactForm.tsx:46-54`

### S5. Pole telefonu przyjmuje dowolny tekst

Wpisanie `abc-nie-telefon` przechodzi walidację. Pole ma `type="tel"`, który sam z siebie niczego nie sprawdza, i nie ma atrybutu `pattern`.

### S6. Brak adresu kanonicznego

Żadna z 10 podstron nie ma `<link rel="canonical">`. Przy wariantach adresu, na przykład z parametrami z kampanii, grozi to rozmyciem sygnałów w wyszukiwarce.

### S7. Brak `robots.txt` i `sitemap.xml`

Oba zwracają 404. Next.js obsługuje to plikami `app/robots.ts` i `app/sitemap.ts`.

### S8. Brak danych strukturalnych

Zero bloków JSON-LD na wszystkich stronach. Dla salonu działającego lokalnie schemat `LocalBusiness` lub `BeautySalon` z adresem, godzinami otwarcia i telefonem jest jednym z mocniejszych sygnałów w wyszukiwarce lokalnej i w Mapach Google.

### S9. Obrazki bez wymiarów, bez leniwego ładowania i bez `srcset`

Wszystkie 17 obrazków na stronie:

| Cecha | Liczba |
| --- | --- |
| Bez `width` i `height` | 17 z 17 |
| Bez `loading="lazy"` | 17 z 17 |
| Bez `srcset` | 17 z 17 |

Brak wymiarów oznacza przeskakiwanie układu przy ładowaniu, co obniża wynik CLS. Brak leniwego ładowania sprawia, że zdjęcia z galerii, leżące ponad 7000 px poniżej krawędzi ekranu, pobierają się od razu przy wejściu na stronę.

### S10. Wszystkie zdjęcia pochodzą z zewnętrznego serwisu, a fonty z serwerów Google

17 z 17 obrazków ładuje się z `images.pexels.com`, a kroje pisma z `fonts.googleapis.com` i `fonts.gstatic.com`. Dwie konsekwencje:

- Prywatność: połączenia do serwerów zewnętrznych następują przed decyzją o zgodzie na cookies, bo znacznik `<link>` do fontów siedzi w `app/layout.tsx:42`. Adres IP odwiedzającego trafia do Google zanim cokolwiek kliknie.
- Wydajność: pominięta jest optymalizacja `next/image`, a fonty blokują renderowanie. Mechanizm `next/font` serwuje kroje z własnej domeny i usuwa oba problemy.

Osobno warto rozważyć, czy docelowo na stronie salonu mają zostać zdjęcia stockowe, czy własne wnętrze i efekty zabiegów.

### S11. Przeskok poziomu nagłówka na `/regulamin`

Po `h1` następuje `h3`, z pominięciem `h2`. Pozostałe 9 podstron ma poprawną hierarchię.

---

## Operacyjne

### O1. Przebudowa `.next` pod działającym `next start` zabija stronę

To najpoważniejsze ustalenie procesowe i przyczyna stanu, w jakim zastałem serwer na porcie 3000.

`next start` wczytuje manifest builda przy starcie procesu. Uruchomienie `npm run build` bez restartu serwera sprawia, że serwowany HTML wskazuje na stare nazwy chunków, których nie ma już na dysku:

```
HTML żąda:    /_next/static/chunks/3276-c9788b6f1f428805.js  →  400
na dysku jest: /_next/static/chunks/3276-263f289d69158e3f.js
```

Objaw jest zdradliwy: strona wygląda całkowicie normalnie, bo HTML renderuje się po stronie serwera, ale React się nie hydruje i przestaje działać wszystko, co interaktywne. Menu się nie otwiera, FAQ się nie rozwija, pasek zgody na cookies w ogóle się nie pojawia. W konsoli nie ma ani jednego błędu.

Zaobserwowane trzy razy w trakcie tej sesji. Serwer na porcie 3000 był w tym stanie od początku testów.

Zalecenie do `DEPLOY.md`: po każdym `npm run build` restartować proces `next start`. Sensowna jest też jedna komenda `npm run build && npm run start`, żeby nie dało się rozjechać tych kroków.

---

## Co przeszło testy bez zastrzeżeń

Warto to odnotować, bo są to obszary, które zwykle sprawiają kłopoty:

| Obszar | Wynik |
| --- | --- |
| Przewijanie w poziomie | 0 naruszeń na szerokościach 320, 360, 375, 390 i 414 px, na wszystkich 10 stronach |
| Kontrast tekstu | 0 naruszeń względem WCAG AA |
| Działanie bez JavaScriptu | pełna treść widoczna, wszystkie 8 odpowiedzi FAQ czytelne, nawigacja i telefon dostępne |
| Zgoda na cookies | mapa Google ładuje się wyłącznie po akceptacji, wybór trwały po przeładowaniu, „tylko niezbędne" nie włącza mapy |
| Pasek telefonu na dole | nie zasłania żadnego elementu stopki po przewinięciu na koniec strony |
| Błędy konsoli | 0 na wszystkich 10 stronach |
| Tytuły i opisy stron | unikalne, bez duplikatów, długości w rozsądnym zakresie |
| Widoczny fokus | pierścień 2 px obecny |
| Menu, FAQ i karuzela na dotyk | działają na Chromium i WebKit, w każdym wariancie wejścia na stronę |
| `lang="pl"`, meta viewport | poprawne |
| Przekierowanie `/o-salonie` → `/o-mnie` | działa |

Animacje wejścia sekcji są zrobione poprawnie: klasa `reveal-ready` dodawana jest z JavaScriptu, więc przy wyłączonym skrypcie treść pozostaje widoczna zamiast zniknąć. Obsłużone jest też `prefers-reduced-motion`.

---

## Proponowana kolejność poprawek

1. K1 i K2, czyli uzupełnienie treści. Bez tego strony nie da się opublikować.
2. W1, strona 404 po polsku z nawigacją. Mała zmiana, duży efekt.
3. W3 i W4, rozmiary elementów dotykowych i etykiety formularza. Największy zysk dla realnych użytkowniczek na telefonie.
4. W5, S6, S7 i S8, czyli pakiet SEO. Razem to jedna sesja pracy.
5. W2, S1, S2 i S3, czyli dostępność sterowania.
6. S9 i S10, obrazki i fonty. Przy okazji decyzja o zdjęciach własnych zamiast stockowych.
