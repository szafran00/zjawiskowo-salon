import type {
  Settings,
  Treatment,
  Review,
  Faq,
  About,
  Pricelist,
  Voucher,
  Terms,
} from './types'
import * as content from '@/sanity/seed/content.mjs'

// Przykładowe treści (do podmiany przez klientkę). Strona wygląda kompletnie
// także wtedy, gdy pobranie danych z Sanity zawiedzie.
//
// Źródłem jest sanity/seed/content.mjs — zwykły moduł JS, żeby ten sam zestaw
// zasilał zarówno stronę, jak i skrypt seedujący panel (npm run seed).
// Tutaj nadajemy mu jedynie typy.

export const STOCK: {
  face: string
  laser: string
  laserWide: string
  slide1: string
  slide2: string
  slide3: string
  main: string
  about: string
  voucher: string
  gal: string[]
} = content.STOCK

// Moduł .mjs nie niesie typów (np. `theme` widzi jako `string`), więc przy
// przypisaniu domykamy je jawnie.
export const fallbackSettings = content.settings as Settings
export const fallbackTreatments = content.treatments as Treatment[]
export const fallbackPricelist = content.pricelist as Pricelist
export const fallbackFaqs = content.faqs as Faq[]
export const fallbackAbout = content.about as About
export const fallbackAboutBody: string = content.aboutBody
export const fallbackVoucher = content.voucher as Voucher
export const fallbackTerms = content.terms as Terms

// Wycofane z zakresu — schematy zostają, treść nie jest renderowana.
export const fallbackBadges: { text: string }[] = content.badges
export const fallbackReviews: Review[] = content.reviews
