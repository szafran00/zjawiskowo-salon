// Ściąga do panelu treści dla klientki, jedna strona A4 do wydrukowania.
//
//   node scripts/sciaga-panel-marty.mjs
//
// Skład bierze wygląd wprost ze strony: te same kroje (Marcellus i Jost
// w logotypie, Playfair Display w nagłówkach, Montserrat w treści), ta sama
// paleta i ten sam znak graficzny rysowany w kodzie. Fonty pobieramy z żywej
// strony i wklejamy do pliku jako dane, żeby HTML i PDF wyglądały tak samo za
// rok, bez połączenia z siecią.
//
// Powstaje para plików: HTML (do poprawek) i PDF (do druku i do wysłania).
import { writeFileSync, mkdirSync } from 'node:fs'
import { chromium } from '@playwright/test'

const ZRODLO = 'https://zjawiskowo-salon.vercel.app'
const KATALOG = 'H:/My Drive/_BUSINESS/_EPISTEME AI/Klienci/Zjawiskowo'
const NAZWA = 'ZJAWISKOWO - panel tresci - sciaga'

// ---------------------------------------------------------------- fonty ----
// Z arkusza strony bierzemy tylko podzbiory łacińskie: podstawowy i rozszerzony
// (ten drugi niesie ą, ę, ł, ś, ż). Cyrylica i wietnamski są tu zbędne.
const POTRZEBNE = ['Playfair Display', 'Montserrat', 'Marcellus', 'Jost']

async function zbierzFonty() {
  const html = await (await fetch(ZRODLO)).text()
  const arkusze = [...html.matchAll(/href="([^"]+\.css[^"]*)"/g)].map((m) => m[1])
  const faces = new Map()
  for (const a of arkusze) {
    const css = await (await fetch(ZRODLO + a)).text()
    for (const m of css.matchAll(/@font-face\{([^}]*)\}/g)) {
      const blok = m[1]
      const rodzina = blok.match(/font-family:'?([^;']+)'?/)?.[1]?.trim()
      const src = blok.match(/src:url\(([^)]+)\)/)?.[1]
      const zakres = blok.match(/unicode-range:([^;]+)/)?.[1] || ''
      if (!rodzina || !src || !POTRZEBNE.includes(rodzina)) continue
      const lacina = /u\+00\?\?/.test(zakres)
      const lacinaRozszerzona = /u\+0100-02ba/.test(zakres)
      if (!lacina && !lacinaRozszerzona) continue
      faces.set(src, { rodzina, zakres: zakres.trim() })
    }
  }
  const wpisy = []
  for (const [src, { rodzina, zakres }] of faces) {
    const bufor = Buffer.from(await (await fetch(ZRODLO + src)).arrayBuffer())
    wpisy.push(
      `@font-face{font-family:'${rodzina}';font-style:normal;font-weight:100 900;` +
        `font-display:swap;src:url(data:font/woff2;base64,${bufor.toString('base64')}) format('woff2');` +
        `unicode-range:${zakres}}`
    )
  }
  console.log(`Wklejone kroje: ${wpisy.length} podzbiorów`)
  return wpisy.join('\n')
}

// ----------------------------------------------------------------- znak ----
// Kwiatuszek z księgi znaku, wariant „Dwie warstwy”, ten sam rysunek co
// w app/components/Kwiatuszek.tsx.
const PET_OUT = 'M100,74 C118,64 120,40 100,22 C80,40 82,64 100,74 Z'
const PET_IN = 'M100,76 C110,68 112,54 100,44 C88,54 90,68 100,76 Z'
const kwiatuszek = (rozmiar) => `
<svg width="${rozmiar}" height="${rozmiar}" viewBox="0 0 200 200" aria-hidden="true">
  <g fill="none" stroke="#2C2722" stroke-width="1.7" stroke-linejoin="round">
    ${[0, 45, 90, 135, 180, 225, 270, 315]
      .map((a) => `<path d="${PET_OUT}" transform="rotate(${a} 100 100)"/>`)
      .join('')}
  </g>
  <g fill="none" stroke="#B28A3C" stroke-width="1.5" stroke-linejoin="round">
    ${[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5]
      .map((a) => `<path d="${PET_IN}" transform="rotate(${a} 100 100)"/>`)
      .join('')}
  </g>
</svg>`

// ----------------------------------------------------------------- treść ----
const SEKCJE_PANELU = [
  ['Ustawienia salonu i kontakt', 'Telefon, godziny, adres, pasek promocji u góry strony, przełączniki sekcji.'],
  ['O mnie', 'Tekst o salonie i punkty „Co mnie wyróżnia”.'],
  ['Cennik', 'Grupy i pozycje, ceny, czasy, adnotacje nad listą i pod listą.'],
  ['Vouchery', 'Treść strony z voucherami i warunki.'],
  ['Regulamin', 'Regulamin salonu i zapowiedź polityki prywatności.'],
  ['Zabiegi', 'Depilacja laserowa i pielęgnacja twarzy, każdy z własną podstroną.'],
  ['Dlaczego ZJAWISKOWO', 'Punkty wyróżniające na stronie głównej.'],
  ['Opinie', 'Cytaty klientek pokazywane w karuzeli.'],
  ['FAQ', 'Pytania i odpowiedzi na dole strony głównej.'],
  ['Galeria', 'Zdjęcia i filmy z salonu.'],
]

const PRZEPISY = [
  [
    'Zmiana promocji w złotym pasku',
    'Ustawienia salonu i kontakt → pole <b>Pasek promocji</b> → nowa treść → <b>Publish</b>. Kwoty i procenty same wychodzą większe i grubsze, nie trzeba nic zaznaczać.',
  ],
  [
    'Nowa pozycja w cenniku',
    'Cennik → właściwa grupa → <b>Pozycje</b> → <b>Add item</b> → nazwa, cena, czas → <b>Publish</b>.',
  ],
  [
    'Nowa opinia albo zdjęcie',
    'Opinie lub Galeria → <b>Create new</b> → treść albo plik → <b>Publish</b>. Kolejność ustawia pole <b>Kolejność</b>.',
  ],
  [
    'Ukrycie całej sekcji',
    'Ustawienia salonu i kontakt → przełączniki <b>Pokaż opinie</b>, <b>Pokaż galerię</b>, <b>Pokaż FAQ</b>, <b>Pokaż pasek promocji</b> → <b>Publish</b>.',
  ],
]

const WARTO = [
  '<b>Publish dotyczy jednej rzeczy naraz.</b> Opublikowanie cennika nie publikuje zmian w opiniach, każdą sekcję zatwierdza się osobno.',
  '<b>Sekcja zniknęła ze strony?</b> Najpierw przełączniki „Pokaż…” w Ustawieniach, one ukrywają całe bloki.',
  '<b>Panel działa też na telefonie</b>, ale przy dłuższych tekstach i zdjęciach wygodniej na komputerze.',
]

function zbudujHtml(fonty) {
  return `<!doctype html>
<html lang="pl">
<head>
<meta charset="utf-8">
<title>ZJAWISKOWO — panel treści, ściąga</title>
<style>
${fonty}
:root{
  --bg:#FBF7EF;--bg2:#F3E9D6;--surface:#FFFFFF;--text:#2B2620;--muted:#6B6357;
  --accent:#B8912F;--accent-deep:#846514;--line:rgba(132,101,20,.28);--grafit:#2C2722;
}
@page{size:A4;margin:12mm 13mm}
*{box-sizing:border-box}
html,body{margin:0;padding:0}
/* Na ekranie odtwarzamy marginesy strony, żeby podgląd w przeglądarce
   pokazywał to samo co wydruk. Przy druku marginesy daje @page. */
@media screen{body{padding:12mm 13mm;max-width:210mm;margin:0 auto}}
body{
  font-family:'Montserrat',system-ui,sans-serif;color:var(--text);background:var(--bg);
  font-size:9.4pt;line-height:1.5;-webkit-print-color-adjust:exact;print-color-adjust:exact;
}
h1,h2{font-family:'Playfair Display',Georgia,serif;font-weight:700;margin:0}
h1{font-size:19pt;letter-spacing:.01em}
h2{font-size:11.5pt;margin-bottom:5px}

/* nagłówek: logotyp jak w księdze znaku, obok tytuł ściągi */
.top{display:flex;align-items:center;justify-content:space-between;gap:18px;
  border-bottom:2px solid var(--accent);padding-bottom:10px;margin-bottom:14px}
.logotyp{display:inline-flex;align-items:center;gap:11px;line-height:1}
.logotyp-text{display:inline-flex;flex-direction:column;align-items:center;text-align:center;line-height:1}
.logotyp b{font-family:'Marcellus',serif;font-weight:400;font-size:17pt;letter-spacing:.16em;color:var(--grafit);white-space:nowrap}
.logotyp small{font-family:'Jost',system-ui,sans-serif;white-space:nowrap;display:block}
.logotyp-sub{font-size:6.4pt;letter-spacing:.28em;text-transform:uppercase;color:#B28A3C;font-weight:500;margin-top:5px}
.logotyp-rule{display:flex;align-items:center;justify-content:center;gap:8px;font-size:6.4pt;
  letter-spacing:.2em;text-transform:uppercase;color:var(--grafit);font-weight:600;margin-top:4px}
.logotyp-rule i{display:block;width:18px;height:1px;background:#B28A3C;flex:none}
.tytul{text-align:right}
.tytul p{margin:3px 0 0;color:var(--muted);font-size:8.4pt;text-wrap:balance;max-width:78mm}

.kicker{font-family:'Jost',system-ui,sans-serif;font-size:7.2pt;letter-spacing:.24em;
  text-transform:uppercase;color:var(--accent-deep);font-weight:600;margin:0 0 3px}

/* wejście: trzy kroki w złotych kółkach */
.kroki{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:0 0 14px}
.krok{background:var(--surface);border:1px solid var(--line);border-radius:10px;padding:10px 12px}
.krok .nr{display:inline-flex;align-items:center;justify-content:center;width:19px;height:19px;
  border-radius:50%;background:var(--accent);color:#fff;font-weight:700;font-size:8.4pt;margin-bottom:5px}
/* Tylko nagłówek kroku idzie w osobną linijkę. Bez tego pogrubienie wewnątrz
   zdania („przycisk Google") łamało wiersz i zostawiało sierotę z przecinkiem. */
.krok > b{display:block;font-size:9.4pt;margin-bottom:2px}
.krok > span{color:var(--muted);font-size:8.4pt;line-height:1.45;display:block}
.krok span b{font-size:8.4pt;color:var(--text)}
.mono{font-family:'Jost',Consolas,monospace;color:var(--accent-deep);font-weight:600;letter-spacing:.01em}
/* Adresy w krokach nie mogą się łamać: „zjawiskowo-” na końcu wiersza czyta się
   jak dywiz przeniesienia, a myślnik jest częścią adresu. */
.krok .mono{white-space:nowrap;font-size:7.6pt}

/* jedna zasada */
.zasada{background:var(--bg2);border-left:3px solid var(--accent);border-radius:0 10px 10px 0;
  padding:11px 14px;margin:0 0 14px}
.zasada b{font-size:10pt}
.zasada p{margin:3px 0 0;color:var(--muted);font-size:8.6pt}

.kolumny{display:grid;grid-template-columns:1.05fr .95fr;gap:16px;align-items:start}
.prawa{display:flex;flex-direction:column;gap:12px}
.karta{background:var(--surface);border:1px solid var(--line);border-radius:10px;padding:12px 14px}
.mapa{list-style:none;margin:0;padding:0}
.mapa li{padding:4.5px 0;border-bottom:1px solid rgba(132,101,20,.14)}
.mapa li:last-child{border-bottom:0}
.mapa b{display:block;font-size:9.2pt}
.mapa span{color:var(--muted);font-size:8.1pt;line-height:1.4}
.przepis{padding:6px 0;border-bottom:1px solid rgba(132,101,20,.14)}
.przepis:last-child{border-bottom:0}
.przepis b{display:block;font-size:9.2pt;margin-bottom:1px}
.przepis span{color:var(--muted);font-size:8.1pt;line-height:1.45}
.przepis span b{display:inline;color:var(--text);font-size:8.1pt}

.stopka{margin-top:14px;padding-top:9px;border-top:1px solid var(--line);
  display:flex;justify-content:space-between;align-items:baseline;gap:14px;
  color:var(--muted);font-size:8.1pt}
.stopka b{color:var(--text)}
</style>
</head>
<body>

<div class="top">
  <span class="logotyp">
    ${kwiatuszek(40)}
    <span class="logotyp-text">
      <b>ZJAWISKOWO</b>
      <small class="logotyp-sub">Salon kosmetyczny</small>
      <small class="logotyp-rule"><i></i>Depilacja laserowa<i></i></small>
    </span>
  </span>
  <span class="tytul">
    <h1>Panel treści</h1>
    <p>Ściąga na jedną stronę. Wszystko, co potrzebne, żeby samodzielnie zmieniać treść.</p>
  </span>
</div>

<p class="kicker">Wejście do panelu</p>
<div class="kroki">
  <div class="krok">
    <span class="nr">1</span>
    <b>Adres</b>
    <span>Docelowo <span class="mono">zjawiskowo.com.pl/studio</span>. Zanim strona przejdzie na własną domenę: <span class="mono">zjawiskowo-salon.vercel.app/studio</span></span>
  </div>
  <div class="krok">
    <span class="nr">2</span>
    <b>Logowanie</b>
    <span>Przycisk <b>Google</b> i ten sam adres, na który przyszło zaproszenie do panelu.</span>
  </div>
  <div class="krok">
    <span class="nr">3</span>
    <b>Wybór treści</b>
    <span>Po lewej lista sekcji, po kliknięciu otwiera się formularz z polami.</span>
  </div>
</div>

<div class="zasada">
  <b>Jedna zasada: zmiana wchodzi na stronę dopiero po kliknięciu Publish.</b>
  <p>Dopóki przycisk <b>Publish</b> nie zostanie kliknięty, zmiana leży jako wersja robocza i nikt jej nie widzi. Po kliknięciu wystarczy odświeżyć stronę salonu, żeby zobaczyć efekt. Nic nie trzeba zapisywać osobno, panel zapisuje na bieżąco.</p>
</div>

<div class="kolumny">
  <div class="karta">
    <p class="kicker">Co gdzie jest</p>
    <ul class="mapa">
      ${SEKCJE_PANELU.map(([t, o]) => `<li><b>${t}</b><span>${o}</span></li>`).join('\n      ')}
    </ul>
  </div>
  <div class="prawa">
    <div class="karta">
      <p class="kicker">Najczęstsze zmiany</p>
      ${PRZEPISY.map(([t, o]) => `<div class="przepis"><b>${t}</b><span>${o}</span></div>`).join('\n      ')}
    </div>
    <div class="karta">
      <p class="kicker">Warto wiedzieć</p>
      ${WARTO.map((w) => `<div class="przepis"><span>${w}</span></div>`).join('\n      ')}
    </div>
  </div>
</div>

<div class="stopka">
  <span><b>Coś nie działa albo czegoś nie ma na liście?</b> Franciszek Kołpanowicz, Episteme AI, tel. 518 148 001</span>
  <span>Salon Kosmetyczny ZJAWISKOWO, ul. 3 Maja 4, Krzeszowice</span>
</div>

</body>
</html>`
}

// ----------------------------------------------------------------- skład ----
const fonty = await zbierzFonty()
const html = zbudujHtml(fonty)

mkdirSync(KATALOG, { recursive: true })
const sciezkaHtml = `${KATALOG}/${NAZWA}.html`
const sciezkaPdf = `${KATALOG}/${NAZWA}.pdf`
writeFileSync(sciezkaHtml, html, 'utf8')

const przegladarka = await chromium.launch()
const strona = await przegladarka.newPage()
await strona.setContent(html, { waitUntil: 'load' })
await strona.evaluate(() => document.fonts.ready)
await strona.pdf({ path: sciezkaPdf, format: 'A4', printBackground: true })
const stron = await strona.evaluate(() =>
  Math.ceil(document.documentElement.scrollHeight / (297 * 3.7795 - 2 * 12 * 3.7795))
)
await przegladarka.close()

console.log('HTML:', sciezkaHtml)
console.log('PDF: ', sciezkaPdf)
console.log('Szacowana liczba stron:', stron)
