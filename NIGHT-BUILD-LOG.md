# Night build — 2026-07-27

Gałąź: `night-build-2026-07-27`. Nie deployowano, nie ruszano domen ani DNS, nie wysyłano
maili, nic nie opublikowano na zewnątrz. Jedyny zapis poza repozytorium: przykładowa treść
wpisana do panelu Sanity (`kleyi1aa/production`), o co zadanie wprost prosiło.

## Stan wyjściowy

Aplikacja była gotowa w około 90 procentach, ale pod poprzedni zakres oferty: menu
jednopoziomowe (Strona główna, O salonie, Zabiegi, Cennik, Kontakt), sekcja opinii z
karuzelą i notką „opinie z wizytówki Google”, pasek odznak zaufania, cennik z
placeholderami `[cena]`, brak stron voucherów i regulaminu, zabiegi pod slugami `laser`
i `twarz`. Treść zabiegów zawierała twierdzenia nie do obrony („100% zadowolonych
klientów”, „bezkonkurencyjny laser medyczny”, „redukcja owłosienia już po pierwszym
zabiegu”).

## Co zostało zrobione

### Menu i trasy
- Menu w prawym górnym rogu w ustalonej kolejności: O mnie, Zabiegi (rozwijane), Cennik
  (rozwijane), Vouchery, Regulamin, Kontakt na końcu.
- Obie listy rozwijane budują się z treści w panelu, nie z kodu: „Zabiegi” z nowego pola
  **Nazwa w menu** przy zabiegu, „Cennik” z grup cennika oznaczonych **Pokaż w rozwijanym
  menu**. Marta może dodać trzeci zabieg i pojawi się w menu sam.
- Na desktopie lista rozwija się po najechaniu i po wejściu klawiaturą (`:focus-within`),
  na mobile jest wciętą podlistą w menu burgerowym.
- Nowe trasy `/vouchery` i `/regulamin`. `/o-salonie` zamienione na `/o-mnie`, stary adres
  zostaje jako przekierowanie 308 (mógł trafić do zakładek albo wizytówki Google).
- Slugi zabiegów zmienione na `depilacja-laserowa` i `pielegnacja-twarzy`.

### Strona główna
- Hero w wariancie „złota elegancja”, dwa kafle filarów, duży przycisk telefonu.
- Sekcja dwóch filarów z opisem, atutami i przyciskami „Poznaj zabieg” oraz „Zobacz ceny”
  prowadzącymi prosto do właściwej sekcji cennika.
- Sekcja voucherów, FAQ, galeria, na końcu pasek z dużym przyciskiem telefonu.
- Usunięte z renderowania: karuzela opinii, notka o opiniach Google, pasek odznak zaufania
  (to był odpowiednik sekcji „Dlaczego ZJAWISKOWO”), kafel na film w galerii.

### Treść
- Cennik z prawdziwymi cenami: depilacja 22 pozycje, pakiety 11, pielęgnacja twarzy 27,
  dodatki 2. Razem 62 pozycje. Pakiety mają adnotację o wyborze jednego pakietu i o tym,
  że oszczędność liczona jest dla serii ośmiu zabiegów. Pielęgnacja ma adnotację o obu
  promocjach (seria pięciu zabiegów, dwa zabiegi na wizycie).
- Opisy zabiegów napisane po researchu webowym (dwa podagenty, po kilka źródeł każdy):
  mechanizm fototermolizy selektywnej, faza anagenu i wynikająca z niej seria, odstępy,
  przygotowanie, zalecenia po zabiegu, przeciwwskazania; po stronie pielęgnacji
  oczyszczanie wodorowe, peeling kawitacyjny z LED, mikrodermabrazja diamentowa,
  oczyszczanie manualne, mezoterapia bezigłowa, radiofrekwencja, ultradźwięki i sonoforeza.
- Atut dostępności lasera wpleciony w opis depilacji i w atuty: laser na miejscu w
  Krzeszowicach, dostępny każdego dnia pracy salonu, kolejne wizyty bez przerw wymuszonych
  dostępnością sprzętu, seria zwykle około ośmiu zabiegów.
- FAQ przepisane na osiem pytań opartych na tym samym researchu.
- Strona „O mnie” oparta na tym, że salon prowadzi jedna osoba, z miejscami do uzupełnienia.
- Vouchery i regulamin z treścią przykładową; regulamin ma dziesięć sekcji z lukami w
  nawiasach kwadratowych i adnotacją, że to dokument roboczy do weryfikacji prawnej.
- Kontakt: adres przy ul. 3 Maja, godziny, mapa Google za zgodą, udogodnienia „Bezpłatny
  parking” i „Budynek przy automyjni” jako edytowalna lista.
- Pasek promocji ustawiony na „Rezerwacja pakietu jesiennego do końca sierpnia”.

### Panel treści
- Nowe typy dokumentów: `voucherPage`, `termsPage`.
- Rozszerzone: `service` (nazwa w menu, odnośnik do sekcji cennika), `pricelist`
  (identyfikator sekcji, przełącznik pokazywania w menu, adnotacja pod nazwą grupy, nota
  pod cennikiem), `aboutPage` (nadtytuł, lista punktów), `siteSettings` (nagłówki i
  przełączniki sekcji strony głównej, nagłówek i opis paska z telefonem, udogodnienia
  w kontakcie).
- Struktura panelu poukładana w kolejności menu strony. `trustBadge` i `review` zostają
  zarejestrowane w schemacie (dokumenty w bazie nie giną), ale zniknęły z menu panelu.
- Zaseedowane 15 dokumentów: `siteSettings`, `aboutPage`, `pricelist`, `voucherPage`,
  `termsPage`, `service-laser`, `service-twarz`, `faq-1`…`faq-8`.

## Decyzje podjęte samodzielnie

1. **Pasek odznak zaufania potraktowany jako sekcja „Dlaczego ZJAWISKOWO”** i ukryty.
   Zawierał „100% zadowolonych klientów”, „I miejsce w rankingu pozytywnych opinii” i
   „nominacja do plebiscytu” — twierdzenia nie do zweryfikowania, a zadanie wprost zakazuje
   gwarancji i obietnic. Schemat został.
2. **Jedno źródło przykładowej treści.** `sanity/seed/content.mjs` (zwykły moduł JS) zasila
   zarówno stronę przy braku połączenia z Sanity, jak i skrypt seedujący. `app/lib/fallback.ts`
   dokłada tylko typy. Bez tego treść musiałaby być utrzymywana w dwóch miejscach.
   Do `tsconfig.json` doszło `**/*.mjs` w `include`.
3. **Radiofrekwencja opisana jako nieinwazyjna (bipolarna).** Research pokazał, że w polskim
   internecie dominuje RF mikroigłowa, która jest zabiegiem penetrującym skórę i wymaga
   zupełnie innego języka. Ceny i czasy z cennika (120–290 zł, 40–90 min) wskazują na wersję
   nieinwazyjną. Do potwierdzenia z Martą, wpisane do DEPLOY.md.
4. **Numer budynku zostawiony jako `[numer do uzupełnienia]`.** Zadanie podało tylko ulicę.
   Zmyślanie numeru w adresie salonu byłoby gorsze niż widoczna luka.
5. **Godziny otwarcia i termin ważności vouchera** wpisane jako wartości przykładowe,
   oznaczone w DEPLOY.md jako do potwierdzenia.
6. **Mapa Google przez `google.com/maps?q=…&output=embed`** — działa bez klucza API i nadal
   przechodzi przez istniejącą bramkę zgody, więc nie ładuje cookies Google przed akceptacją.
7. **Bez `generateStaticParams` na podstronach zabiegów.** Treść pobierana jest z
   `cache: 'no-store'`, więc trasa i tak jest dynamiczna, a statyczne parametry tylko
   komplikowałyby build.
8. **Marka lasera nigdzie nie pada**, zgodnie z zakazem. Nazwa `REVITAL` w cenniku
   pielęgnacji została, bo pochodzi wprost z cennika klientki.
9. **Zdjęcia zostają placeholderami ze stocka.** Zdjęcie na stronie voucherów jest
   najsłabsze tematycznie z całego zestawu — warto je podmienić w pierwszej kolejności.

## Wynik `npm run build`

Przeszedł bez błędów (po `rm -rf .next`, bo pierwsza próba trafiła na blokadę pliku
`.next/trace` trzymaną przez działający serwer deweloperski).

```
✓ Compiled successfully
✓ Generating static pages (13/13)

Route (app)                                 Size  First Load JS
┌ ƒ /                                      653 B         167 kB
├ ○ /_not-found                             1 kB         104 kB
├ ƒ /cennik                                342 B         166 kB
├ ƒ /kontakt                             1.98 kB         168 kB
├ ƒ /o-mnie                                342 B         166 kB
├ ƒ /o-salonie                             132 B         103 kB
├ ƒ /polityka-prywatnosci                  132 B         103 kB
├ ƒ /regulamin                             342 B         166 kB
├ ○ /studio/[[...tool]]                  1.46 MB        1.62 MB
├ ƒ /vouchery                              342 B         166 kB
├ ƒ /zabiegi                               342 B         166 kB
└ ƒ /zabiegi/[slug]                        342 B         166 kB
+ First Load JS shared by all             103 kB
```

## Trasy ze statusem

Sprawdzone `curl` przy działającym `npm run dev`:

| Trasa | Status |
| --- | --- |
| `/` | 200 |
| `/o-mnie` | 200 |
| `/o-salonie` | 308 → `/o-mnie` |
| `/zabiegi` | 200 |
| `/zabiegi/depilacja-laserowa` | 200 |
| `/zabiegi/pielegnacja-twarzy` | 200 |
| `/cennik` | 200 |
| `/vouchery` | 200 |
| `/regulamin` | 200 |
| `/polityka-prywatnosci` | 200 |
| `/kontakt` | 200 |
| `/studio` | 200 |
| `/zabiegi/nie-istnieje` | 404 (poprawnie) |

## Testy

- `npm test` — **138 PASS, 0 FAIL**. Suite rozszerzony z 49 do 138 asercji: doszły nowe
  trasy, przekierowanie starej trasy, obie listy rozwijane, kolejność menu z Kontaktem na
  końcu, udogodnienia w kontakcie, brak iframe mapy przed zgodą, sekcje cennika po
  identyfikatorach, obecność wszystkich 62 pozycji cennika oraz asercje negatywne na zakres
  wycofany przez klientkę.
- `npx playwright test` — **33 passed, 3 skipped** (pominięte to testy przypisane do jednego
  profilu urządzenia). Doszły testy rozwijanego menu, przejścia z menu do sekcji cennika,
  menu mobilnego z podpozycjami, przekierowania `/o-salonie` i dużego przycisku telefonu.
- Zrzuty ekranu odświeżone w `tests/screenshots/` (desktop i mobile, dziewięć stron).
- Konsola przeglądarki na stronie głównej: bez błędów.

## Co zostaje otwarte

1. Deploy na Vercel — świadomie nie wykonany, poza zakresem nocnej pracy.
2. Potwierdzić typ radiofrekwencji (nieinwazyjna czy mikroigłowa) i w razie potrzeby
   przepisać opis oraz przeciwwskazania.
3. Numer budynku przy ul. 3 Maja, prawdziwe godziny otwarcia, linki do Facebooka
   i Instagrama.
4. Treść „O mnie” w miejscach oznaczonych nawiasami kwadratowymi: droga zawodowa,
   szkolenia, od kiedy działa salon, dlaczego Krzeszowice.
5. Warunki voucherów: termin ważności, formy płatności, czy możliwa wysyłka.
6. Regulamin i polityka prywatności do weryfikacji prawnej; w regulaminie jest kilkanaście
   luk w nawiasach kwadratowych (dane działalności, terminy odwołań, reklamacji, voucherów).
7. Prawdziwe zdjęcia od Marty, zaczynając od strony voucherów.
8. Zaproszenie Marty do projektu Sanity z rolą editor.

STATUS: COMPLETE
