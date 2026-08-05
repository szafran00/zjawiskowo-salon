import { groq } from 'next-sanity'

const settingsProjection = `{
  salonName, salonSubtitle, theme, heroKicker, tagline, heroLead, phone,
  pillarsKicker, pillarsHeading, pillarsLead,
  trustKicker, trustHeading, showTrust,
  reviewsKicker, reviewsHeading, showReviews, reviewsNote, googleReviewUrl,
  galleryKicker, galleryHeading, showGallery,
  showFaq, faqKicker, faqHeading, faqCtaLabel,
  priceTeaserKicker, priceTeaserHeading,
  ctaKicker, ctaHeading, ctaLead, ctaHint,
  treatmentsHeading, treatmentsCtaKicker, treatmentsCtaHeading,
  contactKicker, contactHeading, contactLead,
  showPromo, promoText, address, hours, contactNotes, facebookUrl, instagramUrl,
  googleMapsEmbedUrl, domain, footerNote,
  heroFaceImage, heroLaserImage, heroMainImage, heroSlides
}`

const treatmentProjection = `{
  title, kicker, navLabel, "slug": slug.current, excerpt, image, atuty,
  introHeading, description, detailsKicker, detailsHeading,
  pricelistAnchor, featured, ctaLabel, ctaKicker, ctaHeading, order
}`

const pricelistProjection = `{
  pageKicker, pageHeading, intro, outro, ctaKicker, ctaHeading,
  groups[]{
    title, anchor, showInMenu, note, noteAfter,
    items[]{ name, price, oldPrice, saving, gratis, note }
  }
}`

const voucherProjection = `{
  kicker, heading, lead, introKicker, introHeading,
  termsKicker, termsHeading, body, bullets, image, ctaLabel, showOnHome,
  ctaKicker, ctaHeading, ctaLead
}`

export const SETTINGS_QUERY = groq`*[_type == "siteSettings"][0]${settingsProjection}`

// Dane wspólne dla całego layoutu: ustawienia + pozycje rozwijanych menu.
export const LAYOUT_QUERY = groq`{
  "settings": *[_type == "siteSettings"][0]${settingsProjection},
  "navTreatments": *[_type == "service"] | order(order asc){ title, kicker, navLabel, "slug": slug.current },
  "navPriceGroups": *[_type == "pricelist"][0].groups[]{ title, anchor, showInMenu }
}`

export const HOME_QUERY = groq`{
  "settings": *[_type == "siteSettings"][0]${settingsProjection},
  "treatments": *[_type == "service"] | order(order asc)${treatmentProjection},
  "voucher": *[_type == "voucherPage"][0]${voucherProjection},
  "faqs": *[_type == "faqItem"] | order(order asc){ question, answer },
  "gallery": *[_type == "galleryItem"] | order(order asc){ image, caption, videoUrl },
  "badges": *[_type == "trustBadge"] | order(order asc){ text },
  "reviews": *[_type == "review" && hidden != true] | order(order asc){ quote, author, rating }
}`

export const TREATMENTS_QUERY = groq`*[_type == "service"] | order(order asc)${treatmentProjection}`

export const TREATMENT_QUERY = groq`*[_type == "service" && slug.current == $slug][0]${treatmentProjection}`

export const TREATMENT_SLUGS_QUERY = groq`*[_type == "service" && defined(slug.current)]{ "slug": slug.current }`

export const ABOUT_QUERY = groq`*[_type == "aboutPage"][0]{
  kicker, heading, lead, introKicker, introHeading, body, atuty, whyHeading, image,
  ctaKicker, ctaHeading
}`

export const PRICELIST_QUERY = groq`*[_type == "pricelist"][0]${pricelistProjection}`

export const VOUCHER_QUERY = groq`*[_type == "voucherPage"][0]${voucherProjection}`

export const TERMS_QUERY = groq`*[_type == "termsPage"][0]{
  kicker, heading, lead, notice, body, privacyIntro,
  privacyKicker, privacyHeading, updatedAt
}`
