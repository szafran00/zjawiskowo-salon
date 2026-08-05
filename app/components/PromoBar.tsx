import { pl, plSep } from '@/app/lib/typografia'

// Pasek promocji z wyróżnionymi kwotami. Klientka poprosiła 6 sierpnia, żeby
// „ciut powiększyć" najpierw 1200 zł, a chwilę później także 20%. Wyróżnienie
// idzie wzorcem po treści, a nie znacznikami wpisywanymi do panelu: w polu
// edycyjnym ma zostać zwykły tekst, który klientka przepisze ręcznie i nie
// będzie musiała pamiętać o żadnej składni. Każda kolejna kwota albo procent
// w pasku podłapie to samo wyróżnienie bez zmiany w kodzie.
//
// Jedna grupa przechwytująca w rozdzielaczu daje w wyniku split() części
// zwykłego tekstu na miejscach parzystych i dopasowania na nieparzystych,
// więc rozpoznanie po indeksie jest pewne i nie zależy od stanu wyrażenia.
const KWOTA = /((?:[−–-]\s?)?\d[\d\s ]*(?:[.,]\d+)?\s?(?:zł|%))/g

export default function PromoBar({ text }: { text: string }) {
  const gotowy = plSep(pl(text)) || ''
  const czesci = gotowy.split(KWOTA)
  return (
    <div className="promo">
      <b>
        {czesci.map((czesc, i) =>
          i % 2 === 1 ? (
            <span className="promo-kwota" key={i}>
              {czesc}
            </span>
          ) : (
            czesc
          )
        )}
      </b>
    </div>
  )
}
