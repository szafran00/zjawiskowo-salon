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

// Zdjęcia zastępcze (placeholdery, do podmiany przez klientkę w panelu).
//
// Zestaw pochodzi z listy zweryfikowanej w projekcie
// (design/2026-07-28/zdjecia-stockowe-zapas.html) i trzyma się jej reguły
// doboru: wyłącznie zabiegi i skóra, BEZ widocznego sprzętu (laserów,
// aparatury) i BEZ wnętrz salonu — wnętrze na zdjęciu nie jest tym salonem,
// a laser w kadrze zamienia stronę salonu w katalog urządzeń.
//
// Definicja siedzi tutaj, a nie w sanity/seed/content.mjs, bo tamten plik jest
// źródłem treści dla panelu i seedu; adresy zdjęć zastępczych to warstwa
// wizualna. Wszystkie kadry na licencji Pexels (użytek komercyjny).
const px = (id: number, w = 1200) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`

const SKIN_LEGS = 4672470 // gładka skóra nóg — efekt depilacji
// Poprzedni kadr (6187298) klientka odrzuciła: ciemne ujęcie, w którym dłonie
// czytały się jako męskie. Ten pokazuje dłonie kosmetyczki nad twarzą klientki,
// jasno i bez wątpliwości, kto wykonuje zabieg.
const FACE_HANDS = 37229294 // dłonie kosmetyczki nad twarzą klientki
const FACE_MASK = 3762564 // pielęgnacja twarzy — maska, portret
const FACE_MASK_2 = 3762553 // pielęgnacja twarzy — maska, oczy zamknięte
const FACE_CREAM = 16574941 // nakładanie kosmetyku na twarz
const FACE_RELAX = 6663388 // maska i opaska — relaks
const COSMETICS = 5240623 // kosmetyki / serum
// Poprzedni kadr (34939742) pokazywał butelki z czytelną nazwą obcej marki
// („WHITEWOOD") na tle ściany, więc wyglądał jak wnętrze cudzego salonu.
const COSMETICS_2 = 33794143 // serum z pipetą, bez obcych oznaczeń
// Osobny kadr wyłącznie do galerii. Wcześniej stało tu to samo zdjęcie, co na
// kaflu „Pielęgnacja twarzy”, więc na jednej stronie wychodziło dwa razy.
const FACE_BRUSH = 37229301 // nakładanie maski pędzlem
// Gładka skóra przedramienia. Wskazana przez klientkę luka w galerii: „fajnie
// byłoby dołożyć jeszcze chociaż jedno zdjęcie dot. depilacji innej partii
// ciała" — do tej pory jedynym kadrem depilacyjnym były nogi, choć cennik
// obejmuje też ręce, pachy i plecy.
const SKIN_ARM = 6810872 // gładka skóra przedramienia

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
} = {
  // Kadr wskazany przez klientkę 2 sierpnia: „na stronie głównej zamiast tego
  // zdjęcia w Pielęgnacja twarzy chciałabym prosić to przesłane poniżej"
  // (odesłała dokładnie ten kadr, który stał wtedy w galerii).
  face: px(FACE_MASK_2),
  laser: px(SKIN_LEGS),
  laserWide: px(SKIN_LEGS),
  slide1: px(SKIN_LEGS, 1400),
  slide2: px(FACE_HANDS, 1400),
  slide3: px(FACE_MASK, 1400),
  main: px(FACE_CREAM, 1600),
  about: px(FACE_MASK),
  voucher: px(COSMETICS),
  gal: [
    px(SKIN_LEGS, 900),
    px(FACE_BRUSH, 900),
    px(COSMETICS_2, 900),
    px(FACE_MASK, 900),
    // Tu stał kadr, który od 2 sierpnia jest kaflem „Pielęgnacja twarzy”.
    // Klientka poprosiła, żeby zniknął z galerii („bo ono już będzie przy
    // pielęgnacji”), a jego miejsce zajęła druga partia ciała przy depilacji.
    // Nie COSMETICS: ten kadr stoi już na kaflu „Vouchery podarunkowe”,
    // a galeria jest na tej samej stronie kilka sekcji niżej.
    px(SKIN_ARM, 900),
    px(FACE_RELAX, 900),
    px(FACE_CREAM, 900),
  ],
}

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
