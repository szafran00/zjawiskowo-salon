'use client'

import { useEffect, useRef, useState } from 'react'

// Przyklejony przycisk telefonu, widoczny wyłącznie na wąskich ekranach (CSS).
// Rezerwacja jest tylko telefoniczna, więc numer zostaje w zasięgu kciuka.
//
// Chowa się, dopóki na ekranie widać inny przycisk z tym samym numerem.
// Bez tego na starcie strony na telefonie stały pod sobą dwa przyciski do tego
// samego, częściowo na siebie nachodzące: „Umów się” z sekcji powitalnej
// i ten przyklejony. Zamiast prostego progu przewinięcia pilnujemy warunku
// wprost: przycisk pojawia się dokładnie wtedy, gdy żaden inny numer nie jest
// widoczny, więc znika też przy złotym pasku z telefonem na dole strony.
export default function CallFab({ phone }: { phone: string }) {
  const [widoczny, setWidoczny] = useState(false)
  const wlasny = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    // Bez IntersectionObserver (bardzo stare przeglądarki) pokazujemy przycisk
    // od razu: nachodzenie jest mniejszym problemem niż brak numeru pod ręką.
    if (typeof IntersectionObserver === 'undefined') {
      setWidoczny(true)
      return
    }

    const inneNumery = Array.from(
      document.querySelectorAll<HTMLAnchorElement>('a[href^="tel:"]')
    ).filter((el) => el !== wlasny.current)

    if (inneNumery.length === 0) {
      setWidoczny(true)
      return
    }

    const naEkranie = new Set<Element>()
    const obserwator = new IntersectionObserver((wpisy) => {
      for (const w of wpisy) {
        if (w.isIntersecting) naEkranie.add(w.target)
        else naEkranie.delete(w.target)
      }
      setWidoczny(naEkranie.size === 0)
    })

    inneNumery.forEach((el) => obserwator.observe(el))
    return () => obserwator.disconnect()
    // Bez zależności: przy zmianie trasy layout montuje ten komponent od nowa
    // razem z resztą drzewa strony, więc lista numerów liczy się na świeżo.
  }, [])

  if (!phone) return null
  const tel = 'tel:' + phone.replace(/\s/g, '')

  return (
    <a
      ref={wlasny}
      href={tel}
      className={`callfab btn btn-cta${widoczny ? ' is-widoczny' : ''}`}
      // Dopóki przycisk jest schowany, nie ma go też dla czytnika ekranu
      // i dla klawiatury — inaczej byłby pustym przystankiem w kolejności Tab.
      aria-hidden={!widoczny}
      tabIndex={widoczny ? undefined : -1}
    >
      Zadzwoń: {phone}
    </a>
  )
}
