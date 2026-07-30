import { sanityFetch } from '@/sanity/lib/fetch'
import { PRICELIST_QUERY, SETTINGS_QUERY } from '@/sanity/lib/queries'
import type { Pricelist, Settings } from '@/app/lib/types'
import { fallbackPricelist, fallbackSettings } from '@/app/lib/fallback'
import PageHead from '@/app/components/PageHead'
import PhoneCta from '@/app/components/PhoneCta'

export const metadata = {
  title: 'Cennik — ZJAWISKOWO Krzeszowice',
  description:
    'Cennik depilacji laserowej i pielęgnacji twarzy w salonie ZJAWISKOWO w Krzeszowicach, wraz z pakietami.',
}

export default async function CennikPage() {
  let p: Pricelist | null = null
  let settings: Settings | null = null
  try {
    ;[p, settings] = await Promise.all([
      sanityFetch<Pricelist>(PRICELIST_QUERY),
      sanityFetch<Settings>(SETTINGS_QUERY),
    ])
  } catch {
    p = null
    settings = null
  }
  const pl = p && p.groups && p.groups.length ? p : fallbackPricelist
  const s: Settings = { ...fallbackSettings, ...(settings || {}) }
  const groups = pl.groups || []
  const anchored = groups.filter((g) => g.anchor)

  return (
    <>
      <PageHead
        crumbs={[{ label: 'Strona główna', href: '/' }, { label: 'Cennik' }]}
        kicker={pl.pageKicker || 'Cennik'}
        title={pl.pageHeading || 'Cennik zabiegów'}
        lead={pl.intro}
      />

      {/* Przyklejone kotwice — bez nich długi cennik jest nie do przejścia na telefonie. */}
      {anchored.length > 1 && (
        <nav className="price-nav" aria-label="Sekcje cennika">
          <div className="price-nav-in">
            {anchored.map((g, i) => (
              <a href={`#${g.anchor}`} key={g.anchor || i}>
                {g.title}
              </a>
            ))}
          </div>
        </nav>
      )}

      <section className="pricing">
        <div className="wrap sec" style={{ paddingTop: 56 }}>
          {groups.map((g, i) => (
            <div className="price-block" id={g.anchor || undefined} key={i}>
              <div className="pb-head">
                <h2 className="h3">{g.title}</h2>
                {g.note && <span className="pb-sub">{g.note}</span>}
              </div>
              <div className="price-list">
                {g.items?.map((it, j) => {
                  // Wiersz pakietowy: przekreślona cena wyjściowa, gratis i
                  // oszczędność. Tak wygląda cennik zatwierdzony przez klientkę,
                  // i to jest w nim najważniejsze.
                  const pakiet = !!(it.oldPrice || it.saving || it.gratis)
                  if (!pakiet) {
                    return (
                      <div className="prow" key={j}>
                        <span className="pn">{it.name}</span>
                        <span className="dots-l" aria-hidden="true" />
                        <span className="pp">{it.price}</span>
                        {it.note && <span className="pt">{it.note}</span>}
                      </div>
                    )
                  }
                  return (
                    <div className="prow prow-pkg" key={j}>
                      <span className="pn">
                        {it.name}
                        {it.gratis && <span className="pgr">+ {it.gratis}</span>}
                        {it.note && <span className="pnote">{it.note}</span>}
                      </span>
                      <span className="pcena">
                        <span className="pp">{it.price}</span>
                        {it.oldPrice && (
                          <span className="pold">
                            <span className="sr-only">zamiast </span>
                            {it.oldPrice}
                          </span>
                        )}
                      </span>
                      {it.saving && (
                        <span className="psave">
                          <span className="sr-only">oszczędność </span>−{it.saving}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}

          {pl.outro && <p className="price-note">{pl.outro}</p>}
        </div>
      </section>

      <PhoneCta
        phone={s.phone || ''}
        kicker={pl.ctaKicker || 'Masz pytania o ceny?'}
        heading={pl.ctaHeading || 'Zadzwoń — dobierzemy pakiet'}
        lead={s.ctaLead}
      />
    </>
  )
}
