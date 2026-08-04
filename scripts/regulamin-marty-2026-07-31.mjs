// Regulamin nadesłany przez klientkę (mail „Regulamin na stronę", 31.07.2026,
// załącznik „regulamin salonu.doc") wchodzi w miejsce szablonu z placeholderami.
//
//   node scripts/regulamin-marty-2026-07-31.mjs --dry
//   node scripts/regulamin-marty-2026-07-31.mjs
//
// Treść przepisana dosłownie z jej dokumentu. Ingerencje wyłącznie mechaniczne:
// sklejone wiersze łamane przez Worda i usunięte podwójne spacje. Numeracja
// punktów zostaje w tekście, bo paragrafy numerują się niezależnie.
// Podpis „Marta Pikul" spod dokumentu pominięty (artefakt wersji papierowej).
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

const TRESC = [
  ['normal', 'W trosce o bezpieczeństwo i zdrowie Klientów Salonu Kosmetycznego ZJAWISKOWO Marta Pikul są Państwo zobowiązani do zapoznania się z regulaminem świadczenia usług przed rozpoczęciem zabiegu oraz do przestrzegania jego postanowień. Ustalenie terminu wizyty i skorzystanie z oferty Salonu Kosmetycznego ZJAWISKOWO Marta Pikul oznacza akceptację regulaminu bez konieczności jego podpisania. Brak akceptacji regulaminu jest jednoznaczny z rezygnacją z usługi.'],
  ['normal', 'Salon Kosmetyczny ZJAWISKOWO Marta Pikul powiązany ze stroną internetową www.zjawiskowo.com.pl, fb ZjawiskowoKrzeszowice, Instagram oraz Salon Kosmetyczny ZJAWISKOWO w Google, właścicielem firmy jest Marta Pikul, NIP: 676-207-35-90.'],

  ['h3', '§ 1 Postanowienia ogólne'],
  ['normal', '1. Niniejszy regulamin Salonu, zwany dalej „Regulaminem", określa zasady korzystania z usług kosmetycznych świadczonych w Salonie Kosmetycznym ZJAWISKOWO Marta Pikul, ul. 3 Maja 4, 32-065 Krzeszowice, zwanego dalej „Salonem".'],
  ['normal', '2. Klienci Salonu mają obowiązek zapoznania się z Regulaminem przed przystąpieniem do dowolnego zabiegu, zwanego dalej „Zabiegiem" lub „Usługą".'],
  ['normal', '3. Przystąpienie do Zabiegu jest równoznaczne z zaakceptowaniem postanowień niniejszego Regulaminu. Każdy Klient ma obowiązek stosować się wprost do jego postanowień, od momentu wyrażenia świadomej zgody na Zabieg aż do zakończenia Zabiegu.'],
  ['normal', '4. Niezastosowanie się Klienta do wymagań regulaminu skutkuje wyłączeniem odpowiedzialności Salonu za przeprowadzony Zabieg.'],
  ['normal', '5. W razie wątpliwości co do zdrowia Klienta personel może odmówić wykonania Zabiegu.'],
  ['normal', '6. Salon nie ponosi odpowiedzialności za powikłania po Zabiegu lub brak pożądanych efektów Zabiegu, w przypadku nie stosowania się Klienta do zaleceń pozabiegowych oraz nieodpowiedniej pielęgnacji domowej.'],

  ['h3', '§ 2 Klienci'],
  ['normal', '1. Klientem Salonu może być pełnoletnia osoba fizyczna.'],
  ['normal', '2. Osoby niepełnoletnie, powyżej 13 roku życia, mogą mieć przeprowadzone Zabiegi wyłącznie za pisemną zgodą opiekuna prawnego, wyłącznego opiekuna lub przedstawiciela ustawowego. Osoby takie muszą przynieść na wizytę w/w zgodę, z podpisem i datą. Personel Salonu jest uprawniony do żądania przedłożenia stosownej zgody oraz do odmowy świadczenia Zabiegu, kiedy brak jest zgody.'],

  ['h3', '§ 3 Świadczenie usług kosmetycznych'],
  ['normal', '1. Salon oferuje usługi z zakresu: depilacji laserowej, pielęgnacji twarzy/szyi/dekoltu i inne oraz konsultacji kosmetycznych. Istnieje możliwość zakupu kart upominkowych, serii zabiegów. Aktualna oferta oraz cennik zamieszczone są na stronie salonu oraz na fb ZjawiskowoKrzeszowice.'],
  ['normal', '2. Przed przystąpieniem do Zabiegu personel przeprowadza z Klientem wywiad w celu ustalenia czy stan zdrowia Klienta, przebyte lub obecne choroby, jak również tryb życia nie stanowią przeciwwskazań do odbycia Zabiegu lub nie stwarzają ryzyka wystąpienia skutków ubocznych oraz w celu ustalenia zaleceń pielęgnacji domowej.'],
  ['normal', '3. Udostępnienie danych osobowych przez Klientów w kartach klienta jest równoznaczne ze zgodą na przetwarzanie danych przez Salon, zgodnie z Ustawą o ochronie danych osobowych (Dz.U. 2019 r., poz. 1781 ze zm.).'],
  ['normal', '4. Każdy Klient jest zaznajamiany z przeciwwskazaniami, skutkami ubocznymi i zaleceniami pozabiegowymi, a przystępując do Zabiegu ma ich pełną świadomość i je akceptuje.'],
  ['normal', '5. Każdorazowo, Klient winien potwierdzić aktualność wywiadu i przekazanych informacji.'],
  ['normal', '6. Klient jest obowiązany do nieposiadania na sobie w czasie Zabiegu jakiejkolwiek biżuterii. Wszelkie kosztowności winny być przechowywane przez Klienta na jego odpowiedzialność.'],
  ['normal', '7. Jeśli istnieje taka możliwość, Klient przychodzi na wizytę bez makijażu.'],
  ['normal', '8. Klient zobowiązany jest do natychmiastowego poinformowania personelu o pogorszeniu swojego samopoczucia w trakcie wykonywania Zabiegu.'],
  ['normal', '9. W razie wątpliwości w zakresie bezpieczeństwa przeprowadzenia Zabiegu, personel może odmówić jego przeprowadzenia.'],
  ['normal', '10. Personel ma prawo odmówić przeprowadzenia Zabiegu także w przypadku, gdy poweźmie wątpliwość, czy Klient nie planuje wyłudzić Zabiegu oraz gdy stwierdzi pozostawanie Klienta pod wpływem alkoholu lub środków odurzających.'],

  ['h3', '§ 4 Rezerwacje'],
  ['normal', '1. Klient powinien uprzednio umówić się telefonicznie.'],

  ['h3', '§ 5 Nieobecności i odwoływanie wizyt'],
  ['normal', '1. W razie rezygnacji z wizyty Klient powinien powiadomić Salon nie później niż 24 h przed wizytą. W razie braku odwołania z wyprzedzeniem - 24 h przed wizytą, wizyta jest traktowana jako wizyta, która się odbyła i skutkuje to koniecznością zapłaty przez Klienta za zaplanowany Zabieg w wysokości 50% wartości umówionych Usług.'],
  ['normal', '2. Salon zastrzega sobie prawo do odwołania wizyty - w przypadku choroby lub innych zdarzeń losowych. Salon jednocześnie uzgodni z Klientem nowy termin Zabiegu.'],

  ['h3', '§ 6 Punktualność'],
  ['normal', '1. Klient proszony jest o przybycie 5 minut wcześniej, aby móc przygotować się do zaplanowanego Zabiegu. Klienci umawiani są na konkretne godziny, proszę o punktualność.'],
  ['normal', '2. Spóźnienie powyżej 10 minut skutkuje skróceniem Zabiegu o czas spóźnienia, a jego koszt to 100% ceny. Spóźnienie Klienta nie może przesuwać czasu następnego Zabiegu. O spóźnieniu proszę informować niezwłocznie - telefonicznie, przed planowaną godziną rozpoczęcia Zabiegu.'],
  ['normal', '3. Klient jest zobowiązany do zapłaty w wysokości 50% wartości za zaplanowany Zabieg, jeśli spóźni się nadmiernie na umówioną wizytę i nie będzie możliwości wykonania usługi w pozostałym czasie. Wtedy ustala się nowy termin.'],
  ['normal', '4. W wyjątkowych sytuacjach - w przypadku opóźnienia się Zabiegu z przyczyn leżących po stronie Salonu, żaden z etapów nie zostanie skrócony.'],

  ['h3', '§ 7 Strefa ciszy'],
  ['normal', '1. Salon jest podzielony na dwie strefy:'],
  ['normal', '- głośną - POCZEKALNIA, w tej strefie można wykonywać krótkie rozmowy telefoniczne'],
  ['normal', '- cichą - GABINET ZABIEGOWY, w strefie tej obowiązuje całkowity zakaz korzystania z telefonów.'],
  ['normal', 'Klient potrzebuje wyciszenia, a personel skupienia. Proszę wyciszyć telefon przed wejściem do gabinetu.'],

  ['h3', '§ 8 Dzieci'],
  ['normal', '1. Proszę nie przychodzić na wizytę z dziećmi, ponieważ w Salonie znajdują się urządzenia i preparaty, które mogą być niebezpieczne dla dzieci. Salon nie ponosi odpowiedzialności za pozostawienie dzieci bez opieki w poczekalni.'],

  ['h3', '§ 9 Zwierzęta'],
  ['normal', '1. Na terenie Salonu obowiązuje całkowity zakaz wprowadzania zwierząt.'],

  ['h3', '§ 10 Używki'],
  ['normal', '1. Na terenie Salonu obowiązuje całkowity zakaz spożywania alkoholu, palenia tytoniu i papierosów elektronicznych oraz używania substancji odurzających.'],

  ['h3', '§ 11 Wartościowe rzeczy'],
  ['normal', '1. Salon nie ponosi odpowiedzialności za rzeczy wartościowe pozostawione w poczekalni bez nadzoru.'],

  ['h3', '§ 12 Poufność informacji'],
  ['normal', '1. Salon działa zgodnie z Ustawą o ochronie danych osobowych (Dz.U. 2019 r., poz. 1781 ze zm.). Dane Klienta nie są udostępniane osobom trzecim.'],
  ['normal', '2. Dane są używane wyłącznie do kontaktu z Klientem.'],
  ['normal', '3. Personel obowiązuje tajemnica zawodowa.'],

  ['h3', '§ 13 Karty upominkowe'],
  ['normal', '1. Karty upominkowe dostępne w Salonie są wydawane na określony czas i dla konkretnej osoby, niewykorzystane zostają automatycznie anulowane wraz z końcem ważności.'],
  ['normal', '2. Nie ma możliwości wykorzystania bądź przywrócenia karty upominkowej, kiedy straci ona swoją ważność.'],
  ['normal', '3. Karty upominkowe nie mogą być wymienione na gotówkę.'],
  ['normal', '4. Karty upominkowe mogą być wykorzystane wyłącznie przez osobę, na którą zostały wypisane.'],
  ['normal', '5. Karty upominkowe nie podlegają zwrotowi.'],
  ['normal', '6. Zgodnie z życzeniem osoba obdarowana może dopłacić do karty, jeżeli wartość Usług z których chce skorzystać opiewa na kwotę wyższą niż wartość karty.'],
  ['normal', '7. Karty upominkowe można wymienić na inne wybrane Usługi z cennika, do kwoty odpowiadającej kwocie zakupu karty podarunkowej.'],

  ['h3', '§ 14 Bezpieczeństwo i higiena pracy'],
  ['normal', '1. Wszystkie procedury zabiegowe prowadzone są z najwyższą starannością z zachowaniem zasad bezpieczeństwa i higieny pracy. Salon zapewnia:'],
  ['normal', 'a. odpowiednie kwalifikacje personelu,'],
  ['normal', 'b. bezpieczny, atestowany i serwisowany sprzęt,'],
  ['normal', 'c. zdezynfekowane powierzchnie oraz zdezynfekowane lub wysterylizowane narzędzia,'],
  ['normal', 'd. profesjonalny dobór pielęgnacji domowej dla intensyfikacji efektów zabiegowych,'],
  ['normal', 'e. atmosferę bezpieczeństwa i opieki,'],
  ['normal', 'f. pełną dyskrecję.'],

  ['h3', '§ 15 Płatności'],
  ['normal', 'Możliwe formy płatności: gotówka, karta, blik.'],

  ['normal', 'Regulamin wchodzi w życie z dniem 01 sierpnia 2026 r. i obowiązuje do odwołania.'],
]

const body = TRESC.map(([style, text], i) => ({
  _type: 'block',
  _key: `reg-${i}`,
  style,
  markDefs: [],
  children: [{ _type: 'span', _key: `reg-${i}-s`, text, marks: [] }],
}))

const res = await fetch(
  `https://${PROJECT}.api.sanity.io/v${APIV}/data/query/${DATASET}?query=${encodeURIComponent('*[_type=="termsPage"][0]{_id, notice, "bloki": count(body)}')}`
)
const doc = (await res.json()).result
if (!doc?._id) {
  console.error('Nie znaleziono dokumentu „Regulamin" (termsPage)')
  process.exit(1)
}

const naglowki = body.filter((b) => b.style === 'h3').length
console.log(`Dokument: ${doc._id}`)
console.log(`Bloków w treści: ${doc.bloki} → ${body.length} (w tym ${naglowki} paragrafów)`)
console.log(`Adnotacja robocza: ${doc.notice ? 'była, zdejmuję' : 'brak'}`)

if (DRY) {
  console.log('(--dry: nic nie zapisano)')
  process.exit(0)
}

const zapis = await fetch(
  `https://${PROJECT}.api.sanity.io/v${APIV}/data/mutate/${DATASET}?returnIds=true`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      mutations: [
        {
          patch: {
            id: doc._id,
            set: {
              heading: 'Regulamin świadczenia usług',
              lead: 'Regulamin świadczenia usług w Salonie Kosmetycznym ZJAWISKOWO Marta Pikul. Ustalenie terminu wizyty i skorzystanie z oferty Salonu oznacza akceptację regulaminu.',
              updatedAt: 'sierpień 2026',
              body,
            },
            unset: ['notice'],
          },
        },
      ],
    }),
  }
)
const out = await zapis.json()
if (!zapis.ok) {
  console.error('BŁĄD zapisu:', JSON.stringify(out, null, 2))
  process.exit(1)
}
console.log('Zapisano regulamin od klientki.')
