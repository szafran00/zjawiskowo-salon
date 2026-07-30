import type { Metadata } from 'next'
import Script from 'next/script'
import { indexingAllowed } from './lib/indexing'
import './globals.css'

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
  return (
    <html lang="pl">
      <head>
        {cookiebotId && (
          <Script
            id="Cookiebot"
            src="https://consent.cookiebot.com/uc.js"
            data-cbid={cookiebotId}
            data-blockingmode="auto"
            strategy="beforeInteractive"
          />
        )}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Montserrat:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
