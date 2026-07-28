'use client'

import { useState } from 'react'
import Link from 'next/link'

type Status = 'idle' | 'sending' | 'ok' | 'error'

// Formularz jak w kolpanowicz.pl: POST na Formspree (jeśli ustawiony endpoint),
// w innym wypadku mailto do salonu, a bez obu — kieruje na kontakt telefoniczny.
export default function ContactForm({
  endpoint,
  email,
  phone,
  note,
}: {
  endpoint?: string
  email?: string
  phone?: string
  /** Puste = dopisek nad formularzem się nie pokazuje. */
  note?: string | null
}) {
  const [status, setStatus] = useState<Status>('idle')
  const noteText = note ?? 'Preferuję kontakt telefoniczny. Ten formularz jest pomocniczy.'

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)

    if (endpoint) {
      setStatus('sending')
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: data,
        })
        if (res.ok) {
          setStatus('ok')
          form.reset()
        } else {
          setStatus('error')
        }
      } catch {
        setStatus('error')
      }
      return
    }

    if (email) {
      const name = String(data.get('name') || '')
      const tel = String(data.get('phone') || '')
      const msg = String(data.get('message') || '')
      const subject = encodeURIComponent('Zapytanie ze strony ZJAWISKOWO')
      const body = encodeURIComponent(`Imię: ${name}\nTelefon: ${tel}\n\n${msg}`)
      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`
      setStatus('ok')
      return
    }

    setStatus('error')
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <input
        type="hidden"
        name="_subject"
        value="Wiadomość ze strony ZJAWISKOWO"
      />
      {noteText && <p className="form-note">{noteText}</p>}
      {/* id + htmlFor: bez tego kliknięcie w etykietę nie ustawia fokusu,
          a czytnik ekranu nie odczyta nazwy pola. */}
      <div className="field">
        <label htmlFor="pole-imie">Imię</label>
        <input
          id="pole-imie"
          type="text"
          name="name"
          autoComplete="given-name"
          placeholder="Twoje imię"
          required
        />
      </div>
      <div className="field">
        <label htmlFor="pole-telefon">Telefon</label>
        <input
          id="pole-telefon"
          type="tel"
          name="phone"
          autoComplete="tel"
          inputMode="tel"
          pattern="[0-9 ()+\-]{9,}"
          title="Podaj numer telefonu, np. 517 899 229"
          placeholder="Numer telefonu"
          required
        />
      </div>
      <div className="field">
        <label htmlFor="pole-wiadomosc">Wiadomość</label>
        <textarea
          id="pole-wiadomosc"
          name="message"
          placeholder="W czym możemy pomóc?"
        />
      </div>
      <button
        type="submit"
        className="btn btn-cta"
        style={{ width: '100%' }}
        disabled={status === 'sending'}
      >
        {status === 'sending' ? 'Wysyłanie…' : 'Wyślij zapytanie'}
      </button>
      <p className="form-note">
        Wysyłając formularz, akceptujesz{' '}
        <Link href="/polityka-prywatnosci">politykę prywatności</Link>.
      </p>
      {/* role="status" ogłasza wynik wysyłki czytnikowi ekranu. */}
      <p className="form-done" role="status" aria-live="polite">
        {status === 'ok' &&
          (endpoint
            ? 'Dziękujemy! Odezwiemy się najszybciej jak to możliwe.'
            : 'Otworzyliśmy Twój program pocztowy. Wyślij wiadomość, żeby dokończyć.')}
        {status === 'error' &&
          `${
            endpoint || email
              ? 'Nie udało się wysłać. '
              : 'Najprościej skontaktować się telefonicznie. '
          }${phone ? `Zadzwoń: ${phone}.` : ''}`}
      </p>
    </form>
  )
}
