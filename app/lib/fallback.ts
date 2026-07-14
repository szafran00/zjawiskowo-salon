import type { Settings, Treatment, Review, Faq, About, Pricelist } from './types'

// Domyślne treści (z makiety) — strona wygląda kompletnie także gdy fetch z Sanity zawiedzie.
export const STOCK = {
  face: 'https://images.pexels.com/photos/3985329/pexels-photo-3985329.jpeg?auto=compress&cs=tinysrgb&w=1200',
  laser: 'https://images.pexels.com/photos/4672470/pexels-photo-4672470.jpeg?auto=compress&cs=tinysrgb&w=1200',
  laserWide: 'https://images.pexels.com/photos/35103880/pexels-photo-35103880.jpeg?auto=compress&cs=tinysrgb&w=1200',
  slide1: 'https://images.pexels.com/photos/7750099/pexels-photo-7750099.jpeg?auto=compress&cs=tinysrgb&w=1400',
  slide2: 'https://images.pexels.com/photos/35103880/pexels-photo-35103880.jpeg?auto=compress&cs=tinysrgb&w=1400',
  slide3: 'https://images.pexels.com/photos/4672470/pexels-photo-4672470.jpeg?auto=compress&cs=tinysrgb&w=1400',
  main: 'https://images.pexels.com/photos/6899550/pexels-photo-6899550.jpeg?auto=compress&cs=tinysrgb&w=1600',
  about: 'https://images.pexels.com/photos/3997379/pexels-photo-3997379.jpeg?auto=compress&cs=tinysrgb&w=1200',
  gal: [
    'https://images.pexels.com/photos/4672470/pexels-photo-4672470.jpeg?auto=compress&cs=tinysrgb&w=900',
    'https://images.pexels.com/photos/3985329/pexels-photo-3985329.jpeg?auto=compress&cs=tinysrgb&w=900',
    'https://images.pexels.com/photos/6899550/pexels-photo-6899550.jpeg?auto=compress&cs=tinysrgb&w=900',
    'https://images.pexels.com/photos/35103880/pexels-photo-35103880.jpeg?auto=compress&cs=tinysrgb&w=900',
    'https://images.pexels.com/photos/13068361/pexels-photo-13068361.jpeg?auto=compress&cs=tinysrgb&w=900',
    'https://images.pexels.com/photos/7750099/pexels-photo-7750099.jpeg?auto=compress&cs=tinysrgb&w=900',
    'https://images.pexels.com/photos/36930886/pexels-photo-36930886.jpeg?auto=compress&cs=tinysrgb&w=900',
    'https://images.pexels.com/photos/6899550/pexels-photo-6899550.jpeg?auto=compress&cs=tinysrgb&w=900',
  ],
}

export const fallbackSettings: Settings = {
  salonName: 'ZJAWISKOWO',
  theme: 'gold',
  heroKicker: 'Salon kosmetyczny · Krzeszowice',
  tagline: 'Piękno zaczyna się tutaj',
  heroLead:
    'Kameralny salon, w którym zadbamy o Twoją skórę i komfort, z uśmiechem i pełnym profesjonalizmem.',
  phone: '517 899 229',
  showPromo: true,
  promoText: '−20% na pakiet depilacji laserowej w lipcu',
  address: '[ulica i numer], Krzeszowice',
  hours: 'pon.–pt. [godziny] · sob. [godziny]',
  facebookUrl: '#',
  instagramUrl: '#',
  domain: 'zjawiskowo.com.pl',
  footerNote:
    'Polityka prywatności i informacja o plikach cookies — [treść do uzupełnienia].',
}

export const fallbackTreatments: Treatment[] = [
  {
    title: 'Trwała depilacja laserowa na miejscu w Krzeszowicach',
    kicker: 'Depilacja laserowa',
    slug: 'laser',
    excerpt: 'Trwała redukcja owłosienia medycznym laserem. Gładka skóra na lata.',
    featured: true,
    ctaLabel: 'Umów wizytę',
    order: 0,
    atuty: [
      '100% ZADOWOLONYCH KLIENTÓW',
      'BEZKONKURENCYJNY LASER MEDYCZNY',
      'SKUTECZNOŚĆ I BEZPIECZEŃSTWO',
      'JEDWABIŚCIE GŁADKA SKÓRA NA LATA',
      'REDUKCJA OWŁOSIENIA JUŻ PO PIERWSZYM ZABIEGU',
      'ZAPOMNIJ O MASZYNCE I WOSKU',
      'WYBIERZ PAKIET PROMOCYJNY DOSTOSOWANY DO WŁASNYCH POTRZEB',
    ],
  },
  {
    title: 'Kosmetyka twarzy',
    kicker: 'Kosmetyka twarzy',
    slug: 'twarz',
    excerpt: 'Profesjonalne zabiegi gabinetowe na twarz, dopasowane do każdej cery.',
    featured: true,
    ctaLabel: 'Umów wizytę',
    order: 1,
    atuty: [
      'PROFESJONALNE ZABIEGI GABINETOWE DO KAŻDEJ CERY',
      'OCZYSZCZANIE, NAWILŻANIE, LIFTING',
      'PROFILAKTYKA PRZECIWSTARZENIOWA',
      'DOBÓR PIELĘGNACJI DOMOWEJ',
      'CERTYFIKOWANY SPRZĘT',
    ],
  },
]

export const fallbackBadges = [
  { text: '100% ZADOWOLONYCH KLIENTÓW' },
  { text: 'NAJWYŻEJ OCENIANY - NAJWIĘKSZA LICZBA REKOMENDACJI' },
  { text: 'I MIEJSCE W RANKINGU POZYTYWNYCH OPINII' },
  { text: 'NOMINACJA DO PLEBISCYTU „MISTRZOWIE URODY"' },
]

export const fallbackReviews: Review[] = [
  { quote: 'Cudowna atmosfera i widoczne efekty już po pierwszej wizycie. Polecam całym sercem!', author: 'Anna K.', rating: 5 },
  { quote: 'Pani właścicielka to profesjonalistka z ogromną wiedzą. Czuję się tu zaopiekowana.', author: 'Magda W.', rating: 5 },
  { quote: 'Depilacja laserowa bezboleśnie i skutecznie. W końcu gładka skóra na lata.', author: 'Ewelina S.', rating: 5 },
  { quote: 'Zabiegi na twarz zawsze dopasowane do mojej cery. Skóra wygląda zdrowo i promiennie.', author: 'Karolina P.', rating: 5 },
  { quote: 'Miła obsługa, czysto, elegancko i zawsze na czas. Najlepszy salon w Krzeszowicach.', author: 'Joanna R.', rating: 5 },
]

export const fallbackFaqs: Faq[] = [
  { question: 'Czy depilacja laserowa jest bezpieczna?', answer: 'Tak — pracujemy na medycznym laserze i zawsze zaczynamy od konsultacji oraz ustalenia bezpiecznych parametrów zabiegu. [do dopracowania]' },
  { question: 'Ile zabiegów potrzeba, aby zobaczyć efekty?', answer: 'Pierwsze efekty widać już po pierwszym zabiegu; pełną serię ustalamy indywidualnie, najczęściej to kilka sesji w odstępach. [do dopracowania]' },
  { question: 'Czy zabieg boli?', answer: 'Zabieg jest komfortowy — większość klientek odczuwa jedynie delikatne ciepło. [do dopracowania]' },
  { question: 'Jak przygotować się do wizyty?', answer: 'Na kilka dni przed zabiegiem prosimy o wygolenie okolicy i unikanie opalania. Szczegóły przekażemy przy zapisie. [do dopracowania]' },
  { question: 'Jakie są przeciwwskazania?', answer: 'Do najważniejszych należą m.in. ciąża, świeża opalenizna i niektóre schorzenia skóry — wszystko weryfikujemy podczas konsultacji. [do dopracowania]' },
  { question: 'Jakie formy płatności akceptujecie?', answer: 'Przyjmujemy płatność gotówką oraz kartą; dostępne są także pakiety promocyjne. [do dopracowania]' },
]

export const fallbackAbout: About = {
  heading: 'O salonie',
  lead: 'ZJAWISKOWO to kameralny salon kosmetyczny w Krzeszowicach, w którym depilację laserową medycznym laserem łączymy z profesjonalną kosmetyką twarzy.',
}

export const fallbackAboutBody =
  'Stawiamy na skuteczność, bezpieczeństwo i indywidualne podejście do każdej klientki. [Opis do uzupełnienia: historia salonu, kwalifikacje, atmosfera, podejście do klientek.]'

export const fallbackPricelist: Pricelist = {
  intro: 'Poniżej najczęściej wybierane zabiegi. Pełny cennik dostępny w salonie. [Ceny do uzupełnienia.]',
  groups: [
    {
      title: 'Depilacja laserowa',
      items: [
        { name: 'Depilacja – wąsik', price: '[cena]' },
        { name: 'Depilacja – pachy', price: '[cena]' },
        { name: 'Depilacja – bikini', price: '[cena]' },
        { name: 'Depilacja – całe nogi', price: '[cena]' },
        { name: 'Pakiet indywidualny', price: '[wycena]', note: 'dostosowany do potrzeb' },
      ],
    },
    {
      title: 'Kosmetyka twarzy',
      items: [
        { name: 'Oczyszczanie twarzy', price: '[cena]' },
        { name: 'Zabieg nawilżający', price: '[cena]' },
        { name: 'Zabieg przeciwzmarszczkowy / lifting', price: '[cena]' },
        { name: 'Konsultacja i dobór pielęgnacji', price: '[cena]' },
      ],
    },
  ],
}
