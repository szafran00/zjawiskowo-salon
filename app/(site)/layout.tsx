import { sanityFetch } from '@/sanity/lib/fetch'
import { LAYOUT_QUERY } from '@/sanity/lib/queries'
import type { LayoutData, Settings, NavTreatment, NavPriceGroup } from '@/app/lib/types'
import { fallbackSettings, fallbackTreatments, fallbackPricelist } from '@/app/lib/fallback'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import RevealInit from '@/app/components/RevealInit'
import CookieConsent from '@/app/components/CookieConsent'

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let data: LayoutData = {}
  try {
    data = await sanityFetch<LayoutData>(LAYOUT_QUERY)
  } catch {
    data = {}
  }

  const s: Settings = { ...fallbackSettings, ...(data.settings || {}) }
  const theme = s.theme || 'gold'

  // Rozwijane menu buduje się z treści w panelu; gdy jej brak — z danych zapasowych.
  const navTreatments: NavTreatment[] =
    data.navTreatments && data.navTreatments.length
      ? data.navTreatments
      : fallbackTreatments.map((t) => ({
          title: t.title,
          kicker: t.kicker,
          navLabel: t.navLabel,
          slug: t.slug,
        }))

  const navPriceGroups: NavPriceGroup[] =
    data.navPriceGroups && data.navPriceGroups.length
      ? data.navPriceGroups
      : (fallbackPricelist.groups || []).map((g) => ({
          title: g.title,
          anchor: g.anchor,
          showInMenu: g.showInMenu,
        }))

  return (
    <div className={`shell theme-${theme}`}>
      <RevealInit />
      <Header
        phone={s.phone || ''}
        salonName={s.salonName || 'ZJAWISKOWO'}
        treatments={navTreatments}
        priceGroups={navPriceGroups}
      />
      {s.showPromo && s.promoText && (
        <div className="promo">
          <b>{s.promoText}</b>
        </div>
      )}
      {children}
      <Footer s={s} />
      <CookieConsent />
    </div>
  )
}
