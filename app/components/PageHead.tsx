import { Fragment } from 'react'
import Link from 'next/link'
import { pl } from '../lib/typografia'

export type Crumb = { label: string; href?: string }

// Wspólny nagłówek podstrony: okruszki → nadtytuł → H1 → lead.
// Ten sam rytm na każdej stronie, żeby wejście w podstronę wyglądało tak samo.
export default function PageHead({
  crumbs,
  kicker,
  title,
  lead,
  wiazTytul = false,
}: {
  crumbs: Crumb[]
  kicker?: string
  title: string
  lead?: string
  /** Wiąże w tytule jednoliterowe słowa z następnym wyrazem (zob. niżej). */
  wiazTytul?: boolean
}) {
  return (
    <section className="pagehead">
      <div className="pagehead-deco" aria-hidden="true" />
      <div className="wrap pagehead-in">
        <nav className="crumbs" aria-label="Ścieżka">
          {crumbs.map((c, i) => (
            <Fragment key={i}>
              {i > 0 && (
                <span className="sep" aria-hidden="true">
                  ›
                </span>
              )}
              {c.href ? (
                <Link href={c.href}>{c.label}</Link>
              ) : (
                <span className="cur" aria-current="page">
                  {c.label}
                </span>
              )}
            </Fragment>
          ))}
        </nav>
        {kicker && <p className="kicker">{kicker}</p>}
        {/* Tytuł domyślnie bez twardych spacji: „O mnie" zaczyna się od
            jednoliterowego słowa, a ten napis jest porównywany znak w znak
            w testach i w menu. Strona, której tytuł łamie się brzydko, włącza
            wiązanie sama — tak jest na Kontakcie, gdzie klientka poprosiła
            o zejście „w" razem z „Krzeszowicach" do drugiej linijki. */}
        <h1 className="h1">{wiazTytul ? pl(title) : title}</h1>
        {lead && <p className="lead">{pl(lead)}</p>}
      </div>
    </section>
  )
}
