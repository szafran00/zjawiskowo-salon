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
5. Docelowa domena: podpiąć `zjawiskowo.com.pl` (Marta ma ją u Piotra Wszołka, tel. 664772094) — w Vercel Domains + rekord DNS.

## Do dokończenia (pozostałe ~20%)
- [ ] Deploy na Vercel (krok wyżej — wymaga logowania Franka do Vercel).
- [ ] Podłączyć wysyłkę formularza kontaktowego (teraz pokazuje podziękowanie, nie wysyła). Opcje: Formspree / Resend / webhook n8n.
- [ ] Prawdziwe zdjęcia i filmiki od Marty (wgrywa w panelu).
- [ ] Prawdziwe opinie z wizytówki Google + dopracowane FAQ.
- [ ] Adres, godziny otwarcia, linki FB/IG, embed mapy Google.
- [ ] Podpiąć domenę zjawiskowo.com.pl.
- [ ] Zaprosić Martę do projektu Sanity (konto + rola editor).

## Makieta poglądowa (3 warianty)
Statyczny podgląd dla klientki: https://szafran00.github.io/zjawiskowo-salon/ (folder `docs/`).
