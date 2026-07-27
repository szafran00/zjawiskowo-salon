# ZJAWISKOWO — strona salonu

Strona salonu kosmetycznego ZJAWISKOWO (Krzeszowice). Next.js 15 (App Router) + React 19,
treść w Sanity, panel pod `/studio`. Szczegóły wdrożenia: [DEPLOY.md](./DEPLOY.md).

## Uruchomienie

```bash
npm install
npm run dev
```

Strona: http://localhost:3000, panel treści: http://localhost:3000/studio.

## Struktura strony

| Trasa | Zawartość |
| --- | --- |
| `/` | hero, dwa filary, vouchery, FAQ, galeria, duży przycisk telefonu |
| `/o-mnie` | strona „O mnie” (`/o-salonie` przekierowuje tutaj) |
| `/zabiegi` | lista zabiegów |
| `/zabiegi/depilacja-laserowa` | podstrona zabiegu |
| `/zabiegi/pielegnacja-twarzy` | podstrona zabiegu |
| `/cennik` | cennik z sekcjami `#depilacja-laserowa`, `#pakiety-depilacji`, `#pielegnacja-twarzy`, `#dodatki` |
| `/vouchery` | vouchery podarunkowe |
| `/regulamin` | regulamin salonu + odnośnik do polityki prywatności |
| `/polityka-prywatnosci` | polityka prywatności i cookies |
| `/kontakt` | adres, godziny, udogodnienia, mapa za zgodą, formularz |
| `/studio` | panel treści (Sanity) |

Menu: O mnie · Zabiegi (rozwijane) · Cennik (rozwijane) · Vouchery · Regulamin · Kontakt.
Obie listy rozwijane budują się z treści w panelu: „Zabiegi” z pola **Nazwa w menu** przy
zabiegu, „Cennik” z grup cennika oznaczonych **Pokaż w rozwijanym menu**.

## Treść w panelu

Wszystko jest edytowalne w `/studio`: ustawienia i kontakt, O mnie, cennik, vouchery,
regulamin, zabiegi, FAQ, galeria.

Typy `trustBadge` i `review` zostały w schemacie (dokumenty w bazie nie giną), ale nie są
renderowane ani widoczne w menu panelu — klientka zrezygnowała z karuzeli opinii, opinii
Google i osobnej sekcji „Dlaczego ZJAWISKOWO”.

## Przykładowa treść

Źródłem przykładowych treści jest `sanity/seed/content.mjs`. Ten sam plik zasila:

- stronę, gdy pobranie danych z Sanity zawiedzie (`app/lib/fallback.ts` dokłada tylko typy),
- skrypt seedujący panel.

```bash
npm run seed -- --dry   # wypisuje, co zostałoby zapisane
npm run seed            # zapisuje do Sanity (wymaga SANITY_API_WRITE_TOKEN w .env.local)
```

Seed nadpisuje dokumenty o stałych ID (`siteSettings`, `aboutPage`, `pricelist`,
`voucherPage`, `termsPage`, `service-laser`, `service-twarz`, `faq-1`…`faq-8`).

## Testy

```bash
npm run build           # musi przejść bez błędów
npm test                # smoke: Sanity + trasy + spójność treści (138 asercji)
npm run test:visual     # Playwright: menu, zgoda cookies, FAQ, zrzuty ekranu
```

Testy wymagają działającego serwera (`npm run dev` lub `npm run start`) w drugim oknie.
Zrzuty ekranu trafiają do `tests/screenshots/`.

## Zdjęcia

Wszystkie zdjęcia to placeholdery ze stocka. Klientka wgrywa własne w panelu w polach
„Zdjęcie” przy hero, zabiegach, stronie O mnie, voucherach i w galerii.

## Świeżość danych

Strony renderują się dynamicznie z `cache: 'no-store'` — po **Publish** w panelu zmiana jest
widoczna od razu. Przy większym ruchu można wrócić do cache + webhook Sanity z
`revalidateTag`.

## Makieta poglądowa

Statyczny podgląd trzech wariantów kolorystycznych (folder `docs/`):
https://szafran00.github.io/zjawiskowo-salon/. Zaakceptowany wariant to „złota elegancja”.
