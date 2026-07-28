# Redesign 2026-07-28 — log zmian i decyzji

Wymiana warstwy wizualnej strony ZJAWISKOWO według projektu z `design/2026-07-28/`.
Gałąź: `redesign-2026-07-28`. Punkt wyjścia: tag `v1-przed-redesignem`.

Zasada nadrzędna: **zmieniamy wygląd, nie zmieniamy wnętrza**. Schematy Sanity,
zapytania GROQ, treści w `sanity/seed/content.mjs`, typy i skrypty pozostały
nietknięte. Cała treść nadal pochodzi z panelu, nic nie zostało wpisane na stałe
w kod.

## Źródło projektu

Projekt przyszedł jako `Zjawiskowo salon kosmetyczny.zip` w katalogu głównym.
Rozpakowany do `design/2026-07-28/` (tam czekał tylko plik `WRZUC-TU-DESIGN.txt`).
Autorytatywne dla wdrożenia są:

- `design/2026-07-28/styles.css` — system wizualny wersji wielostronicowej,
- makiety podstron (`Naglowek`, `Stopka`, `Strona główna`, `O mnie`, `Zabiegi`,
  `Depilacja laserowa`, `Pielęgnacja twarzy`, `Cennik`, `Vouchery`, `Regulamin`,
  `Polityka prywatności`, `Kontakt`),
- `Wzorce i stany.dc.html` — stany menu, nagłówek podstrony, stan pusty i przeciążony,
- `zdjecia-stockowe-zapas.html` — lista zweryfikowanych zdjęć i reguła ich doboru.

`ZJAWISKOWO.dc.html` i `ZJAWISKOWO v2.dc.html` to wcześniejsze makiety jednostronicowe
z przełącznikiem trzech wariantów kolorystycznych. Posłużyły jako odniesienie dla
hero i palety, ale układ stron wzięty jest z makiet wielostronicowych.

## Błędy znalezione i naprawione

Cztery z nich to usterki działania, nie kosmetyka. Trzy istniały już przed redesignem.

1. **Przyklejony nagłówek w ogóle się nie kleił.** `.shell` miał `overflow-x:hidden`,
   co czyni z elementu kontener przewijania — a wtedy `position:sticky` wewnątrz
   przestaje działać. Nagłówek i podnawigacja cennika odjeżdżały razem z treścią.
   Zmienione na `overflow-x:clip`, które obcina tak samo, ale kontenera nie tworzy.
   Zweryfikowane pomiarem: po przewinięciu o 1200 px `hdr.top = 0`, `price-nav.top = 70`.

2. **Menu mobilne było przycięte do wysokości nagłówka.** `.hdr` miał
   `backdrop-filter`, który czyni z elementu blok zawierający dla `position:fixed`.
   Wysuwany panel (`.nav`, `position:fixed; top:0; bottom:0`) rozciągał się więc
   do 70 px zamiast na całą wysokość ekranu. Rozmycie przeniesione na `.hdr::before`.

3. **Przy otwartym menu nie dało się go zamknąć hamburgerem.** Panel (z-index 70)
   przykrywał przycisk. `.hdr-right` dostał `position:relative; z-index:75`.

4. **Treść przyklejona do krawędzi ekranu.** `.sec{padding:84px 0}` to skrót, który
   zeruje boczny padding tam, gdzie sekcja i kontener to ten sam element
   (`class="wrap sec"` — cennik, vouchery, opinie, kontakt). Zamienione na
   `padding-top`/`padding-bottom`. Ten sam błąd siedział w `.phonebar-in`.
   Uwaga: obie pułapki są obecne również w `design/2026-07-28/styles.css`.

Dodatkowo poprawione:

- Zwinięta podlista na telefonie była przycięta `max-height:0`, ale wciąż łapała
  Tab. Dostała `visibility:hidden`, więc klawiatura w nią nie wchodzi.
- Zamknięcie panelu menu nie zwijało rozwiniętej podlisty — po ponownym otwarciu
  witał nas stan sprzed chwili.
- Wiersz cennika na wąskim ekranie łamał się tak, że cena lądowała pod nazwą przy
  lewej krawędzi. Poniżej 560 px wiersz to teraz siatka: nazwa po lewej, cena po
  prawej, czas trwania pod ceną.
- Blok „O mnie” zostawiał pustą ramę wokół zdjęcia przy długim tekście z panelu.
  Kolumny rozciągają się do wspólnej wysokości (zgodnie ze stanem „przeciążony”
  z `Wzorce i stany`).

## Zdjęcia zastępcze

Projekt stawia wprost regułę: **tylko zabiegi i skóra, bez widocznego sprzętu i bez
wnętrz salonu** (wnętrze na zdjęciu stockowym nie jest tym salonem, a laser w kadrze
zamienia stronę salonu w katalog urządzeń). Dotychczasowy zestaw jej nie spełniał —
`pexels 35103880` to zbliżenie głowicy lasera na nodze, w galerii były też wnętrza.

Nowy zestaw (`app/lib/fallback.ts`) pochodzi w całości z listy zweryfikowanej
w `zdjecia-stockowe-zapas.html`, każdy kadr obejrzany przed wpięciem:
gładka skóra nóg (4672470), dłonie na skórze (6187298), maski i pielęgnacja twarzy
(3762564, 3762553, 16574941, 6663388), kosmetyki i serum (5240623, 34939742).

Definicja siedzi w `app/lib/fallback.ts`, a nie w `sanity/seed/content.mjs`, bo tamten
plik jest źródłem treści dla panelu i seedu i miał pozostać nietknięty. `content.STOCK`
nie jest już używany przez stronę.

**Do zrobienia w panelu:** nagłówek galerii to nadal „Wnętrze salonu”, a zdjęcia
zastępcze wnętrz już nie pokazują. Po wgraniu własnych zdjęć salonu wróci to do
zgodności; do tego czasu warto zmienić nagłówek w panelu.

## Co się zmieniło w układzie

**Wspólne**

- Nagłówek: logo z podpisem „Salon kosmetyczny · Depilacja laserowa”, menu z listami
  rozwijanymi (`.navitem` / `.navtrigger` / `.submenu`), wskaźnik strony bieżącej
  (kreska pod pozycją, `aria-current="page"`), hamburger zmieniający się w krzyżyk.
- Listy rozwijane: na desktopie otwiera je najechanie **i** fokus klawiatury
  (`:focus-within`), na telefonie kliknięcie, animacją `max-height`, więc pozycje pod
  spodem nie przeskakują. Escape i kliknięcie poza nagłówkiem zamykają. Otwarty panel
  blokuje przewijanie tła.
- Pierwszą pozycją każdej listy jest strona nadrzędna („Wszystkie zabiegi”, „Pełny
  cennik”) — pozycja z listą jest wyzwalaczem, nie odnośnikiem, więc bez tego strony
  `/zabiegi` i `/cennik` byłyby nieosiągalne z menu.
- Stopka: cztery kolumny (marka, nawigacja, więcej, kontakt) plus belka dolna.
  Wszystko z panelu: nazwa, podpis, nota, telefon, adres, godziny, domena.
- Nowy wspólny nagłówek podstrony (`PageHead`): okruszki → nadtytuł → H1 → lead.
- Pasek z telefonem (`PhoneCta`) przemalowany na złotą belkę z białym przyciskiem.
- Przyklejony przycisk „Zadzwoń” na telefonie (`CallFab`).
- Pasek zgody na cookies przemalowany na pływającą kartę.

**Strona główna:** hero trójdzielne, „Dlaczego ZJAWISKOWO” jako numerowane karty,
dwa filary jako zajawki ze zdjęciem, cennik w skrócie, vouchery, karuzela opinii,
FAQ, galeria, pasek z telefonem.

**Podstrony:** `/zabiegi` — dwie karty usług; `/zabiegi/[slug]` — blok z listą atutów
plus pełny opis w `.prose`; `/cennik` — przyklejona podnawigacja kotwic i bloki cen
z wiodącymi kropkami; `/o-mnie` — blok ze zdjęciem plus karty wyróżników;
`/vouchery` — blok z listą plus warunki; `/regulamin` i `/polityka-prywatnosci` —
przełącznik dokumentów, spis treści i `.prose`.

Spis treści regulaminu **generuje się z treści w panelu**: z nagłówków `h3` w Portable
Text, z identyfikatorami z transliteracji polskich znaków. Nowa sekcja dodana przez
klientkę pojawi się w spisie sama.

## Dostępność

Poza stanami menu i fokusem opisanymi wyżej:

- Każda strona ma znacznik `<main id="tresc">`. Wcześniej nie miała żadnego, więc
  czytnik ekranu nie potrafił przeskoczyć do treści.
- Pierwszym przystankiem klawiatury jest odnośnik „Przejdź do treści”, niewidoczny
  do momentu wejścia w niego Tabem.
- Hamburger wskazuje menu przez `aria-controls`, a stan otwarcia przez `aria-expanded`.
- Odnośnik „Zobacz ceny →” w skrócie cennika dostał wysokość pola dotyku 24 px
  (sam wiersz tekstu miał 16 px).
- Akordeon FAQ: `aria-expanded` na pytaniu, `aria-controls` i `role="region"`
  z nazwą na odpowiedzi.
- Karuzela opinii: `aria-live`, kropki jako `role="tab"` z `aria-selected`,
  nieaktywne opinie ukryte przed czytnikiem.

## Kotwice i rytm przewijania

- `[id]{scroll-margin-top:96px}` — nagłówek ma 70 px, zostaje 26 px zapasu.
- `.price-block{scroll-margin-top:150px}` — pod nagłówkiem stoi jeszcze przyklejona
  podnawigacja cennika (razem 135 px), zostaje 15 px zapasu.
- `.hdr` używa `box-shadow` zamiast `border-bottom`, dzięki czemu ma dokładnie 70 px
  i podnawigacja cennika (`top:70px`) klei się bez szczeliny.

Zmierzone: kotwice cennika lądują na 150 px, kotwice regulaminu na 96 px, na
desktopie i na telefonie.

## Świadome odstępstwa od makiety

Wszystkie z jednego powodu: **makieta pokazuje treść, której nie ma w panelu**, a
schematów Sanity nie wolno było ruszać. Wpisanie jej na stałe w kod złamałoby zasadę
„treść pochodzi z Sanity” i postawiłoby na stronie liczby, których nie da się
zweryfikować.

| Element makiety | Decyzja | Powód |
| --- | --- | --- |
| Odznaka „5,0 · 90+ opinii w Google” w hero | pominięta | brak pola na ocenę i liczbę opinii; liczby z wizytówki Google nie są w panelu |
| Pasek liczb (★ 5,0 / 90+ / Laser / 1:1) | pominięty | jw. |
| Pasek zachęt (`inc-band`) na stronie głównej i w cenniku | pominięty | brak typu dokumentu; te same informacje niosą „Dlaczego ZJAWISKOWO” i adnotacje grup cennika |
| Karty pakietów z ceną w „Cenniku w skrócie” | karty grup cennika (nazwa, adnotacja, odnośnik do sekcji) | pakiety to pozycje cennika, nie osobny typ; wybieranie ich po treści adnotacji byłoby kruche |
| Kwoty voucherów (150 / 300 / dowolna) | pominięte | brak pola; kwoty w kodzie byłyby zobowiązaniem cenowym |
| Rozwijane bloki „Przygotowanie i zalecenia” na stronach zabiegów | pełny opis w `.prose` | opis w panelu to jedno pole Portable Text, nie zestaw bloków |
| Stan pusty (`svc.no-img` z inicjałem) | nie wdrożony | kod zawsze podstawia zdjęcie zastępcze, więc pusty kadr nie ma jak wystąpić; gdyby sloty miały zostać puste, to jest miejsce na ten wzorzec |
| Podpis „Strona wykonana przez…” w stopce | pominięty | to nie jest treść salonu i nie ma go w panelu |

Zachowane zostały wszystkie trzy warianty kolorystyczne (`gold`, `lavender`, `white`),
bo pole `theme` nadal jest w panelu. Domyślny i zaakceptowany to „złota elegancja”.

## Wszystko, co dołożył redesign, jest edytowalne w panelu

Redesign dorzucił sporo nowych nagłówków, nadtytułów i sekcji z telefonem. Żaden
z tych tekstów nie został w kodzie na stałe — każdy ma swoje pole w panelu, a kod
trzyma tylko wartość zapasową. Dopóki klientka niczego nie wpisze, strona wygląda
identycznie; gdy wpisze, zmiana jest widoczna po opublikowaniu.

Wymagało to rozszerzenia schematów Sanity, projekcji GROQ i typów, czyli wyjścia poza
pierwotne „nie zmieniaj”. `sanity/seed/content.mjs` pozostał nietknięty: wartości
domyślne siedzą jako `initialValue` w schematach i jako zapasy w kodzie, nie w treści
seedu.

| Dokument w panelu | Nowe pola |
| --- | --- |
| Ustawienia salonu → Strona główna | nadtytuł i nagłówek FAQ, przycisk pod pytaniami, nadtytuł i nagłówek „Cennik w skrócie”, nadtytuł sekcji z telefonem, dopisek pod numerem |
| Ustawienia salonu → Podstrony | nagłówek strony „Zabiegi”, nadtytuł i nagłówek jej sekcji z telefonem |
| Ustawienia salonu → Kontakt | nadtytuł, nagłówek i wprowadzenie strony Kontakt, dopisek nad formularzem |
| Cennik | nadtytuł i nagłówek strony, nadtytuł i nagłówek sekcji z telefonem |
| Zabieg | nagłówek bloku z atutami, nadtytuł i nagłówek sekcji z pełnym opisem, nadtytuł i nagłówek sekcji z telefonem |
| O mnie | nadtytuł i nagłówek bloku z treścią, nagłówek nad punktami wyróżniającymi, nadtytuł i nagłówek sekcji z telefonem |
| Vouchery | nadtytuł i nagłówek bloku z punktami, nadtytuł i nagłówek sekcji z warunkami, nadtytuł, nagłówek i opis sekcji z telefonem |
| Regulamin | nadtytuł i nagłówek strony „Polityka prywatności” |

Pola opcjonalne rozróżniają **niewypełnione** od **celowo wyczyszczonego**: puste pole
„Przycisk pod pytaniami”, „Dopisek pod numerem telefonu” czy „Dopisek nad formularzem”
ukrywa dany element, zamiast wracać do wartości zapasowej.

W kodzie celowo zostały etykiety interfejsu, które opisują strukturę, a nie ofertę:
pozycje menu i okruszki, napisy na przyciskach nawigacyjnych („Poznaj zabieg”,
„Zobacz ceny”), nazwy kolumn w stopce, etykiety pól formularza i treść paska zgody na
cookies. Gdyby i one miały trafić do panelu, jest to prosta kontynuacja tego samego
wzorca.

Treść samej polityki prywatności pozostaje w kodzie, bo nie ma dla niej typu dokumentu
i wymaga weryfikacji prawnej. Edytowalny jest jej nagłówek.

## Testy

`npm test` — **149 asercji, wszystkie przechodzą**, zarówno na serwerze
deweloperskim, jak i na buildzie produkcyjnym.

Cztery asercje wymagały aktualizacji, wyłącznie z powodu zmiany nazw klas CSS
(funkcje nietknięte):

| Było | Jest |
| --- | --- |
| `rev-carousel` | `class="carousel"` |
| `rev-slide` (min. 2) | `class="rev-card` (min. 2) |
| `rev-dot` | `class="dots"` + `class="dot` |
| `trust-grid` | `why-grid` |

`npx playwright test` — 33 testy przechodzą (3 pomijane jako zależne od projektu).
Zaktualizowane selektory: `.nav-item`→`.navitem`, `.nav-sub`→`.submenu`,
`.cookie-banner`→`.cookie`, `.map-consent`→`.mapbtn`, „Akceptuję wszystkie”→„Akceptuję”,
odnośnik „Ustawienia cookies” jest teraz przyciskiem. Test menu mobilnego dotyka
najpierw pozycji „Zabiegi”, bo na telefonie podlista rozwija się kliknięciem.

Test zgody na cookies (`tests/consent.spec.ts`) przechodzi bez zmian w logice: mapa
Google nadal nie ładuje się przed zgodą, „tylko niezbędne” jej nie włącza, wybór jest
zapamiętywany, a ponowne otwarcie ustawień ze stopki działa.

## Co działa tak jak przed redesignem

Menu O mnie / Zabiegi (rozwijane) / Cennik (rozwijane) / Vouchery / Regulamin /
Kontakt na końcu · karuzela opinii przesuwana pojedynczo, z ukrywaniem pojedynczej
opinii w panelu · sekcja „Dlaczego ZJAWISKOWO” · pasek promocji · filmy 9:16
w galerii · bramka zgody blokująca mapę Google · klikalny telefon 517 899 229 ·
podpis „Salon kosmetyczny · Depilacja laserowa” w nagłówku i stopce ·
przekierowanie `/o-salonie` → `/o-mnie`.

## Build

```
rm -rf .next && npm run build
```

Przechodzi bez błędów (13 tras). Uwaga windowsowa potwierdzona w praktyce: serwer
deweloperski działający w tle dopisuje do `.next` i psuje build produkcyjny
(`Cannot find module './vendor-chunks/rxjs.js'`). Przed buildem trzeba naprawdę
zwolnić port 3000, samo zamknięcie opakowującego `npm` nie wystarcza.

`npm run lint` nie działa i **nie ma to związku z redesignem** — konfiguracja nie
rozwiązuje `eslint-config-next/core-web-vitals` (brakuje rozszerzenia `.js`).
Plik `eslint.config.mjs` nie był ruszany. Next pomija lint podczas builda.

## Pliki

**Zmienione:** `app/globals.css` (przepisany), `app/(site)/layout.tsx`, wszystkie
strony w `app/(site)/`, `app/components/` (`Header`, `Footer`, `Hero`, `Faq`,
`PhoneCta`, `ReviewsCarousel`, `MapEmbed`, `CookieConsent`, `CookieSettings`,
`ContactForm`), `app/lib/fallback.ts` (zdjęcia zastępcze), `tests/smoke.mjs`,
`tests/visual.spec.ts`, `tests/consent.spec.ts`.

**Nowe:** `app/components/PageHead.tsx`, `app/components/CallFab.tsx`,
`app/components/WhySection.tsx`, `design/2026-07-28/` (rozpakowany projekt).

**Rozszerzone w drugim kroku** (żeby wszystko, co dołożył redesign, dało się edytować
w panelu): `sanity/schemaTypes/siteSettings.ts`, `pricelist.ts`, `service.ts`,
`aboutPage.ts`, `voucherPage.ts`, `termsPage.ts`, `sanity/lib/queries.ts`,
`app/lib/types.ts`. Wyłącznie nowe pola tekstowe — nic nie zostało usunięte ani
przemianowane, więc dotychczasowe dokumenty w bazie działają bez migracji.

**Nietknięte:** `sanity/seed/content.mjs`, `scripts/`, `app/layout.tsx`.

Plik `Zjawiskowo salon kosmetyczny.zip` w katalogu głównym został rozpakowany do
`design/2026-07-28/` i celowo nie trafił do repozytorium (to samo w dwóch miejscach).
