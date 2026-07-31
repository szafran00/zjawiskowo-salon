import type { PortableBlock } from './types'

// Polska zasada łamania wierszy: jednoliterowe słowo nie zostaje na końcu
// wiersza. Klientka zgłosiła to dwa razy („literkę o trzeba dać na dół",
// „słowo i lepiej dać na dół"), ale to nie są dwie usterki w dwóch zdaniach.
// Tak zachowuje się każdy tekst z panelu przy każdej szerokości ekranu.
//
// UWAGA CO DO ZAKRESU. Twarda spacja to inny znak niż zwykła, więc stosowana
// bez opamiętania psuje kilka rzeczy naraz:
//   * testy porównują wartość z Sanity ze znakami w HTML jeden do jednego,
//     więc poległyby nazwy pozycji cennika ze spójnikiem („Uda i kolana",
//     „twarz, szyja i dekolt") oraz pasek promocji z „w sierpniu",
//   * „O mnie" w menu i w nagłówku zaczyna się od jednoliterowego słowa,
//   * Ctrl+F przestaje znajdować frazy przechodzące przez związaną parę,
//   * kopiowanie tekstu wynosi twarde spacje do innych systemów.
//
// Dlatego stosujemy to WYŁĄCZNIE do tekstu ciągłego: leady, akapity,
// odpowiedzi FAQ, cytaty opinii i treść z edytora. Nigdy do tytułów,
// nagłówków, nadtytułów, etykiet menu, nazw pozycji cennika ani promocji.
const JEDNOLITEROWE = 'aiouwzAIOUWZ'
const NBSP = ' '
const WZORZEC = new RegExp(`(^|[\\s(„”"'${NBSP}])([${JEDNOLITEROWE}])[ \\t]+`, 'g')

export function pl(text: string): string
export function pl(text: string | undefined | null): string | undefined
export function pl(text: string | undefined | null): string | undefined {
  if (!text) return text ?? undefined
  // Pętla, bo sąsiadujące jednoliterowe słowa („o i w") wymagają kolejnych
  // przebiegów: dopasowanie zjada spację poprzedzającą następne słowo.
  let poprzedni: string
  let wynik = text
  do {
    poprzedni = wynik
    wynik = wynik.replace(WZORZEC, `$1$2${NBSP}`)
  } while (wynik !== poprzedni)
  return wynik
}

// Style blokowe, których nie ruszamy: to śródtytuły. Regulamin wylicza z nich
// identyfikatory kotwic do spisu treści, więc podmiana spacji w nagłówku
// rozjechałaby odnośniki ze spisu i celami skoku.
const NAGLOWKI = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])

/** To samo dla treści z edytora: rusza wyłącznie tekst akapitów, nie nagłówków. */
export function plBloki(bloki?: PortableBlock[] | null): PortableBlock[] {
  if (!Array.isArray(bloki)) return []
  return bloki.map((b) => {
    const styl = (b as { style?: string }).style
    if (styl && NAGLOWKI.has(styl)) return b
    const dzieci = b.children as { text?: string }[] | undefined
    if (!Array.isArray(dzieci)) return b
    return {
      ...b,
      children: dzieci.map((c) =>
        typeof c.text === 'string' ? { ...c, text: pl(c.text) } : c
      ),
    }
  })
}
