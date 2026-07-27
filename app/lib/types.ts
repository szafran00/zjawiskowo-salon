import type { Image } from 'sanity'

export type SanityImage = Image & { alt?: string }
export type PortableBlock = { _type: string; [key: string]: unknown }

export interface Settings {
  salonName?: string
  salonSubtitle?: string
  theme?: 'gold' | 'lavender' | 'white'
  heroKicker?: string
  tagline?: string
  heroLead?: string
  phone?: string
  pillarsKicker?: string
  pillarsHeading?: string
  pillarsLead?: string
  galleryKicker?: string
  galleryHeading?: string
  showGallery?: boolean
  showFaq?: boolean
  ctaHeading?: string
  ctaLead?: string
  showPromo?: boolean
  promoText?: string
  address?: string
  hours?: string
  contactNotes?: string[]
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
  navLabel?: string
  slug?: string
  excerpt?: string
  image?: SanityImage
  atuty?: string[]
  description?: PortableBlock[]
  pricelistAnchor?: string
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
  kicker?: string
  heading?: string
  lead?: string
  body?: PortableBlock[]
  atuty?: string[]
  image?: SanityImage
}

export interface PriceItem {
  name?: string
  price?: string
  note?: string
}

export interface PriceGroup {
  title?: string
  anchor?: string
  showInMenu?: boolean
  note?: string
  items?: PriceItem[]
}

export interface Pricelist {
  intro?: string
  outro?: string
  groups?: PriceGroup[]
}

export interface Voucher {
  kicker?: string
  heading?: string
  lead?: string
  body?: PortableBlock[]
  bullets?: string[]
  image?: SanityImage
  ctaLabel?: string
  showOnHome?: boolean
}

export interface Terms {
  kicker?: string
  heading?: string
  lead?: string
  notice?: string
  body?: PortableBlock[]
  privacyIntro?: string
  updatedAt?: string
}

/** Pozycja rozwijanego menu „Zabiegi”. */
export interface NavTreatment {
  title?: string
  kicker?: string
  navLabel?: string
  slug?: string
}

/** Pozycja rozwijanego menu „Cennik”. */
export interface NavPriceGroup {
  title?: string
  anchor?: string
  showInMenu?: boolean
}

export interface LayoutData {
  settings?: Settings | null
  navTreatments?: NavTreatment[] | null
  navPriceGroups?: NavPriceGroup[] | null
}

export interface HomeData {
  settings?: Settings | null
  treatments?: Treatment[]
  voucher?: Voucher | null
  faqs?: Faq[]
  gallery?: GalleryImg[]
}
