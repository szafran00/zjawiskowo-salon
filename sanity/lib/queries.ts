import { groq } from 'next-sanity'

const settingsProjection = `{
  salonName, theme, heroKicker, tagline, heroLead, phone,
  showPromo, promoText, address, hours, facebookUrl, instagramUrl,
  googleMapsEmbedUrl, contactEmail, formEndpoint, domain, footerNote,
  heroFaceImage, heroLaserImage, heroMainImage, heroSlides
}`

const treatmentProjection = `{
  title, kicker, "slug": slug.current, excerpt, image, atuty, description, featured, ctaLabel, order
}`

export const SETTINGS_QUERY = groq`*[_type == "siteSettings"][0]${settingsProjection}`

export const HOME_QUERY = groq`{
  "settings": *[_type == "siteSettings"][0]${settingsProjection},
  "treatments": *[_type == "service"] | order(order asc)${treatmentProjection},
  "badges": *[_type == "trustBadge"] | order(order asc){ text },
  "reviews": *[_type == "review"] | order(order asc){ quote, author, rating },
  "faqs": *[_type == "faqItem"] | order(order asc){ question, answer },
  "gallery": *[_type == "galleryItem"] | order(order asc){ image, caption }
}`

export const TREATMENTS_QUERY = groq`*[_type == "service"] | order(order asc)${treatmentProjection}`

export const TREATMENT_QUERY = groq`*[_type == "service" && slug.current == $slug][0]${treatmentProjection}`

export const TREATMENT_SLUGS_QUERY = groq`*[_type == "service" && defined(slug.current)]{ "slug": slug.current }`

export const ABOUT_QUERY = groq`*[_type == "aboutPage"][0]{ heading, lead, body, image }`

export const PRICELIST_QUERY = groq`*[_type == "pricelist"][0]{ intro, groups[]{ title, items[]{ name, price, note } } }`
