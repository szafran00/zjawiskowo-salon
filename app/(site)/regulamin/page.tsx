import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { sanityFetch } from '@/sanity/lib/fetch'
import { TERMS_QUERY } from '@/sanity/lib/queries'
import type { Terms } from '@/app/lib/types'
import { fallbackTerms } from '@/app/lib/fallback'

export const metadata = {
  title: 'Regulamin — ZJAWISKOWO Krzeszowice',
  description:
    'Regulamin salonu kosmetycznego ZJAWISKOWO w Krzeszowicach: rezerwacja wizyt, odwołania, kwalifikacja do zabiegu, vouchery i reklamacje.',
}

export default async function RegulaminPage() {
  let t: Terms | null = null
  try {
    t = await sanityFetch<Terms>(TERMS_QUERY)
  } catch {
    t = null
  }
  const terms = t && (t.body || t.lead) ? t : fallbackTerms
  const hasBody = Array.isArray(terms.body) && terms.body.length > 0

  return (
    <section className="sec reveal">
      <div className="wrap legal">
        <div
          className="page-head"
          style={{ alignItems: 'flex-start', textAlign: 'left' }}
        >
          <p className="kicker">{terms.kicker || 'Informacje prawne'}</p>
          <h1 className="h2">{terms.heading || 'Regulamin salonu'}</h1>
        </div>

        {terms.lead && (
          <p className="lead" style={{ marginBottom: 22 }}>
            {terms.lead}
          </p>
        )}
        {terms.notice && <p className="legal-notice">{terms.notice}</p>}

        <div className="svc-desc">
          {hasBody ? (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            <PortableText value={terms.body as any} />
          ) : (
            <p>[Treść regulaminu do uzupełnienia w panelu.]</p>
          )}

          <h3>Dane osobowe i pliki cookies</h3>
          <p>
            {terms.privacyIntro ||
              'Zasady przetwarzania danych osobowych oraz korzystania z plików cookies opisuje osobny dokument.'}{' '}
            <Link href="/polityka-prywatnosci">
              Przejdź do polityki prywatności i cookies
            </Link>
            .
          </p>
        </div>

        {terms.updatedAt && (
          <p className="legal-updated">Ostatnia aktualizacja: {terms.updatedAt}.</p>
        )}
      </div>
    </section>
  )
}
