'use client'

import { useState } from 'react'

type Status = 'idle' | 'sending' | 'ok' | 'error'

// Formularz jak w kolpanowicz.pl: POST na Formspree (jeśli ustawiony endpoint),
// w innym wypadku mailto do salonu, a bez obu — kieruje na kontakt telefoniczny.
export default function ContactForm({
  endpoint,
  email,
  phone,
}: {
  endpoint?: string
  email?: string
  phone?: string
}) {
  const [status, setStatus] = useState<Status>('idle')

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
      <div className="field">
        <label>Imię</label>
        <input type="text" name="name" placeholder="Twoje imię" required />
      </div>
      <div className="field">
        <label>Telefon</label>
        <input type="tel" name="phone" placeholder="Numer telefonu" required />
      </div>
      <div className="field">
        <label>Wiadomość</label>
        <textarea name="message" placeholder="W czym możemy pomóc?" />
      </div>
      <button
        type="submit"
        className="btn btn-cta"
        style={{ width: '100%' }}
        disabled={status === 'sending'}
      >
        {status === 'sending' ? 'Wysyłanie…' : 'Wyślij zapytanie'}
      </button>
      {status === 'ok' && (
        <p className="form-done">
          Dziękujemy! Odezwiemy się najszybciej jak to możliwe.
        </p>
      )}
      {status === 'error' && (
        <p className="form-done">
          {endpoint || email
            ? 'Nie udało się wysłać. '
            : 'Najprościej skontaktować się telefonicznie. '}
          {phone ? `Zadzwoń: ${phone}.` : ''}
        </p>
      )}
    </form>
  )
}
