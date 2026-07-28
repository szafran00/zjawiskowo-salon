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
  trustKicker?: string
  trustHeading?: string
  showTrust?: boolean
  reviewsKicker?: string
  reviewsHeading?: string
  showReviews?: boolean
  reviewsNote?: string
  googleReviewUrl?: string
  galleryKicker?: string
  galleryHeading?: string
  showGallery?: boolean
  showFaq?: boolean
  faqKicker?: string
  faqHeading?: string
  faqCtaLabel?: string
  priceTeaserKicker?: string
  priceTeaserHeading?: string
  ctaKicker?: string
  ctaHeading?: string
  ctaLead?: string
  ctaHint?: string
  treatmentsHeading?: string
  treatmentsCtaKicker?: string
  treatmentsCtaHeading?: string
  contactKicker?: string
  contactHeading?: string
  contactLead?: string
  formNote?: string
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
  introHeading?: string
  description?: PortableBlock[]
  detailsKicker?: string
  detailsHeading?: string
  pricelistAnchor?: string
  featured?: boolean
  ctaLabel?: string
  ctaKicker?: string
  ctaHeading?: string
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
  videoUrl?: string
}

export interface Badge {
  text?: string
}

export interface About {
  kicker?: string
  heading?: string
  lead?: string
  introKicker?: string
  introHeading?: string
  body?: PortableBlock[]
  atuty?: string[]
  whyHeading?: string
  image?: SanityImage
  ctaKicker?: string
  ctaHeading?: string
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
  pageKicker?: string
  pageHeading?: string
  intro?: string
  outro?: string
  ctaKicker?: string
  ctaHeading?: string
  groups?: PriceGroup[]
}

export interface Voucher {
  kicker?: string
  heading?: string
  lead?: string
  introKicker?: string
  introHeading?: string
  termsKicker?: string
  termsHeading?: string
  body?: PortableBlock[]
  bullets?: string[]
  image?: SanityImage
  ctaLabel?: string
  showOnHome?: boolean
  ctaKicker?: string
  ctaHeading?: string
  ctaLead?: string
}

export interface Terms {
  kicker?: string
  heading?: string
  lead?: string
  notice?: string
  body?: PortableBlock[]
  privacyIntro?: string
  privacyKicker?: string
  privacyHeading?: string
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
  badges?: Badge[]
  reviews?: Review[]
}
