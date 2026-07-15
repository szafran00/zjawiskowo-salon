import type { Image } from 'sanity'

export type SanityImage = Image & { alt?: string }
export type PortableBlock = { _type: string; [key: string]: unknown }

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
  contactEmail?: string
  formEndpoint?: string
  domain?: string
  footerNote?: string
  heroFaceImage?: SanityImage
  heroLaserImage?: SanityImage
  heroMainImage?: SanityImage
  heroSlides?: SanityImage[]
}

export interface Treatment {
  title?: string
  kicker?: string
  slug?: string
  excerpt?: string
  image?: SanityImage
  atuty?: string[]
  description?: PortableBlock[]
  featured?: boolean
  ctaLabel?: string
  order?: number
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

export interface About {
  heading?: string
  lead?: string
  body?: PortableBlock[]
  image?: SanityImage
}

export interface PriceItem {
  name?: string
  price?: string
  note?: string
}

export interface PriceGroup {
  title?: string
  items?: PriceItem[]
}

export interface Pricelist {
  intro?: string
  groups?: PriceGroup[]
}

export interface HomeData {
  settings?: Settings | null
  treatments?: Treatment[]
  badges?: { text: string }[]
  reviews?: Review[]
  faqs?: Faq[]
  gallery?: GalleryImg[]
}
