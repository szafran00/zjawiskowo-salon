import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

// Cookiebot (zgoda na cookies) — aktywuje się dopiero po ustawieniu ID domeny
// w zmiennej NEXT_PUBLIC_COOKIEBOT_ID. Tryb "auto" blokuje cookies do zgody.
const cookiebotId = process.env.NEXT_PUBLIC_COOKIEBOT_ID

export const metadata: Metadata = {
  title: 'ZJAWISKOWO Krzeszowice · Depilacja laserowa i salon kosmetyczny',
  description:
    'Salon kosmetyczny ZJAWISKOWO w Krzeszowicach: depilacja laserowa i pielęgnacja twarzy. Laser na miejscu, dostępny każdego dnia pracy salonu. Umów wizytę: 517 899 229.',
  metadataBase: new URL('https://zjawiskowo.com.pl'),
  openGraph: {
    title: 'ZJAWISKOWO Krzeszowice · Depilacja laserowa i salon kosmetyczny',
    description:
      'Depilacja laserowa i pielęgnacja twarzy w Krzeszowicach. Umów wizytę: 517 899 229.',
    locale: 'pl_PL',
    type: 'website',
  },
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
