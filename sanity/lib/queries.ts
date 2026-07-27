import { groq } from 'next-sanity'

const settingsProjection = `{
  salonName, theme, heroKicker, tagline, heroLead, phone,
  pillarsKicker, pillarsHeading, pillarsLead,
  galleryKicker, galleryHeading, showGallery, showFaq,
  ctaHeading, ctaLead,
  showPromo, promoText, address, hours, contactNotes, facebookUrl, instagramUrl,
  googleMapsEmbedUrl, contactEmail, formEndpoint, domain, footerNote,
  heroFaceImage, heroLaserImage, heroMainImage, heroSlides
}`

const treatmentProjection = `{
  title, kicker, navLabel, "slug": slug.current, excerpt, image, atuty, description,
  pricelistAnchor, featured, ctaLabel, order
}`

const pricelistProjection = `{
  intro, outro,
  groups[]{ title, anchor, showInMenu, note, items[]{ name, price, note } }
}`

const voucherProjection = `{ kicker, heading, lead, body, bullets, image, ctaLabel, showOnHome }`

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
  "gallery": *[_type == "galleryItem"] | order(order asc){ image, caption }
}`

export const TREATMENTS_QUERY = groq`*[_type == "service"] | order(order asc)${treatmentProjection}`

export const TREATMENT_QUERY = groq`*[_type == "service" && slug.current == $slug][0]${treatmentProjection}`

export const TREATMENT_SLUGS_QUERY = groq`*[_type == "service" && defined(slug.current)]{ "slug": slug.current }`

export const ABOUT_QUERY = groq`*[_type == "aboutPage"][0]{ kicker, heading, lead, body, atuty, image }`

export const PRICELIST_QUERY = groq`*[_type == "pricelist"][0]${pricelistProjection}`

export const VOUCHER_QUERY = groq`*[_type == "voucherPage"][0]${voucherProjection}`

export const TERMS_QUERY = groq`*[_type == "termsPage"][0]{
  kicker, heading, lead, notice, body, privacyIntro, updatedAt
}`
