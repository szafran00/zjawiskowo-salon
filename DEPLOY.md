# ZJAWISKOWO — strona salonu (Next.js + Sanity)

Strona wizytówkowa salonu kosmetycznego ZJAWISKOWO (Krzeszowice) z panelem treści (CMS), w którym właścicielka sama edytuje wszystkie sekcje.

## Stack
- **Next.js 15** (App Router) + **React 19**, hosting na Vercel
- **Sanity** (headless CMS) — panel osadzony pod `/studio`
- Cała treść edytowalna przez Martę: promocja, hero, atuty obu filarów, opinie, FAQ, galeria, kontakt, godziny, wariant kolorystyczny

## Sanity
- Projekt: `Zjawiskowo`, projectId **kleyi1aa**, dataset **production**
- Treść już zaseedowana (2 filary, 4 odznaki, 5 opinii, 6 FAQ, ustawienia)
- Panel: `/studio` — logowanie kontem Sanity (Franek). Marta dostanie zaproszenie do projektu.
- Zdjęcia: na razie stockowe (placeholdery). Marta wgra własne w panelu (pola „Zdjęcie" przy hero/usługach/galerii).

## Lokalnie
```bash
npm install
npm run dev      # http://localhost:3000  (panel: /studio)
```
Zmienne w `.env.local` (projectId/dataset są też domyślne w kodzie, więc build działa bez env). Tokeny (read/write) są tylko lokalnie, nie w repo.

## Deploy na Vercel (jednorazowo, ~2 min)
1. https://vercel.com → **Add New → Project → Import** repo `szafran00/zjawiskowo-salon`.
2. Framework: Next.js (wykryje sam). **Zmienne env nie są wymagane** (projectId/dataset są w kodzie; dataset publiczny).
3. Deploy. Strona: `https://zjawiskowo-salon.vercel.app`, panel: `.../studio`.
4. Domeny Vercel (`*.vercel.app`) i `zjawiskowo.com.pl` są już dodane do CORS Sanity, więc panel zadziała od razu.
5. Docelowa domena: `zjawiskowo.com.pl`. Dane kontaktowe informatyka klientki
   trzymamy w vaulcie, nie w tym pliku: repozytorium jest publiczne.

## Do dokończenia
- [ ] Deploy na Vercel (krok wyżej — wymaga logowania Franka do Vercel).
- [ ] **Dane do uzupełnienia przez Martę w panelu** (obecnie treść przykładowa): numer budynku przy ul. 3 Maja, prawdziwe godziny otwarcia, linki FB/IG, treść „O mnie” (droga zawodowa, szkolenia, od kiedy salon), warunki voucherów, luki w regulaminie oznaczone `[…]`.
- [ ] **Potwierdzić z Martą typ radiofrekwencji** — opisy na stronie zakładają RF nieinwazyjną (bipolarną). Jeśli salon ma urządzenie mikroigłowe, opis i przeciwwskazania wymagają przepisania.
- [ ] **Weryfikacja prawna regulaminu i polityki prywatności** przed publikacją.
- [x] Formularz kontaktowy przez **Formspree** (jak na kolpanowicz.pl). **Aktywacja:** załóż darmowy formularz na [formspree.io](https://formspree.io) (przekierowany na e-mail salonu) → wklej adres `https://formspree.io/f/xxxxxx` w panelu **Sanity → Ustawienia salonu → „Formularz — adres Formspree"** oraz e-mail w „E-mail kontaktowy". Bez tego formularz kieruje do kontaktu telefonicznego (Marta i tak woli telefon).
- [x] **Polityka prywatności/cookies** — strona `/polityka-prywatnosci` (szablon RODO, uzupełnić dane administratora: nazwa/adres/NIP/e-mail) + link w stopce.
- [ ] **Cookiebot** (zgoda cookies) — wpięty, aktywacja przez env `NEXT_PUBLIC_COOKIEBOT_ID` (ID grupy domen z panelu Cookiebot). Potrzebny dopiero gdy dojdzie **mapa Google lub analityka** — wtedy tryb auto blokuje trackery do zgody. Teraz strona nie ustawia trackujących cookies, więc banner nie jest wymagany.
- [ ] Prawdziwe zdjęcia od Marty (wgrywa w panelu; teraz wszędzie placeholdery ze stocka).
- [ ] Podpiąć domenę zjawiskowo.com.pl.
- [ ] Zaprosić Martę do projektu Sanity (konto + rola editor).

Zakres wycofany przez klientkę (nie wraca bez jej decyzji): karuzela opinii, osadzenie opinii Google, kod QR, cennik do ramki, osobna sekcja „Dlaczego ZJAWISKOWO”. Schematy `review` i `trustBadge` zostały w kodzie, ale nic ich nie renderuje ani nie pokazuje w panelu.

## Testy
- `npm test` (`tests/smoke.mjs`) — przy działającym serwerze. Sprawdza integralność danych w Sanity, wszystkie trasy (200), przekierowanie `/o-salonie` → `/o-mnie`, 404 dla nieistniejącego zabiegu, obie listy rozwijane w menu, treść stron, brak wycofanych sekcji oraz spójność Sanity↔strona (promo, zabiegi, każda pozycja cennika). **138 asercji.**
- `npm run test:visual` (Playwright, mobile + desktop) — rozwijane menu, przejście z menu do sekcji cennika, menu mobilne, przekierowanie starej trasy, FAQ, zgoda cookies i mapa, duży przycisk telefonu, zrzuty ekranu do `tests/screenshots/`.

## Świeżość danych (CMS)
Strony treści renderują się dynamicznie z `cache: 'no-store'` — po **Publish** w panelu zmiana jest widoczna od razu (bez laga). Kompromis: każde wejście odpytuje Sanity (dla salonu ruch znikomy, więc OK). Jeśli w przyszłości ruch wzrośnie, można wrócić do cache + **webhook Sanity → on-demand revalidation** (`revalidateTag`), żeby mieć i szybkość, i natychmiastowe aktualizacje.

## Makieta poglądowa (3 warianty)
Statyczny podgląd dla klientki: https://szafran00.github.io/zjawiskowo-salon/ (folder `docs/`).
