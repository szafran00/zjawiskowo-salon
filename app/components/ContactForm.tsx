'use client'

import { useState } from 'react'

export default function ContactForm() {
  const [done, setDone] = useState(false)
  return (
    <form
      className="form"
      onSubmit={(e) => {
        e.preventDefault()
        setDone(true)
      }}
    >
      <div className="field">
        <label>Imię</label>
        <input type="text" placeholder="Twoje imię" required />
      </div>
      <div className="field">
        <label>Telefon</label>
        <input type="tel" placeholder="Numer telefonu" required />
      </div>
      <div className="field">
        <label>Wiadomość</label>
        <textarea placeholder="W czym możemy pomóc?" />
      </div>
      <button type="submit" className="btn btn-cta" style={{ width: '100%' }}>
        Umów wizytę
      </button>
      {done && (
        <p className="form-done">
          Dziękujemy! Wkrótce się odezwiemy. (Formularz demonstracyjny — do
          podłączenia wysyłki.)
        </p>
      )}
    </form>
  )
}
