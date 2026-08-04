'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// Sekcja bez klasy „in" ma opacity:0, więc każdy przypadek, w którym obserwator
// jej nie zauważy, kończy się treścią niewidoczną na stałe. Tak działo się przy
// wejściu w odnośnik z kotwicą (#galeria, #cennik) i przy szybkim przewinięciu
// palcem na telefonie: przeglądarka skacze przez pół strony, sekcje po drodze
// nigdy nie przecinają się z oknem, a obserwator nie dostaje o nich zdarzenia.
// Klientka zgłosiła to trzy razy z rzędu jako „na telefonie tego nie widać, na
// kompie jest" (mapa dojazdu, „Jak trafić", „Wejście od strony parkingu").
//
// Stąd dwa zabezpieczenia niżej: odsłaniamy wszystko, co jest już nad oknem
// przewijania, i po sekundzie odsłaniamy resztę bezwarunkowo. Animacja zostaje
// tam, gdzie ma sens (sekcja wjeżdżająca od dołu przy zwykłym przewijaniu),
// ale przestaje decydować o tym, czy treść w ogóle da się przeczytać.
export default function RevealInit() {
  const pathname = usePathname()
  useEffect(() => {
    document.documentElement.classList.add('reveal-ready')
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12 }
    )

    const odsloniete = (el: Element) => {
      el.classList.add('in')
      io.unobserve(el)
    }

    // Odsłaniamy wszystko, co nie jest już poniżej dolnej krawędzi okna: sekcje
    // minięte (dolna krawędź nad oknem) i te, które w oknie stoją, a mimo to nie
    // dostały zdarzenia. Sekcje jeszcze niżej zostawiamy obserwatorowi, więc
    // przy zwykłym przewijaniu animacja działa tak jak wcześniej.
    const odsloniWidziane = () => {
      document.querySelectorAll('.reveal:not(.in)').forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight) odsloniete(el)
      })
    }

    // let the new route paint before observing
    const id = window.setTimeout(() => {
      document.querySelectorAll('.reveal:not(.in)').forEach((el) => io.observe(el))
    }, 40)
    window.addEventListener('scroll', odsloniWidziane, { passive: true })

    // Siatka bezpieczeństwa na wypadek, gdyby obserwator w ogóle nie zadziałał
    // (starsza przeglądarka, widok w aplikacji, przerwany skrypt).
    const zapas = window.setTimeout(odsloniWidziane, 1200)

    return () => {
      window.clearTimeout(id)
      window.clearTimeout(zapas)
      window.removeEventListener('scroll', odsloniWidziane)
      io.disconnect()
    }
  }, [pathname])
  return null
}
