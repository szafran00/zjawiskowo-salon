import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { sanityFetch } from '@/sanity/lib/fetch'
import { TERMS_QUERY } from '@/sanity/lib/queries'
import type { PortableBlock, Terms } from '@/app/lib/types'
import { fallbackTerms } from '@/app/lib/fallback'
import PageHead from '@/app/components/PageHead'

export const metadata = {
  title: 'Regulamin — ZJAWISKOWO Krzeszowice',
  description:
    'Regulamin salonu kosmetycznego ZJAWISKOWO w Krzeszowicach: rezerwacja wizyt, odwołania, kwalifikacja do zabiegu, vouchery i reklamacje.',
}

const PL: Record<string, string> = {
  ą: 'a', ć: 'c', ę: 'e', ł: 'l', ń: 'n', ó: 'o', ś: 's', ź: 'z', ż: 'z',
}

/** Identyfikator kotwicy z tekstu nagłówka — spis treści musi gdzieś trafić. */
function slugifyPl(text: string): string {
  return text
    .toLowerCase()
    .replace(/[ąćęłńóśźż]/g, (m) => PL[m] || m)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Tekst bloku Portable Text (do spisu treści i do kotwic). */
function blockText(block: PortableBlock): string {
  const children = (block.children as { text?: string }[] | undefined) || []
  return children.map((c) => c.text || '').join('')
}

export default async function RegulaminPage() {
  let t: Terms | null = null
  try {
    t = await sanityFetch<Terms>(TERMS_QUERY)
  } catch {
    t = null
  }
  const terms = t && (t.body || t.lead) ? t : fallbackTerms
  const body = (Array.isArray(terms.body) ? terms.body : []) as PortableBlock[]

  // Spis treści budujemy z nagłówków w treści z panelu — nie z osobnego pola.
  const toc = body
    .filter((b) => b._type === 'block' && b.style === 'h3')
    .map((b) => {
      const text = blockText(b)
      return { text, id: slugifyPl(text) }
    })
    .filter((h) => h.text)

  return (
    <>
      <PageHead
        crumbs={[{ label: 'Strona główna', href: '/' }, { label: 'Regulamin' }]}
        kicker={terms.kicker || 'Dokumenty'}
        title={terms.heading || 'Regulamin salonu'}
        lead={terms.lead}
      />

      <section className="sec">
        <div className="wrap">
          <div className="legal-nav">
            <Link href="/regulamin" className="active" aria-current="page">
              Regulamin
            </Link>
            <Link href="/polityka-prywatnosci">Polityka prywatności</Link>
          </div>

          {terms.notice && <p className="legal-notice">{terms.notice}</p>}

          {toc.length > 1 && (
            <nav className="legal-toc" aria-label="Spis treści">
              <strong>Spis treści</strong>
              <ol>
                {toc.map((h) => (
                  <li key={h.id}>
                    <a href={`#${h.id}`}>{h.text}</a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          <div className="prose">
            {body.length > 0 ? (
              <PortableText
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                value={body as any}
                components={{
                  block: {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    h3: ({ children, value }: any) => (
                      <h3 id={slugifyPl(blockText(value))}>{children}</h3>
                    ),
                  },
                }}
              />
            ) : (
              <p>[Treść regulaminu do uzupełnienia w panelu.]</p>
            )}

            <h3 id="dane-osobowe-i-pliki-cookies">Dane osobowe i pliki cookies</h3>
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
    </>
  )
}
