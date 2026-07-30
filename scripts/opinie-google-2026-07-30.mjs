// Prawdziwe opinie z wizytówki Google w miejsce pięciu przykładowych.
//
//   node scripts/opinie-google-2026-07-30.mjs --dry
//   node scripts/opinie-google-2026-07-30.mjs
//
// Treść przepisana dosłownie, razem z emoji, literówkami i łamaniem wierszy.
// Cytatu z opinii nie wolno redagować: to wypowiedź konkretnej osoby, a strona
// twierdzi pod karuzelą, że opinie pochodzą z wizytówki Google.
//
// Podpisy skrócone do imienia i pierwszej litery nazwiska. W Google widnieją
// pełne dane, ale przeniesienie ich na własną stronę to już publikowanie
// cudzych danych osobowych — imię z inicjałem wystarcza, żeby opinia była
// wiarygodna.
import fs from 'node:fs'

const DRY = process.argv.includes('--dry')
const PROJECT = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'kleyi1aa'
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const APIV = '2024-10-01'

const env = fs.readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
const token = env.match(/^SANITY_API_WRITE_TOKEN=(.+)$/m)?.[1]?.trim()
if (!token) {
  console.error('Brak SANITY_API_WRITE_TOKEN w .env.local')
  process.exit(1)
}

const OPINIE = [
  {
    author: 'Ewelina C.',
    quote:
      'Serdecznie polecam salon Zjawiskowo.\nZabiegi wykonywane są profesjonalnie, z dużym zaangażowaniem i indywidualnym podejściem do klienta. Pani Marta tworzy niesamowitą atmosferę, jest niezwykle miłą i ciepłą osobą. Posiada dużą wiedzę z zakresu kosmetologii, a zabiegi przynoszą oczekiwane efekty. Polecam!',
  },
  {
    author: 'Nadia S.',
    quote:
      'Bardzo polecam! Miałam wykonane oczyszczanie manualne oraz oczyszczanie wodorowe i jestem bardzo zadowolona z efektów. Zabieg został przeprowadzony dokładnie, delikatnie i w bardzo przyjemnej atmosferze. Pani Marta wszystko mi wyjaśniła, zadbała o komfort i dobrała odpowiednią pielęgnację. Po zabiegu skóra była wyraźnie oczyszczona, świeża i wyglądała zdrowiej. Widać profesjonalizm i duże zaangażowanie. Na pewno wrócę 🤍',
  },
  {
    author: 'Anna',
    quote:
      'Bardzo polecam wizyty u Pani Marty! 🙂\nTo kosmetyczka z ogromną empatią i świetnym podejściem do klienta – od razu można poczuć się swobodnie i zaopiekowanym. Podczas zabiegów czas mija bardzo szybko, a atmosfera jest naprawdę przyjemna.\n\nKorzystałam z oczyszczania twarzy oraz depilacji i w obu przypadkach byłam bardzo zadowolona z efektów. Zabiegi zostały wykonane dokładnie i profesjonalnie, a Pani Marta wszystko spokojnie tłumaczy i doradza.\n\nDużym plusem jest także wygodna lokalizacja gabinetu oraz dostępny parking, co bardzo ułatwia dojazd. Na pewno będę wracać i szczerze polecam!👍',
  },
  {
    author: 'Jan O.',
    quote:
      'Depilacja REWELACJA! Sam nie wierzyłem, że z moimi mega owłosionymi plecami da się coś w ogóle zrobić. Włos na włosie, gęste i grube. Po pierwszym zabiegu już był niesamowity efekt. Zrobiłem już trzy i jestem bardzo pozytywnie zaskoczony, na pewno nie ma połowy włosów albo i więcej. Depiluję jeszcze kark i pachy. Zostały tam praktycznie minimalne ilości włosów.\nPani Marta ma świetny laser i wie jak dobrać parametry. Jestem bardzo zadowolony.\nSzczerze polecam!',
  },
  {
    author: 'Anna G.',
    quote:
      'Gorąco polecam salon Zjawiskowo i panią Martę. Sama wybrałam się w to miejsce po przeczytaniu zachęcających opinii w Google i nie żałuję. Pani Marta jest profesjonalistką, co bardzo ważne, nie ma pośpiechu, jest dokładność w wykonywaniu zabiegów. Atmosfera jest bardzo miła, pani Marta szczerze doradzi i wyjaśni w przypadku wątpliwości. Na pierwszą wizytę przyszłam tylko z manicure i regulacją brwi, teraz zdecydowałam się dodatkowo na serię zabiegów depilacji laserem najnowszym sprzętem i za bardzo dobrą cenę. Zachęcam do wizyty w tym gabinecie, bo naprawdę warto :)',
  },
  {
    author: 'Klaudia M.',
    quote:
      'Jestem bardzo zadowolona z zabiegów depilacji laserowej.Pełen profesjonalizm, dokładność i świetna atmosfera. Zawsze czuję się zaopiekowana, wszystko przebiega spokojnie i z dbałością o klienta ☺️ Pani Marta♥️ to osoba z którą zawsze można miło porozmawiać i pożartować przez co będąc na zabiegu za pierwszym razem wogóle nie czułam się skrępowana. Polecam to miejsce z czystym sumieniem ♥️',
  },
  {
    author: 'Koleta C.',
    quote:
      'Bardzo mocno polecam salon Zjawiskowo. Profesjonalizm widac na kazdym kroku :) Pani Marta to kobieta Anioł 😘🤗 sympatyczna, serdeczna, a jednocześnie stanowcza w tym co robi :) depilacja laserowa u Pani Marty jest szybka, skuteczna nooo i prawie bezbolesna 😅😝 polecam w 100%…',
  },
  {
    author: 'Aga',
    quote:
      'Polecam z całego serca ❤️ Salon Kosmetyczny ZJAWISKOWO i wykonywaną w nim depilację laserową. Profesjonalna i co ważne bezbolesna usługa depilacji na nowoczesnym sprzęcie i przemiła 🙂 pani Marta. To już kolejny mój zabieg , po których widać efekty.',
  },
  {
    author: 'Ewelina O.',
    quote:
      'Pani Marta ma dar tworzenia klimatu, w którym czas się zatrzymuje. To coś więcej niż wizyta kosmetyczna – to czas na prawdziwy reset dla głowy i ciała. Z ogromną wrażliwością podchodzi do każdej klientki, co sprawia, że można się tam całkowicie odprężyć. Takie chwile,które tworzy Pani Marta, pozwalają na zatrzymanie się w biegu, spojrzenie na siebie z życzliwością i miłością.',
  },
  {
    author: 'Ania N.',
    quote:
      'Jestem po kolejnej wizycie w salonie i po raz kolejny utwierdziłam się w przekonaniu, że to miejsce zasługuje na najwyższe oceny. To nowoczesny, profesjonalnie prowadzony gabinet z bardzo bogatą i starannie dobraną ofertą zabiegów.\n\nPani Marta to specjalistka o wysokich kwalifikacjach i imponującej wiedzy, którą chętnie się dzieli, zawsze trafnie doradzając i indywidualnie podchodząc do potrzeb klienta. Każdy wykonany zabieg był w pełni udany i przyniósł doskonałe efekty.\n\nSalon jest niezwykle czysty, estetycznie urządzony i zapraszający — panuje w nim spokojna, relaksująca atmosfera sprzyjająca wyciszeniu i odpoczynkowi.\n\nZ pełnym przekonaniem polecam ten salon i z przyjemnością będę do niego wracać.',
  },
]

const mutations = OPINIE.map((o, i) => ({
  createOrReplace: {
    _id: `review-${i + 1}`,
    _type: 'review',
    author: o.author,
    quote: o.quote,
    rating: 5,
    hidden: false,
    order: i + 1,
  },
}))

console.log(`Opinii do zapisania: ${OPINIE.length}`)
OPINIE.forEach((o, i) =>
  console.log(`  ${i + 1}. ${o.author.padEnd(12)} ${o.quote.length} znaków`)
)
console.log(
  `\nNajdłuższa: ${Math.max(...OPINIE.map((o) => o.quote.length))} znaków ` +
    `(poprzednie przykładowe miały po ~80)`
)

if (DRY) {
  console.log('(--dry: nic nie zapisano)')
  process.exit(0)
}

const res = await fetch(
  `https://${PROJECT}.api.sanity.io/v${APIV}/data/mutate/${DATASET}?returnIds=true`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ mutations }),
  }
)
const out = await res.json()
if (!res.ok) {
  console.error('BŁĄD zapisu:', JSON.stringify(out, null, 2))
  process.exit(1)
}
console.log('Zapisano:', (out.results || []).length, 'opinii')
