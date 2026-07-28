import { Fragment } from 'react'
import Link from 'next/link'

export type Crumb = { label: string; href?: string }

// Wspólny nagłówek podstrony: okruszki → nadtytuł → H1 → lead.
// Ten sam rytm na każdej stronie, żeby wejście w podstronę wyglądało tak samo.
export default function PageHead({
  crumbs,
  kicker,
  title,
  lead,
}: {
  crumbs: Crumb[]
  kicker?: string
  title: string
  lead?: string
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
        <h1 className="h1">{title}</h1>
        {lead && <p className="lead">{lead}</p>}
      </div>
    </section>
  )
}
