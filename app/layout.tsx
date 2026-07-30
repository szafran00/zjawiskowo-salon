import type { Metadata } from 'next'
import Script from 'next/script'
import { Playfair_Display, Montserrat, Marcellus, Jost } from 'next/font/google'
import { indexingAllowed } from './lib/indexing'
import './globals.css'

// Fonty serwowane z własnej domeny zamiast z fonts.googleapis.com. Cztery
// rodziny wczytywane arkuszem z zewnątrz blokowały renderowanie na blisko
// trzy sekundy (Lighthouse mobile), a przy okazji łączyły przeglądarkę
// z serwerami Google zanim ktokolwiek kliknął zgodę na cookies.
//
// „latin-ext" jest obowiązkowy: bez niego ą, ę, ł, ś i ż lecą na font zastępczy.
const playfair = Playfair_Display({
  subsets: ['latin', 'latin-ext'],
  weight: ['500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-serif',
})
const montserrat = Montserrat({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-sans',
})
// Kroje zastrzeżone dla logotypu (księga znaku).
const marcellus = Marcellus({
  subsets: ['latin', 'latin-ext'],
  weight: ['400'],
  display: 'swap',
  variable: '--font-logo',
})
const jost = Jost({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-logo-sans',
})

// Cookiebot (zgoda na cookies) — aktywuje się dopiero po ustawieniu ID domeny
// w zmiennej NEXT_PUBLIC_COOKIEBOT_ID. Tryb "auto" blokuje cookies do zgody.
const cookiebotId = process.env.NEXT_PUBLIC_COOKIEBOT_ID

// Adres, względem którego budują się odnośniki w metadanych (m.in. og:image).
// Dopóki zjawiskowo.com.pl nie jest podpięta, na Vercelu bierzemy adres bieżącego
// wdrożenia — inaczej link wysłany do obejrzenia pokazuje podgląd z obrazkiem
// spod domeny, która jeszcze nie działa. Po podpięciu domeny zmienna wskaże już ją.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'https://zjawiskowo.com.pl')

export const metadata: Metadata = {
  title: 'ZJAWISKOWO Krzeszowice · Depilacja laserowa i salon kosmetyczny',
  description:
    'Salon kosmetyczny ZJAWISKOWO w Krzeszowicach: depilacja laserowa i pielęgnacja twarzy. Laser na miejscu, dostępny każdego dnia pracy salonu. Umów wizytę: 517 899 229.',
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: 'ZJAWISKOWO Krzeszowice · Depilacja laserowa i salon kosmetyczny',
    description:
      'Depilacja laserowa i pielęgnacja twarzy w Krzeszowicach. Umów wizytę: 517 899 229.',
    locale: 'pl_PL',
    type: 'website',
    // Bez tego odnośnik wysłany na Messengerze czy WhatsAppie pokazuje pustą
    // kartę, a to główny kanał polecania salonu.
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ZJAWISKOWO — salon kosmetyczny i depilacja laserowa w Krzeszowicach',
      },
    ],
  },
  twitter: { card: 'summary_large_image' },
  // Druga warstwa blokady indeksowania, obok app/robots.ts.
  robots: indexingAllowed
    ? undefined
    : { index: false, follow: false, nocache: true },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const fonty = `${playfair.variable} ${montserrat.variable} ${marcellus.variable} ${jost.variable}`
  return (
    // Bez ręcznego <head>: Next sam wstrzykuje tam arkusze stylów, a własny
    // <head> w układzie głównym powodował, że w buildzie produkcyjnym nie
    // trafiał do dokumentu ani jeden <link rel="stylesheet"> i strona
    // renderowała się zupełnie bez stylów.
    <html lang="pl" className={fonty}>
      <body>
        {cookiebotId && (
          <Script
            id="Cookiebot"
            src="https://consent.cookiebot.com/uc.js"
            data-cbid={cookiebotId}
            data-blockingmode="auto"
            strategy="beforeInteractive"
          />
        )}
        {children}
      </body>
    </html>
  )
}
