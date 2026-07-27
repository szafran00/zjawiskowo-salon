import { siteSettings } from './siteSettings'
import { aboutPage } from './aboutPage'
import { pricelist } from './pricelist'
import { voucherPage } from './voucherPage'
import { termsPage } from './termsPage'
import { service } from './service'
import { trustBadge } from './trustBadge'
import { review } from './review'
import { faqItem } from './faqItem'
import { galleryItem } from './galleryItem'

// trustBadge i review zostają zarejestrowane (dokumenty w bazie nie giną),
// ale nie są renderowane na stronie ani widoczne w menu panelu — klientka
// zrezygnowała z karuzeli opinii i osobnej sekcji „Dlaczego ZJAWISKOWO”.
export const schemaTypes = [
  siteSettings,
  aboutPage,
  pricelist,
  voucherPage,
  termsPage,
  service,
  trustBadge,
  review,
  faqItem,
  galleryItem,
]
