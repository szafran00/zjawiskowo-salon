// Domyślne treści (przykładowe, do podmiany przez klientkę) — strona wygląda
// kompletnie także wtedy, gdy pobranie danych z Sanity zawiedzie.
// Ten sam zestaw jest źródłem seedu do Sanity (scripts/seed.mjs).



/** Buduje Portable Text z prostej listy [styl, tekst]. */
export function blocks(id, lines) {
  return lines.map(([style, text], i) => ({
    _type: 'block',
    _key: `${id}-${i}`,
    style,
    markDefs: [],
    children: [{ _type: 'span', _key: `${id}-${i}-s`, text, marks: [] }],
  }))
}

export const STOCK = {
  face: 'https://images.pexels.com/photos/3985329/pexels-photo-3985329.jpeg?auto=compress&cs=tinysrgb&w=1200',
  laser: 'https://images.pexels.com/photos/4672470/pexels-photo-4672470.jpeg?auto=compress&cs=tinysrgb&w=1200',
  laserWide: 'https://images.pexels.com/photos/35103880/pexels-photo-35103880.jpeg?auto=compress&cs=tinysrgb&w=1200',
  slide1: 'https://images.pexels.com/photos/7750099/pexels-photo-7750099.jpeg?auto=compress&cs=tinysrgb&w=1400',
  slide2: 'https://images.pexels.com/photos/35103880/pexels-photo-35103880.jpeg?auto=compress&cs=tinysrgb&w=1400',
  slide3: 'https://images.pexels.com/photos/4672470/pexels-photo-4672470.jpeg?auto=compress&cs=tinysrgb&w=1400',
  main: 'https://images.pexels.com/photos/6899550/pexels-photo-6899550.jpeg?auto=compress&cs=tinysrgb&w=1600',
  about: 'https://images.pexels.com/photos/3997379/pexels-photo-3997379.jpeg?auto=compress&cs=tinysrgb&w=1200',
  voucher: 'https://images.pexels.com/photos/6634871/pexels-photo-6634871.jpeg?auto=compress&cs=tinysrgb&w=1200',
  gal: [
    'https://images.pexels.com/photos/4672470/pexels-photo-4672470.jpeg?auto=compress&cs=tinysrgb&w=900',
    'https://images.pexels.com/photos/3985329/pexels-photo-3985329.jpeg?auto=compress&cs=tinysrgb&w=900',
    'https://images.pexels.com/photos/6899550/pexels-photo-6899550.jpeg?auto=compress&cs=tinysrgb&w=900',
    'https://images.pexels.com/photos/35103880/pexels-photo-35103880.jpeg?auto=compress&cs=tinysrgb&w=900',
    'https://images.pexels.com/photos/13068361/pexels-photo-13068361.jpeg?auto=compress&cs=tinysrgb&w=900',
    'https://images.pexels.com/photos/7750099/pexels-photo-7750099.jpeg?auto=compress&cs=tinysrgb&w=900',
    'https://images.pexels.com/photos/36930886/pexels-photo-36930886.jpeg?auto=compress&cs=tinysrgb&w=900',
    'https://images.pexels.com/photos/3997379/pexels-photo-3997379.jpeg?auto=compress&cs=tinysrgb&w=900',
  ],
}

export const settings = {
  salonName: 'ZJAWISKOWO',
  salonSubtitle: 'Salon kosmetyczny · Depilacja laserowa',
  theme: 'gold',
  heroKicker: 'Salon kosmetyczny · Depilacja laserowa · Krzeszowice',
  tagline: 'Piękno zaczyna się tutaj',
  heroLead:
    'Kameralny salon w Krzeszowicach, w którym depilacja laserowa spotyka się ze spokojną, dobrze dobraną pielęgnacją twarzy. Prowadzę go sama, więc od konsultacji po ostatni zabieg w serii jesteś w tych samych rękach.',
  phone: '517 899 229',
  pillarsKicker: 'Oferta salonu',
  pillarsHeading: 'Dwa filary ZJAWISKOWO',
  pillarsLead:
    'Depilacja laserowa i pielęgnacja twarzy. Dwie ścieżki, które prowadzę osobno albo łączę, zależnie od tego, czego potrzebuje Twoja skóra.',
  galleryKicker: 'Galeria',
  galleryHeading: 'Wnętrze salonu',
  showGallery: true,
  showFaq: true,
  ctaHeading: 'Umów wizytę',
  ctaLead:
    'Najprościej zadzwonić. Porozmawiamy o Twojej skórze, dobierzemy zabieg i znajdziemy termin, który Ci pasuje.',
  showPromo: true,
  promoText: 'Rezerwacja pakietu jesiennego do końca sierpnia',
  address: 'ul. 3 Maja [numer do uzupełnienia], 32-065 Krzeszowice',
  hours: 'poniedziałek – piątek 9:00 – 19:00 · sobota 9:00 – 14:00',
  contactNotes: [
    'Bezpłatny parking',
    'Budynek przy automyjni',
    'Wejście od strony parkingu, parter',
  ],
  googleMapsEmbedUrl:
    'https://www.google.com/maps?q=ul.%203%20Maja%2C%20Krzeszowice&output=embed',
  facebookUrl: '#',
  instagramUrl: '#',
  domain: 'zjawiskowo.com.pl',
  footerNote:
    'Zasady korzystania z usług opisuje regulamin salonu, a informacje o danych osobowych i plikach cookies znajdziesz w polityce prywatności.',
}

/* ── Zabiegi ─────────────────────────────────────────────────────────── */

const laserDescription = blocks('laser', [
  ['normal',
    'Depilacja laserowa opiera się na zjawisku fototermolizy selektywnej. Wiązka światła jest pochłaniana przede wszystkim przez melaninę, czyli barwnik zawarty we włosie i w mieszku włosowym, a nie przez otaczającą skórę. Pochłonięta energia zamienia się w ciepło, które oddziałuje na struktury odpowiedzialne za odrastanie włosa. Najlepiej reagują włosy ciemne i grube przy jaśniejszej skórze; włosy bardzo jasne, rude i siwe zawierają mało melaniny, więc efekt bywa u nich niewielki.'],
  ['h3', 'Dlaczego zabiegi wykonuje się w serii'],
  ['normal',
    'Laser działa skutecznie tylko na włosy będące w fazie aktywnego wzrostu, a w danym momencie znajduje się w niej zaledwie część owłosienia na danym obszarze. Dlatego jeden zabieg z założenia nie obejmuje wszystkich włosów, a kolejne wizyty trafiają w te, które w międzyczasie weszły w fazę wzrostu. U większości osób pełna seria to około ośmiu zabiegów, choć bywa ich mniej lub więcej, zależnie od partii ciała, koloru i grubości włosa oraz uwarunkowań hormonalnych.'],
  ['h3', 'Laser na miejscu, terminy bez przerw'],
  ['normal',
    'Laser stoi na miejscu w Krzeszowicach i jest dostępny każdego dnia pracy salonu, więc kolejne wizyty umawiamy w terminie, który Ci pasuje, bez czekania na wolny sprzęt. To ma znaczenie praktyczne: seria działa najlepiej wtedy, gdy odstępy między zabiegami są zachowane. Zbyt krótka przerwa oznacza pracę na włosach poza fazą wzrostu, zbyt długa pozwala części mieszków przejść cały cykl. Odstęp ustalamy indywidualnie, zwykle jest krótszy dla twarzy i dłuższy dla nóg i pleców.'],
  ['h3', 'Jak przygotować się do wizyty'],
  ['normal',
    'Obszar zabiegu wygol maszynką na 12 do 24 godzin przed wizytą. Przez co najmniej cztery tygodnie wcześniej i przez cały czas trwania serii nie usuwaj włosów z cebulką, czyli woskiem, pastą cukrową, depilatorem ani pęsetą, bo laser potrzebuje włosa w mieszku. Na dwa do czterech tygodni przed zabiegiem odstaw opalanie i solarium, a samoopalacze zmyj całkowicie. Kwasy, retinol i preparaty złuszczające warto odstawić około miesiąca wcześniej. Jeżeli przyjmujesz leki, które mogą uwrażliwiać na światło, powiedz o tym przed zabiegiem; decyzję o jakiejkolwiek zmianie w leczeniu podejmuje wyłącznie Twój lekarz.'],
  ['h3', 'Po zabiegu'],
  ['normal',
    'Przez kilka dni odpuść saunę, gorące kąpiele, basen i intensywny wysiłek. Skórę myj łagodnie, nawilżaj i chroń wysokim filtrem przez cały czas trwania serii, bo to zmniejsza ryzyko przebarwień. Między zabiegami wolno wyłącznie golić. Potraktowane włosy wypadają stopniowo w ciągu kilku do kilkunastu dni, co bywa mylone z odrastaniem.'],
  ['h3', 'Odczucia i przeciwwskazania'],
  ['normal',
    'W trakcie zabiegu odczuwa się zwykle ciepło i delikatne ukłucia, mocniej w partiach wrażliwych. Po zabiegu skóra bywa zaczerwieniona i rozgrzana, u większości osób ustępuje to w ciągu jednego do trzech dni; indywidualna wrażliwość bywa różna. Zabieg wyklucza między innymi ciąża i karmienie piersią, świeża opalenizna oraz samoopalacz na skórze, aktywne infekcje i zmiany skórne w miejscu zabiegu, przyjmowanie retinoidów i leków fotouczulających, padaczka, rozrusznik serca i choroby nowotworowe. Lista ma charakter orientacyjny: przed pierwszą wizytą przeprowadzam wywiad, a część stanów zdrowia wymaga wcześniejszej konsultacji lekarskiej. Pierwszy zabieg poprzedza próba w niewielkim, mało widocznym miejscu.'],
])

const twarzDescription = blocks('twarz', [
  ['normal',
    'Pielęgnacja twarzy w ZJAWISKOWO zaczyna się od rozmowy i oceny skóry, a dopiero potem od wyboru zabiegu. Ta sama cera potrzebuje czegoś innego w lutym, a czegoś innego w lipcu, więc protokół układam pod bieżący stan skóry, nie pod nazwę usługi z cennika. Większość zabiegów pracuje najlepiej w serii, z zachowaniem odstępów.'],
  ['h3', 'Oczyszczanie wodorowe'],
  ['normal',
    'Głowica podaje na skórę strumień wody wzbogaconej w wodór i jednocześnie wytwarza podciśnienie, które odbiera zanieczyszczenia z ujść mieszków. Zabieg oczyszcza i nawilża, nie ścierając naskórka mechanicznie, więc bywa dobrym wyborem dla skóry, która źle znosi abrazję. Polecany przy cerze zanieczyszczonej, matowej i zmęczonej.'],
  ['h3', 'Peeling kawitacyjny z terapią LED'],
  ['normal',
    'Ultradźwięki niskiej częstotliwości wywołują w wilgotnej warstwie na skórze zjawisko kawitacji: powstające mikropęcherzyki odrywają zrogowaciałe komórki i zanieczyszczenia z porów, bez ścierania mechanicznego. Po oczyszczeniu skóra jest naświetlana diodami LED, których barwę dobieram do potrzeby: światło czerwone przy skórze wymagającej regeneracji, niebieskie przy skórze skłonnej do niedoskonałości.'],
  ['h3', 'Mikrodermabrazja diamentowa'],
  ['normal',
    'Kontrolowane, mechaniczne złuszczanie naskórka głowicą pokrytą drobinami diamentowymi, połączone z odbieraniem złuszczonego materiału przez podciśnienie. Polecana przy nierównej teksturze skóry, szorstkości, drobnych liniach i płytkich nierównościach. Po serii konieczne jest nawilżanie i wysoki filtr.'],
  ['h3', 'Oczyszczanie manualne'],
  ['normal',
    'Najbardziej klasyczny protokół, oparty na pracy rąk. Kolejno: demakijaż, tonizacja, ocena skóry, peeling, rozpulchnienie ujść mieszków, właściwa faza oczyszczania, dezynfekcja, maska łagodząca i krem z filtrem. Zabieg trwa długo i wymaga spokoju, dlatego rezerwuję na niego osobne okno w grafiku.'],
  ['h3', 'Mezoterapia bezigłowa'],
  ['normal',
    'Krótkie impulsy pola elektrycznego przejściowo zwiększają przepuszczalność błon komórkowych, dzięki czemu substancje aktywne z ampułki przenikają głębiej niż przy zwykłej aplikacji. Zjawisko jest odwracalne, a skóra nie zostaje przerwana. O kierunku zabiegu decyduje dobór ampułki, stąd osobne warianty dla skóry odwodnionej, dojrzałej, naczyniowej i skłonnej do niedoskonałości.'],
  ['h3', 'Radiofrekwencja'],
  ['normal',
    'Fala o częstotliwości radiowej rozgrzewa w kontrolowany sposób głębsze warstwy skóry, przy chłodniejszej powierzchni naskórka. Celem jest praca nad jędrnością i sprężystością skóry oraz nad wyglądem drobnych zmarszczek. Okolica oka wymaga mniejszej głowicy i obniżonej mocy, a także szczególnie uważnej kwalifikacji, bo skóra powiek jest cienka. Zabieg wykonuje się w serii, z podtrzymaniem co kilka miesięcy.'],
  ['h3', 'Ultradźwięki i sonoforeza'],
  ['normal',
    'To dwa zastosowania tej samej fali. Peeling ultradźwiękowy oczyszcza i złuszcza, więc wypada na początku zabiegu. Sonoforeza pracuje płaską głowicą na wcześniej nałożonej ampułce i ułatwia przenikanie substancji aktywnych, więc wypada po oczyszczeniu. Dlatego często łączy się je w jeden protokół: oczyszczona skóra lepiej przyjmuje to, co nakładam później.'],
  ['h3', 'Przeciwwskazania'],
  ['normal',
    'Zależą od konkretnego zabiegu, ale najczęściej powtarzają się: ciąża i karmienie piersią, aktywne infekcje i stany zapalne skóry, przerwanie ciągłości naskórka, choroby nowotworowe, padaczka, rozrusznik serca i implanty elektroniczne, metalowe elementy w polu zabiegowym, świeża opalenizna oraz przyjmowanie preparatów uwrażliwiających na światło. Lista ma charakter orientacyjny, a o kwalifikacji do konkretnego zabiegu decydujemy wspólnie podczas konsultacji.'],
])

export const treatments = [
  {
    title: 'Depilacja laserowa',
    kicker: 'Depilacja laserowa',
    navLabel: 'Depilacja laserowa',
    slug: 'depilacja-laserowa',
    excerpt:
      'Trwała redukcja owłosienia w serii około ośmiu zabiegów. Laser na miejscu w Krzeszowicach, dostępny każdego dnia pracy salonu, więc terminy układamy pod Twój kalendarz.',
    featured: true,
    ctaLabel: 'Umów wizytę',
    pricelistAnchor: 'depilacja-laserowa',
    order: 0,
    atuty: [
      'Laser na miejscu w Krzeszowicach, dostępny każdego dnia pracy salonu',
      'Kolejne zabiegi serii w dogodnym terminie, bez przerw wymuszonych dostępnością sprzętu',
      'Pełna seria to zwykle około ośmiu zabiegów, z odstępami dobranymi do partii ciała',
      'Konsultacja i próba na niewielkim obszarze przed pierwszym zabiegiem',
      'Pakiety obejmujące kilka partii, z ceną niższą niż suma pojedynczych zabiegów',
      'Zapomnij o maszynce i wosku między wizytami: między zabiegami wolno golić',
    ],
    description: laserDescription,
  },
  {
    title: 'Pielęgnacja twarzy',
    kicker: 'Pielęgnacja twarzy',
    navLabel: 'Pielęgnacja twarzy',
    slug: 'pielegnacja-twarzy',
    excerpt:
      'Oczyszczanie wodorowe, peeling kawitacyjny z LED, mikrodermabrazja, oczyszczanie manualne, mezoterapia bezigłowa, radiofrekwencja i sonoforeza. Protokół układam pod bieżący stan skóry.',
    featured: true,
    ctaLabel: 'Umów wizytę',
    pricelistAnchor: 'pielegnacja-twarzy',
    order: 1,
    atuty: [
      'Konsultacja i ocena skóry przed każdym zabiegiem',
      'Protokół dobierany pod bieżący stan cery, nie pod nazwę usługi z cennika',
      'Zabiegi oczyszczające, złuszczające, nawilżające i ujędrniające',
      'Rabat na serię pięciu zabiegów oraz na dwa zabiegi podczas jednej wizyty',
      'Dobór pielęgnacji domowej, żeby efekt wizyty utrzymał się dłużej',
    ],
    description: twarzDescription,
  },
]

/* ── Cennik ──────────────────────────────────────────────────────────── */

export const pricelist = {
  intro:
    'Ceny obejmują pojedynczy zabieg. Zakres i koszt ustalamy ostatecznie podczas konsultacji, po ocenie skóry i rozmowie o Twoich potrzebach.',
  outro:
    'Cennik ma charakter informacyjny i nie stanowi oferty w rozumieniu przepisów prawa. Aktualne ceny potwierdzam przy zapisie na wizytę.',
  groups: [
    {
      title: 'Depilacja laserowa',
      anchor: 'depilacja-laserowa',
      showInMenu: true,
      note: 'Cena dotyczy jednego zabiegu na wskazanym obszarze. Pełna seria to zwykle około ośmiu zabiegów.',
      items: [
        { name: 'Łydki, stopy i palce', price: '250 zł' },
        { name: 'Uda i kolana', price: '300 zł' },
        { name: 'Całe nogi', price: '450 zł' },
        { name: 'Bikini płytkie', price: '200 zł' },
        { name: 'Bikini średnie', price: '250 zł' },
        { name: 'Bikini głębokie', price: '300 zł' },
        { name: 'Okolice bikini', price: '150 zł' },
        { name: 'Przestrzeń międzypośladkowa', price: '100 zł' },
        { name: 'Pośladki', price: '200 zł' },
        { name: 'Linia biała', price: '100 zł' },
        { name: 'Pachy', price: '150 zł' },
        { name: 'Wąsik', price: '100 zł' },
        { name: 'Broda', price: '150 zł' },
        { name: 'Twarz: baki i policzki', price: '200 zł' },
        { name: 'Kark', price: '150 zł' },
        { name: 'Plecy', price: '350 zł' },
        { name: 'Ramiona', price: '200 zł' },
        { name: 'Przedramiona', price: '200 zł' },
        { name: 'Dłonie i palce', price: '100 zł' },
        { name: 'Całe ręce', price: '350 zł' },
        { name: 'Klatka piersiowa', price: '250 zł' },
        { name: 'Brzuch', price: '200 zł' },
      ],
    },
    {
      title: 'Pakiety depilacji laserowej',
      anchor: 'pakiety-depilacji',
      showInMenu: false,
      note: 'Można wybrać jeden pakiet. Podana cena dotyczy jednej wizyty, a oszczędność policzona jest dla serii ośmiu zabiegów.',
      items: [
        { name: 'Łydki i bikini płytkie, pachy gratis', price: '450 zł', note: 'zamiast 600 zł, oszczędność 1200 zł' },
        { name: 'Łydki i bikini średnie, pachy gratis', price: '500 zł', note: 'zamiast 650 zł, oszczędność 1200 zł' },
        { name: 'Łydki i bikini głębokie, pachy gratis', price: '550 zł', note: 'zamiast 700 zł, oszczędność 1200 zł' },
        { name: 'Pośladki i przestrzeń międzypośladkowa', price: '250 zł', note: 'zamiast 300 zł, oszczędność 400 zł' },
        { name: 'Pachy: 6 zabiegów, 2 gratis', price: '150 zł', note: 'oszczędność 300 zł' },
        { name: 'Plecy, kark gratis', price: '350 zł', note: 'zamiast 500 zł, oszczędność 1200 zł' },
        { name: 'Plecy i kark, pachy gratis', price: '500 zł', note: 'zamiast 650 zł, oszczędność 1200 zł' },
        { name: 'Klatka piersiowa i brzuch', price: '350 zł', note: 'zamiast 450 zł, oszczędność 800 zł' },
        { name: 'Wąsik i broda', price: '200 zł', note: 'zamiast 250 zł, oszczędność 400 zł' },
        { name: 'Broda i twarz, wąsik gratis', price: '350 zł', note: 'zamiast 450 zł, oszczędność 800 zł' },
        { name: 'Pakiet na start: całe nogi i pachy', price: '500 zł', note: 'zamiast 600 zł' },
      ],
    },
    {
      title: 'Pielęgnacja twarzy',
      anchor: 'pielegnacja-twarzy',
      showInMenu: true,
      note: 'Rabat 20 procent na serię pięciu zabiegów albo szósty zabieg gratis. Rabat 20 procent przy dwóch zabiegach wykonanych podczas jednej wizyty.',
      items: [
        { name: 'Oczyszczanie wodorowe premium, twarz', price: '240 zł', note: '90 min' },
        { name: 'Oczyszczanie wodorowe premium, twarz, szyja i dekolt', price: '290 zł', note: '120 min' },
        { name: 'Peeling kawitacyjny z terapią LED, twarz', price: '140 zł', note: '45 min' },
        { name: 'Peeling kawitacyjny z terapią LED, twarz, szyja i dekolt', price: '170 zł', note: '60 min' },
        { name: 'Mikrodermabrazja diamentowa, twarz', price: '190 zł', note: '60 min' },
        { name: 'Mikrodermabrazja diamentowa, twarz, szyja i dekolt', price: '230 zł', note: '90 min' },
        { name: 'Oczyszczanie manualne', price: '250 zł', note: '120 – 180 min' },
        { name: 'Mezoterapia bezigłowa REVITAL 20+ i 30+, twarz', price: '280 zł' },
        { name: 'Mezoterapia bezigłowa REVITAL 20+ i 30+, szyja i dekolt', price: '320 zł' },
        { name: 'Mezoterapia bezigłowa, odmładzanie 40+, twarz', price: '280 zł' },
        { name: 'Mezoterapia bezigłowa, odmładzanie 40+, szyja i dekolt', price: '320 zł' },
        { name: 'Mezoterapia bezigłowa, lifting 45+, twarz', price: '280 zł' },
        { name: 'Mezoterapia bezigłowa, lifting 45+, szyja i dekolt', price: '320 zł' },
        { name: 'Mezoterapia bezigłowa, skóra naczyniowa', price: '280 zł' },
        { name: 'Mezoterapia bezigłowa, skóra skłonna do niedoskonałości', price: '280 zł' },
        { name: 'Radiofrekwencja, lifting okolic oka', price: '120 zł', note: '40 min' },
        { name: 'Radiofrekwencja, lifting twarzy', price: '160 zł', note: '60 min' },
        { name: 'Radiofrekwencja, cała twarz', price: '250 zł', note: '70 min' },
        { name: 'Radiofrekwencja, cała twarz, szyja i dekolt', price: '290 zł', note: '90 min' },
        { name: 'Ultradźwięki, twarz', price: '210 zł', note: '70 min' },
        { name: 'Ultradźwięki, twarz, szyja i dekolt', price: '240 zł', note: '90 min' },
        { name: 'Sonoforeza, twarz', price: '150 zł', note: '70 min' },
        { name: 'Sonoforeza, twarz, szyja i dekolt', price: '180 zł', note: '90 min' },
        { name: 'Regulacja brwi', price: '30 zł' },
        { name: 'Koloryzacja rzęs', price: '40 zł' },
        { name: 'Koloryzacja brwi z peelingiem i regulacją', price: '70 zł' },
        { name: 'Koloryzacja brwi i rzęs', price: '100 zł' },
      ],
    },
    {
      title: 'Dodatki do zabiegów',
      anchor: 'dodatki',
      showInMenu: false,
      items: [
        { name: 'Ampułka', price: '30 zł' },
        { name: 'Maska algowa', price: '20 zł' },
      ],
    },
  ],
}

/* ── FAQ ─────────────────────────────────────────────────────────────── */

export const faqs = [
  {
    question: 'Ile zabiegów depilacji laserowej potrzeba?',
    answer:
      'U większości osób pełna seria to około ośmiu zabiegów. Laser działa skutecznie tylko na włosy w fazie aktywnego wzrostu, a w danym momencie jest w niej jedynie część owłosienia, więc kolejne wizyty obejmują te włosy, które w międzyczasie weszły w tę fazę. Ostateczną liczbę ustalamy po konsultacji, bo zależy od partii ciała, koloru i grubości włosa oraz uwarunkowań hormonalnych.',
  },
  {
    question: 'Co ile tygodni umawiamy kolejne zabiegi?',
    answer:
      'Odstęp dobieram do partii ciała: dla twarzy jest zwykle najkrótszy, dla nóg i pleców najdłuższy, bo włos rośnie tam wolniej. Zbyt krótka przerwa oznacza pracę na włosach poza fazą wzrostu, zbyt długa pozwala części mieszków przejść pełny cykl. Laser mam na miejscu i jest dostępny każdego dnia pracy salonu, więc termin dopasowujemy do Twojego kalendarza, a nie do dostępności sprzętu.',
  },
  {
    question: 'Jak przygotować się do depilacji laserowej?',
    answer:
      'Obszar zabiegu wygol maszynką na 12 do 24 godzin przed wizytą. Na co najmniej cztery tygodnie wcześniej odstaw wosk, pastę cukrową, depilator i pęsetę, bo laser potrzebuje włosa w mieszku. Na dwa do czterech tygodni przed zabiegiem zrezygnuj z opalania i solarium, a samoopalacz zmyj całkowicie. Kwasy i retinol warto odstawić około miesiąca wcześniej. Na zabieg przyjdź ze skórą czystą, bez balsamu i dezodorantu.',
  },
  {
    question: 'Czy zabieg boli?',
    answer:
      'W trakcie odczuwa się zwykle ciepło i delikatne ukłucia, wyraźniej w partiach wrażliwych, takich jak bikini czy twarz, oraz przy grubym, ciemnym włosie. Po zabiegu skóra bywa zaczerwieniona i rozgrzana. U większości osób ta reakcja ustępuje w ciągu jednego do trzech dni, choć wrażliwość jest sprawą indywidualną.',
  },
  {
    question: 'Jakie są przeciwwskazania?',
    answer:
      'Do najczęstszych należą ciąża i karmienie piersią, świeża opalenizna oraz samoopalacz na skórze, aktywne infekcje i zmiany skórne w miejscu zabiegu, przyjmowanie retinoidów i leków fotouczulających, padaczka, rozrusznik serca i choroby nowotworowe. Ta lista ma charakter orientacyjny. Przed pierwszą wizytą przeprowadzam wywiad, a część stanów zdrowia wymaga wcześniejszej konsultacji lekarskiej. Nigdy nie odstawiaj leków samodzielnie, decyzję podejmuje Twój lekarz.',
  },
  {
    question: 'Jak dbać o skórę po zabiegu?',
    answer:
      'Przez kilka dni odpuść saunę, gorące kąpiele, basen i intensywny wysiłek. Skórę myj łagodnie i nawilżaj, a odsłonięte partie chroń wysokim filtrem przez cały czas trwania serii, bo to zmniejsza ryzyko przebarwień. Między zabiegami wolno wyłącznie golić. Potraktowane włosy wypadają stopniowo przez kilka do kilkunastu dni, co bywa mylone z odrastaniem.',
  },
  {
    question: 'Który zabieg na twarz wybrać?',
    answer:
      'Nie musisz wybierać przed wizytą. Zaczynamy od rozmowy i oceny skóry, a zabieg dobieram do jej bieżącego stanu. Skóra zanieczyszczona i matowa zwykle korzysta z oczyszczania, skóra odwodniona z zabiegów wprowadzających substancje aktywne, a skóra z obniżoną jędrnością z radiofrekwencji. Większość zabiegów pracuje najlepiej w serii, z zachowaniem odstępów.',
  },
  {
    question: 'Czy mogę kupić voucher na zabieg?',
    answer:
      'Tak. Voucher można wykupić na konkretny zabieg albo na wybraną kwotę, którą obdarowana osoba wykorzysta na dowolną usługę z cennika. Szczegóły znajdziesz na stronie z voucherami, a najprościej zapytać telefonicznie.',
  },
]

/* ── O mnie ──────────────────────────────────────────────────────────── */

export const about = {
  kicker: 'Salon',
  heading: 'O mnie',
  lead: 'ZJAWISKOWO prowadzę sama. To znaczy, że konsultację, zabieg i całą serię wykonuje u Ciebie jedna osoba, która pamięta, jak Twoja skóra zachowała się ostatnim razem.',
  atuty: [
    'Salon prowadzę jednoosobowo, bez rotacji personelu',
    'Jedna osoba prowadzi Cię od konsultacji przez całą serię zabiegów',
    'Kameralny gabinet, jedna klientka w danym czasie',
    'Laser i sprzęt do pielęgnacji twarzy na miejscu w Krzeszowicach',
  ],
  body: blocks('about', [
    ['normal',
      'W kameralnym salonie łatwiej o rzeczy, które w większym gabinecie giną. Nie musisz za każdym razem opowiadać historii swojej skóry od początku, bo pamiętam, jak zareagowała poprzednio i co z tego wynikło. Nie ma pośpiechu między jedną klientką a drugą, bo w danym czasie jest tu jedna osoba.'],
    ['h3', 'Jak pracuję'],
    ['normal',
      '[Do uzupełnienia przez Martę: kilka zdań o drodze zawodowej, ukończonych szkoleniach i certyfikatach oraz o tym, od kiedy działa salon. To miejsce, w którym warto napisać konkretnie, bo klientki czytają je uważnie.]'],
    ['h3', 'Podejście do zabiegów'],
    ['normal',
      'Każdą wizytę zaczynam od rozmowy i oceny skóry. Zabieg dobieram do jej bieżącego stanu, a nie do nazwy usługi z cennika, i mówię wprost, kiedy lepiej odczekać albo wybrać coś łagodniejszego. Przy depilacji laserowej pilnuję odstępów w serii, bo to od nich zależy, czy praca ma sens.'],
    ['h3', 'Dlaczego Krzeszowice'],
    ['normal',
      '[Do uzupełnienia przez Martę: dlaczego salon powstał tutaj, co daje klientkom to, że nie muszą jeździć do Krakowa.]'],
  ]),
}

export const aboutBody =
  '[Opis do uzupełnienia: droga zawodowa, ukończone szkolenia, od kiedy działa salon, podejście do klientek.]'

/* ── Vouchery ────────────────────────────────────────────────────────── */

export const voucher = {
  kicker: 'Prezent',
  heading: 'Vouchery podarunkowe',
  lead: 'Voucher do ZJAWISKOWO to prezent, który obdarowana osoba wykorzysta wtedy, kiedy będzie miała na to czas i ochotę. Można go wykupić na konkretny zabieg albo na wybraną kwotę.',
  bullets: [
    'Voucher na konkretny zabieg albo na dowolnie wybraną kwotę',
    'Do wykorzystania na wszystkie usługi z cennika, także na pakiety depilacji',
    'Termin ważności: [do ustalenia, np. 6 miesięcy od daty zakupu]',
    'Do odbioru w salonie, w eleganckiej kopercie',
    'Rezerwacja terminu telefonicznie, z podaniem numeru vouchera',
  ],
  ctaLabel: 'Zapytaj o voucher',
  showOnHome: true,
  body: blocks('voucher', [
    ['normal',
      'Jeżeli nie wiesz, który zabieg wybrać, najprościej podarować kwotę. Obdarowana osoba przyjdzie na konsultację, opowie o swojej skórze i razem dobierzemy to, co będzie miało dla niej sens. Voucher można też wystawić na konkretną usługę, na przykład na oczyszczanie wodorowe albo na pierwszy zabieg z serii depilacji laserowej.'],
    ['h3', 'Jak kupić'],
    ['normal',
      'Zadzwoń albo napisz przez formularz kontaktowy. Ustalimy kwotę lub zabieg, a voucher przygotuję do odbioru w salonie. [Do uzupełnienia przez Martę: formy płatności, czy możliwa jest wysyłka, czy voucher da się przedłużyć.]'],
    ['h3', 'Jak wykorzystać'],
    ['normal',
      'Wystarczy zadzwonić i przy rezerwacji podać numer vouchera. Voucher nie podlega wymianie na gotówkę. Jeśli wartość zabiegu przekracza wartość vouchera, różnicę dopłaca się na miejscu.'],
  ]),
}

/* ── Regulamin ───────────────────────────────────────────────────────── */

export const terms = {
  kicker: 'Informacje prawne',
  heading: 'Regulamin salonu',
  lead: 'Poniższe zasady porządkują przebieg wizyty i rezerwacji. Ich celem jest to, żeby każda klientka miała zarezerwowany dla siebie czas i spokój.',
  notice:
    '[Dokument roboczy, treść przykładowa do uzupełnienia i weryfikacji prawnej przed publikacją.]',
  updatedAt: 'lipiec 2026',
  privacyIntro:
    'Zasady przetwarzania danych osobowych, obsługi formularza kontaktowego oraz korzystania z plików cookies opisuje osobny dokument.',
  body: blocks('terms', [
    ['h3', '1. Postanowienia ogólne'],
    ['normal',
      'Regulamin określa zasady korzystania z usług salonu kosmetycznego ZJAWISKOWO, [pełna nazwa działalności], [adres], NIP [NIP]. Skorzystanie z usług oznacza akceptację niniejszego regulaminu.'],
    ['h3', '2. Rezerwacja wizyty'],
    ['normal',
      'Wizyty rezerwuje się telefonicznie pod numerem [telefon] lub przez formularz kontaktowy. Rezerwacja jest potwierdzana [sposób potwierdzenia]. Prosimy o przybycie kilka minut przed umówioną godziną. Spóźnienie może skrócić zabieg lub wymagać zmiany terminu, ponieważ kolejna wizyta zaczyna się o stałej porze.'],
    ['h3', '3. Odwołanie i zmiana terminu'],
    ['normal',
      'Termin można odwołać lub przełożyć najpóźniej [liczba] godzin przed wizytą. [Do uzupełnienia: konsekwencje późnego odwołania lub niestawienia się, ewentualny zadatek przy dłuższych zabiegach.]'],
    ['h3', '4. Konsultacja i kwalifikacja do zabiegu'],
    ['normal',
      'Przed pierwszym zabiegiem przeprowadzany jest wywiad dotyczący stanu zdrowia, przyjmowanych leków i przeciwwskazań. Klientka zobowiązuje się do udzielenia zgodnych z prawdą informacji. Salon zastrzega sobie prawo do odmowy wykonania zabiegu, jeżeli istnieją przeciwwskazania lub stan skóry na to nie pozwala.'],
    ['h3', '5. Przebieg zabiegu'],
    ['normal',
      'Zabiegi wykonywane są zgodnie z zaleceniami producentów urządzeń i preparatów oraz z wiedzą kosmetologiczną. Klientka zobowiązuje się do stosowania zaleceń przed zabiegiem i po nim. Niestosowanie się do zaleceń może wpłynąć na przebieg i rezultat zabiegu.'],
    ['h3', '6. Płatności'],
    ['normal',
      'Płatność następuje po wykonaniu zabiegu, [dostępne formy płatności]. Ceny podane w cenniku mają charakter informacyjny i nie stanowią oferty w rozumieniu przepisów prawa.'],
    ['h3', '7. Vouchery i pakiety'],
    ['normal',
      'Voucher ważny jest przez [okres] od daty zakupu i nie podlega wymianie na gotówkę. Pakiet zabiegów obejmuje [zakres], a jego wykorzystanie następuje w terminie [okres]. [Do uzupełnienia: zasady przy rezygnacji z rozpoczętego pakietu.]'],
    ['h3', '8. Reklamacje'],
    ['normal',
      'Uwagi dotyczące wykonanej usługi prosimy zgłaszać w terminie [liczba] dni od zabiegu, osobiście, telefonicznie lub na adres [e-mail]. Zgłoszenie rozpatrywane jest w terminie [liczba] dni.'],
    ['h3', '9. Bezpieczeństwo i porządek'],
    ['normal',
      'Na terenie salonu obowiązuje zakaz palenia. Ze względu na charakter zabiegów prosimy o przybycie bez osób towarzyszących. [Do uzupełnienia: zasady dotyczące dzieci, zwierząt, rzeczy wartościowych.]'],
    ['h3', '10. Postanowienia końcowe'],
    ['normal',
      'Salon zastrzega sobie prawo do zmiany regulaminu. Aktualna wersja jest zawsze dostępna na tej stronie oraz do wglądu w salonie. W sprawach nieuregulowanych zastosowanie mają przepisy powszechnie obowiązującego prawa.'],
  ]),
}

/* ── Wycofane z zakresu (schematy zostają, treść nieużywana) ─────────── */

export const badges = [
  { text: 'Kameralny salon, jedna klientka w danym czasie' },
  { text: 'Laser na miejscu, dostępny każdego dnia pracy salonu' },
  { text: 'Konsultacja i wywiad przed pierwszym zabiegiem' },
  { text: 'Dobór pielęgnacji domowej po zabiegu' },
]

export const reviews = []
