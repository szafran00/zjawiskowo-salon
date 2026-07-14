import { groq } from 'next-sanity'

export const HOME_QUERY = groq`{
  "settings": *[_type == "siteSettings"][0]{
    salonName, theme, heroKicker, tagline, heroLead, phone,
    showPromo, promoText, address, hours, facebookUrl, instagramUrl,
    googleMapsEmbedUrl, domain, footerNote,
    heroFaceImage, heroLaserImage, heroMainImage, heroSlides
  },
  "services": *[_type == "service"] | order(order asc){
    kicker, title, "anchor": anchor.current, image, atuty, description, reverse, ctaLabel
  },
  "badges": *[_type == "trustBadge"] | order(order asc){ text },
  "reviews": *[_type == "review"] | order(order asc){ quote, author, rating },
  "faqs": *[_type == "faqItem"] | order(order asc){ question, answer },
  "gallery": *[_type == "galleryItem"] | order(order asc){ image, caption }
}`
