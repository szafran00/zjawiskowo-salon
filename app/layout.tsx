import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ZJAWISKOWO — salon kosmetyczny · Krzeszowice',
  description:
    'Salon kosmetyczny ZJAWISKOWO w Krzeszowicach. Depilacja laserowa medycznym laserem oraz profesjonalna kosmetyka twarzy. Umów wizytę: 517 899 229.',
  metadataBase: new URL('https://zjawiskowo.com.pl'),
  openGraph: {
    title: 'ZJAWISKOWO — salon kosmetyczny · Krzeszowice',
    description:
      'Depilacja laserowa i kosmetyka twarzy w Krzeszowicach. Umów wizytę: 517 899 229.',
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
