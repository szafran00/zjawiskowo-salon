import type { Image } from 'sanity'

export type SanityImage = Image & { alt?: string }

export interface Settings {
  salonName?: string
  theme?: 'gold' | 'lavender' | 'white'
  heroKicker?: string
  tagline?: string
  heroLead?: string
  phone?: string
  showPromo?: boolean
  promoText?: string
  address?: string
  hours?: string
  facebookUrl?: string
  instagramUrl?: string
  googleMapsEmbedUrl?: string
  domain?: string
  footerNote?: string
  heroFaceImage?: SanityImage
  heroLaserImage?: SanityImage
  heroMainImage?: SanityImage
  heroSlides?: SanityImage[]
}

export interface Service {
  kicker?: string
  title?: string
  anchor?: string
  image?: SanityImage
  atuty?: string[]
  description?: unknown[]
  reverse?: boolean
  ctaLabel?: string
}

export interface Review {
  quote?: string
  author?: string
  rating?: number
}

export interface Faq {
  question?: string
  answer?: string
}

export interface GalleryImg {
  image?: SanityImage
  caption?: string
}

export interface HomeData {
  settings?: Settings | null
  services?: Service[]
  badges?: { text: string }[]
  reviews?: Review[]
  faqs?: Faq[]
  gallery?: GalleryImg[]
}
