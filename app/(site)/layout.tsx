import { sanityFetch } from '@/sanity/lib/fetch'
import { SETTINGS_QUERY } from '@/sanity/lib/queries'
import type { Settings } from '@/app/lib/types'
import { fallbackSettings } from '@/app/lib/fallback'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import RevealInit from '@/app/components/RevealInit'

export const revalidate = 60

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let settings: Settings | null = null
  try {
    settings = await sanityFetch<Settings>(SETTINGS_QUERY)
  } catch {
    settings = null
  }
  const s: Settings = { ...fallbackSettings, ...(settings || {}) }
  const theme = s.theme || 'gold'

  return (
    <div className={`shell theme-${theme}`}>
      <RevealInit />
      <Header phone={s.phone || ''} salonName={s.salonName || 'ZJAWISKOWO'} />
      {s.showPromo && s.promoText && (
        <div className="promo">
          <b>{s.promoText}</b>
        </div>
      )}
      {children}
      <Footer s={s} />
    </div>
  )
}
