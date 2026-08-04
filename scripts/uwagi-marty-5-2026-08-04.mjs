// Uwagi klientki z 31 lipca (po 14:00), 1 i 2 sierpnia — runda zamknięta przez
// nią 4 sierpnia słowami „wszystko to co przesyłam dotychczas przez ostatnie dni".
// Źródła: Messenger (pięć wiadomości) oraz poczta (zabieg.doc, zdjęcie voucherów).
//
// Uruchomienie:  node scripts/uwagi-marty-5-2026-08-04.mjs --dry
//                node scripts/uwagi-marty-5-2026-08-04.mjs
//
// Co tu jest, w kolejności zapisu:
//
// 1. PASEK PROMOCJI — nowa treść, trzy punkty. Klientka zmieniła zdanie dwa razy
//    tego samego wieczoru (najpierw „-50% na jedną wizytę", potem wersja niżej),
//    więc obowiązuje ostatnia: „ostatecznie dajmy tak". Znika przy okazji
//    „zarezerwuj w sierpniu", o które dopytywała 31 lipca — nowy pasek nie ma
//    już terminu, do którego trzeba by to doklejać.
//
// 2. GALERIA — nagłówek skraca się do „Zabiegi”. „i efekty” obiecywało zdjęcia
//    przed i po, których w galerii nie ma i długo nie będzie.
//
// 3. KONTAKT — z listy wskazówek dojazdu znika „parter”.
//
// 4. VOUCHERY — trzy punkty listy i dwa akapity w całości od klientki, plus
//    zdjęcie prawdziwych voucherów salonu w miejsce kadru z kosmetykami.
//
// 5. CENNIK, PIELĘGNACJA TWARZY — szesnaście poprawek nazw i czasów. Wersaliki
//    nie są ozdobą: „dokładnie tak konkretnie mam je nazywane w sprzęcie”, więc
//    nazwa w cenniku ma się zgadzać z nazwą programu na urządzeniu.
//
// 6. PIELĘGNACJA TWARZY, PEŁNY OPIS — wszystkie opisy zabiegów zastąpione
//    tekstami klientki z załącznika (zabieg.doc). Zostaje wstęp sekcji, zostają
//    „Przeciwwskazania” na końcu („proszę zostawić Przeciwwskazania, które Pan
//    zrobił”), a przed nimi wchodzi jej akapit o całorocznym charakterze
//    zabiegów. Interwencje w tekst klientki ograniczone do literówek
//    („pozszerzonych”, „kalogenu”), brakujących spacji po przecinku i myślników
//    użytych zamiast przecinka.
import fs from 'node:fs'

const DRY = process.argv.includes('--dry')
const env = fs.readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
const token = env.match(/SANITY_API_WRITE_TOKEN=(.+)/)?.[1].trim()
if (!token) throw new Error('Brak SANITY_API_WRITE_TOKEN w .env.local')

const BAZA = 'https://kleyi1aa.api.sanity.io/v2024-01-01/data'
const naglowki = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

async function pytaj(q) {
  const r = await fetch(`${BAZA}/query/production?query=${encodeURIComponent(q)}`, {
    headers: naglowki,
  })
  const d = await r.json()
  if (!r.ok) throw new Error(JSON.stringify(d))
  return d.result
}

const bledy = []
const sprawdz = (warunek, komunikat) => {
  if (!warunek) bledy.push(komunikat)
}

// ---------------------------------------------------------------- 1. pasek --
const PASEK =
  'Do 1200 zł oszczędności przy pakietach depilacji · −20% na pielęgnację twarzy · Sprawdzaj inne promocje na FB ZJAWISKOWO'

// --------------------------------------------------------------- 2. galeria --
const NAGLOWEK_GALERII = 'Zabiegi'

// --------------------------------------------------------------- 3. kontakt --
const WSKAZOWKA_STARA = 'Wejście od strony parkingu, parter'
const WSKAZOWKA_NOWA = 'Wejście od strony parkingu'

// -------------------------------------------------------------- 4. vouchery --
const VOUCHER_PUNKTY_ZAMIANA = [
  ['Termin ważności', 'Termin ważności 12 miesięcy'],
  ['Do odbioru w salonie', 'Do odbioru w salonie w eleganckiej torebce'],
  ['Rezerwacja terminu telefonicznie', 'Rezerwacja terminu telefonicznie'],
]
const VOUCHER_JAK_KUPIC =
  'Zadzwoń i ustalimy kwotę lub zabieg, a voucher przygotuję do odbioru w salonie. ' +
  'Możliwa jest płatność kartą lub gotówką. Voucher będzie pięknie zapakowany ' +
  'w torebce, w ten sposób oszczędzasz czas i unikasz dodatkowych kosztów zakupu opakowania.'
const VOUCHER_JAK_WYKORZYSTAC =
  'Wystarczy zadzwonić i ustalić wizytę. Voucher nie podlega wymianie na gotówkę, ' +
  'nie może z niego skorzystać inna osoba niż obdarowana, a termin 12 miesięcy ' +
  'nie ulega przedłużeniu. Jeśli wartość zabiegu przekracza wartość vouchera, ' +
  'różnicę dopłaca się na miejscu.'
// Zdjęcie prawdziwych voucherów salonu, przysłane pocztą 1 sierpnia
// („proszę o włożenie tego zdjęcia obok vouchery podarunkowe, a tamto proszę
// usunąć”). Kadr przycięty z pionowego zrzutu z telefonu: czarne pasy i pasek
// nawigacji Androida odcięte, reszta bez zmian.
const VOUCHER_ZDJECIE = 'image-2b1d8e23c89f92f78907fa75e22f0f17101f1e12-1280x1715-jpg'

// ---------------------------------------------------------------- 5. cennik --
// [nazwa obecna, nazwa docelowa albo null gdy bez zmian, czas albo null]
const CENNIK_ZMIANY = [
  ['Oczyszczanie wodorowe premium, twarz', 'Oczyszczanie wodorowe PREMIUM, twarz', null],
  [
    'Oczyszczanie wodorowe premium, twarz, szyja i dekolt',
    'Oczyszczanie wodorowe PREMIUM, twarz, szyja i dekolt',
    null,
  ],
  ['Mezoterapia bezigłowa REVITAL 20+ i 30+, twarz', null, '70 min'],
  [
    'Mezoterapia bezigłowa REVITAL 20+ i 30+, szyja i dekolt',
    'Mezoterapia bezigłowa REVITAL 20+ i 30+, twarz, szyja i dekolt',
    '90 min',
  ],
  [
    'Mezoterapia bezigłowa, odmładzanie 40+, twarz',
    'Mezoterapia bezigłowa, ODMŁADZANIE 40+, twarz',
    '70 min',
  ],
  [
    'Mezoterapia bezigłowa, odmładzanie 40+, szyja i dekolt',
    'Mezoterapia bezigłowa, ODMŁADZANIE 40+, twarz, szyja i dekolt',
    '90 min',
  ],
  [
    'Mezoterapia bezigłowa, lifting 45+, twarz',
    'Mezoterapia bezigłowa, LIFTING 45+, twarz',
    '70 min',
  ],
  [
    'Mezoterapia bezigłowa, lifting 45+, szyja i dekolt',
    'Mezoterapia bezigłowa, LIFTING 45+, twarz, szyja i dekolt',
    '90 min',
  ],
  [
    'Mezoterapia bezigłowa, skóra naczyniowa',
    'Mezoterapia bezigłowa, NACZYNKA twarz',
    '70 min',
  ],
  [
    'Mezoterapia bezigłowa, skóra skłonna do niedoskonałości',
    'Mezoterapia bezigłowa, TRĄDZIK twarz',
    '70 min',
  ],
  ['Radiofrekwencja, lifting okolic oka', 'Radiofrekwencja, LIFTING okolic oka', null],
  ['Radiofrekwencja, lifting twarzy', 'Radiofrekwencja, LIFTING twarzy', null],
  ['Regulacja brwi', null, '20 min'],
  ['Koloryzacja rzęs', null, '30 min'],
  ['Koloryzacja brwi z peelingiem i regulacją', null, '40 min'],
  [
    'Koloryzacja brwi i rzęs',
    'Koloryzacja brwi i rzęs z peelingiem i regulacją brwi',
    '60 min',
  ],
]
// Nowa pozycja pod „Oczyszczaniem manualnym”.
const PROSAKI = { name: 'Usuwanie prosaków', price: '30 – 50 zł' }

// ------------------------------------------- 6. pełny opis pielęgnacji twarzy --
// Teksty klientki z załącznika. Każdy zabieg to nagłówek i sekwencja elementów:
// akapit ('p') albo lista z etykietą ('lista').
const ZABIEGI = [
  {
    tytul: 'Oczyszczanie wodorowe PREMIUM',
    tresc: [
      ['p', 'I etap: Hydrabrazja wodorowa, II etap: Infuzja wodorowa'],
      [
        'p',
        'ZJAWISKOWO oferuje ten zabieg w wersji rozszerzonej o infuzję wodorową. Podstawą zabiegu jest aktywny wodór wytwarzany dzięki zastosowaniu wysokiej jakości generatora. Urządzenie usuwa z wody tlen oraz niekorzystne jony chloru, siarki, fosforu i nasyca ją aktywnym wodorem oraz korzystnymi jonami wapnia, magnezu i potasu. Aplikacja tych dobroczynnych substancji następuje w dwóch etapach, jako zasysanie oraz pod ciśnieniem. W ten sposób uzyskujemy także efekt peelingu zewnętrznych warstw naskórka. Aktywny wodór jest najsilniejszym ze znanych antyoksydantów. Jako najmniejszy i najlżejszy z pierwiastków z łatwością wnika w głąb struktur skóry, gdzie wiąże się z najbardziej szkodliwymi wolnymi rodnikami tlenowymi. Skutecznie je neutralizuje, pozbawiając szkodliwych dla skóry właściwości. Następnie w postaci wody jest wydalany z organizmu. Silne właściwości antyoksydacyjne jonów wodoru sprawiają, że nie ma on sobie równych w walce z rodnikowym starzeniem skóry oraz zmianami trądzikowymi. Niemal dosłownie „wymiata” z niej wolne rodniki. Spowalnia, a nawet hamuje w ten sposób procesy starzenia już na poziomie komórkowym, a skóra trądzikowa zaczyna się naturalnie oczyszczać.',
      ],
      [
        'p',
        'Oczyszczanie wodorowe nadaje skórze promienny i zdrowy wygląd. Co więcej, aktywny wodór posiada właściwości przeciwzapalne. Oczyszczanie wodorowe można łączyć z wszystkimi zabiegami. Zaleca się rozszerzenie procedury zabiegowej o szyję i dekolt.',
      ],
      [
        'p',
        'Największe korzyści przynosi seria co najmniej 5 zabiegów w odstępach co 2-3 tygodnie. Profilaktyka przeciwstarzeniowa i przeciwtrądzikowa to co najmniej 1 zabieg raz w miesiącu. W walce z nasilonym trądzikiem lub zmarszczkami warto wykonać kilka zabiegów w krótszych odstępach czasu, w zależności od potrzeb skóry.',
      ],
      [
        'lista',
        'Efekty zabiegowe',
        [
          'świeża, promienna skóra',
          'złuszczenie martwych komórek naskórka',
          'oczyszczanie porów skóry',
          'wygładzenie zmarszczek',
          'nawilżenie skóry',
          'redukcja zmian trądzikowych',
          'spowolnienie procesów starzenia skóry',
          'poprawa jędrności szyi i dekoltu',
        ],
      ],
      [
        'lista',
        'Wskazania',
        [
          'oznaki przedwczesnego starzenia się',
          'skóra wymagająca wygładzenia i odświeżenia',
          'skóra pozbawiona blasku',
          'zmarszczki',
          'utrata jędrności skóry',
          'zabieg pielęgnacyjny dla każdego rodzaju cery, szczególnie dla skór zanieczyszczonych, ziemistych, pozbawionych blasku, eksponowanych na działanie zanieczyszczeń powietrza, dla osób przebywających w zamkniętych, klimatyzowanych pomieszczeniach',
          'cera naczyniowa',
          'nadprodukcja serum',
          'rozszerzone pory',
          'trądzik, zaskórniki',
          'opuchlizna, cienie pod oczami',
          'skóra bardzo wrażliwa, ze skłonnościami do stanów zapalnych',
          'zmarszczki na szyi i dekolcie',
        ],
      ],
    ],
  },
  {
    tytul: 'Peeling kawitacyjny z terapią LED',
    tresc: [
      [
        'p',
        'Peeling kawitacyjny to zabieg wykonywany za pomocą ultradźwięków. Kawitacja jest nowoczesną technologią wykorzystywaną głównie do bezbolesnego oczyszczania twarzy. Ultradźwięki o określonej częstotliwości drgań indukują falę kawitacyjną. Fala ta w obecności wody rozprowadzonej na powierzchni skóry tworzy mikroskopijne pęcherzyki wypełnione rozrzedzonym gazem. Pod wpływem drgań ultradźwiękowych pęcherzyki ulegają znacznemu poszerzeniu, a następnie gwałtownie pękają. W krótkim czasie na niewielkiej przestrzeni uwalnia się duża ilość ciepła i znacznie rośnie ciśnienie. To powoduje rozbijanie martwych komórek warstwy rogowej skóry, bez jakichkolwiek uszkodzeń komórek znajdujących się w głębszych warstwach. Peeling kawitacyjny polega na złuszczeniu warstwy rogowej naskórka, łoju, zanieczyszczeń, dając tym samym gładkość, blask skórze oraz lepsze wchłanianie substancji aktywnie czynnych. Połączenie peelingu kawitacyjnego z niebieskim światłem LED daje rezultat wyciszenia skóry, działa antybakteryjnie i przeciwzapalnie. Peelingiem można oczyszczać także szyję i dekolt.',
      ],
      [
        'p',
        'Oczyszczanie peelingiem kawitacyjnym zaleca się przeprowadzać raz w miesiącu w serii 5 zabiegów dla zachowania prawidłowego oczyszczania skóry i w celu lepszego wchłaniania kremów, masek lub w zależności od potrzeb skóry.',
      ],
    ],
  },
  {
    tytul: 'Mikrodermabrazja diamentowa',
    tresc: [
      [
        'p',
        'Mikrodermabrazja diamentowa należy do zabiegów mechanicznego ścierania naskórka, dzięki czemu zostaje wzmożona produkcja kolagenu i elastyny. Metoda ta znalazła szerokie zastosowanie do odmładzania skóry, korekcji zmarszczek i blizn, eliminacji plam przebarwieniowych, oczyszczania skóry. Dzięki umiarkowanemu usuwaniu górnych warstw naskórka w jego warstwie podstawnej dochodzi do zintensyfikowanego tworzenia się nowych, pełnowartościowych komórek, które wędrują do góry, zastępując komórki uszkodzone. Złuszczenie warstwy rogowej naskórka zapewnia dużo wyższą absorpcję skóry. Zwiększa się wchłanianie aplikowanych preparatów, następuje wyeliminowanie toksyn i odtrucie głębszych warstw skóry, obserwuje się silne dotlenienie i poprawę mikrokrążenia. Szyja i dekolt także świetnie reagują na mechaniczne ścieranie naskórka.',
      ],
      [
        'p',
        'W kuracji przeciwtrądzikowej i przeciwprzebarwieniowej zaleca się przeprowadzenie zabiegów co 2-3 tygodnie, w cyklu 3-6 powtórzeń. W terapii odmładzającej seria obejmuje około 5 zabiegów, w odstępach co 3-4 tygodnie.',
      ],
      [
        'lista',
        'Wskazania',
        [
          'trądzik pospolity (zaskórnikowy, grudkowy)',
          'blizny potrądzikowe',
          'łojotok',
          'suchość skóry',
          'zaskórniki, prosaki',
          'rogowacenie przymieszkowe',
          'rozszerzone pory',
          'blizny zanikowe i przerosłe',
          'przebarwienia i odbarwienia',
          'uszkodzenia posłoneczne skóry',
          'szorstki, zrogowaciały naskórek',
          'zmarszczki wokół oczu, ust',
          'wiotkość skóry',
          'konieczność starcia naskórka na szyi i dekolcie',
        ],
      ],
      [
        'lista',
        'Wpływ mikrodermabrazji na skórę',
        [
          'poprawa jakości skóry (struktury i kolorytu)',
          'zwiększenie elastyczności',
          'zmniejszenie rozszerzonych porów',
          'spłycenie powierzchownych zmarszczek, wygładzenie skóry',
          'redukcja przebarwień posłonecznych',
          'zmniejszenie łojotoku',
          'skóra świeższa i młodsza',
          'zadbana szyja i dekolt',
        ],
      ],
      [
        'lista',
        'Zalety',
        [
          'bezpieczna, kontrolowana głębokość ścierania',
          'zabieg jest właściwie bezbolesny',
          'brak krwawienia i urazu skóry',
          'brak długiego okresu gojenia',
          'alternatywa dla osób nietolerujących peelingu chemicznego',
        ],
      ],
    ],
  },
  {
    tytul: 'Oczyszczanie manualne',
    tresc: [
      [
        'p',
        'Oczyszczanie manualne polega na ręcznym usuwaniu wągrów, zaskórników i grudek niezapalnych. Po zabiegu skóra jest wyraźnie czysta, odświeżona i lepiej przyjmuje substancje aktywne zawarte w kosmetykach. Bardzo ważnym czynnikiem zmniejszającym tworzenie się zanieczyszczeń jest odpowiednio dobrana codzienna pielęgnacja domowa.',
      ],
      [
        'p',
        'Przy skórze skłonnej do niedoskonałości zaleca się oczyszczanie skóry według potrzeb.',
      ],
      [
        'lista',
        'Wskazania',
        ['trądzik pospolity', 'zmiany łojotokowe skóry', 'cera tłusta i mieszana'],
      ],
      [
        'p',
        'Podczas oczyszczania manualnego można wykorzystać wapozon z ciepłą parą i ozonem.',
      ],
      [
        'lista',
        'Efekty stosowania wapozonu',
        [
          'dezynfekcja skóry',
          'zmiękczenie skóry',
          'otwieranie i czyszczenie porów',
          'wydzielanie toksyn przez skórę',
          'przyspieszenie cyrkulacji krwi',
          'nawilżenie',
          'poprawa metabolizmu',
        ],
      ],
    ],
  },
  {
    tytul: 'Mezoterapia bezigłowa',
    tresc: [
      [
        'p',
        'Zabieg jest alternatywą dla zabiegów tradycyjnej mezoterapii igłowej. Umożliwia głębokie wprowadzenie substancji odżywczych (fala elektromagnetyczna plus ultradźwięki) bez naruszenia ciągłości naskórka i bez użycia igieł. Dochodzi do zjawiska elektroporacji. Następuje lepsza przepuszczalność błon komórkowych, detoks oraz dotlenienie komórek i przygotowanie na przyjęcie preparatu. Kolejno odbywa się transport cząsteczek preparatu w głąb skóry. Zakończeniem procesu jest zamknięcie się mikrokanałów w błonie komórkowej i tym samym pozostawienie aplikowanych składników w głębszych warstwach tkanki. Ważne, aby zadbać także o szyję i dekolt.',
      ],
      [
        'p',
        'Najlepsze efekty przynosi seria 5-10 lub więcej zabiegów co 2 tygodnie przy cerach bardziej wymagających lub seria 3 zabiegów co 2 tygodnie, dla uzyskania efektu odmłodzenia, odżywienia skóry. W profilaktyce warto korzystać z zabiegu raz w miesiącu.',
      ],
      [
        'lista',
        'Cele zabiegu',
        [
          'zapobieganie procesom starzenia się skóry (zmarszczki, zwiotczenie mięśni, ścieńczenie się skóry)',
          'zwiększenie odporności skóry, polepszenie ukrwienia, odżywienie i pobudzenie metabolizmu tkankowego',
          'zmniejszanie przebarwień',
          'trądzik pospolity (normalizacja wydzielania sebum, poprawa ukrwienia, nawilżenie skóry)',
          'trądzik różowaty, tylko profilaktycznie (w fazie zaostrzonej z wykwitami grudkowo-krostkowymi większość zabiegów kosmetycznych jest przeciwwskazaniem, tylko po konsultacji z lekarzem)',
          'redukcja poszerzonych naczyń krwionośnych, wyciszanie rumienia, odnowa płaszcza hydrolipidowego',
          'skóra twarzy (nawilżenie, ujędrnienie, pobudzenie produkcji kolagenu i elastyny, stymulacja metabolizmu komórek skóry)',
          'dotlenienie dla cer zatrutych nikotyną',
          'ulga dla cery zniszczonej nadmierną ekspozycją na słońce i solarium',
          'pobudzanie krążenia',
          'poprawa jędrności szyi i dekoltu',
        ],
      ],
      [
        'lista',
        'Wskazania',
        [
          'profilaktyka przeciwzmarszczkowa',
          'zwiotczenie skóry',
          'brak jędrności skóry',
          'cera przesuszona',
          'szary koloryt skóry',
          'cienie i opuchlizna pod oczami',
          'zmarszczki na szyi i dekolcie',
        ],
      ],
    ],
  },
  {
    tytul: 'Radiofrekwencja (fale radiowe)',
    tresc: [
      [
        'p',
        'Określana jako niechirurgiczny lifting lub lifting bez skalpela. Fale radiowe stymulują tkanki powierzchowne i te głębiej położone, poprawiają ich dotlenienie, odżywienie oraz mikrocyrkulację. Zabieg polega na przegrzewaniu włókien kolagenowych, co wywołuje ich skurczenie i napinanie, dzięki czemu następuje proces regeneracji. Ponadto fale radiowe stymulują fibroblasty do odbudowy i wytwarzania kolagenu oraz elastyny, dając efekt zmniejszenia widoczności zmarszczek. Zwiększa się gęstość, elastyczność i napięcie skóry, poprawia się owal i koloryt twarzy. W wielu przypadkach już po wykonaniu pierwszego zabiegu można zauważyć różnicę w wyglądzie skóry. Efekt dogłębnej poprawy może pojawić się po serii zabiegów. Zabieg ten przyczynia się do minimalizacji zmarszczek. Warto dodać do zabiegu pielęgnację szyi i dekoltu.',
      ],
      [
        'p',
        'Fale radiowe zaleca się zacząć stosować już po 25 roku życia, raz na 2-3 miesiące. Po 35 roku życia powinno się je wykonywać raz w miesiącu. Po 45 roku życia zaleca się serię 5-10 zabiegów co 2 tygodnie. Profilaktyka przeciw starzeniu to 1 zabieg w miesiącu.',
      ],
      [
        'lista',
        'Efekty zabiegowe',
        [
          'obkurczenie zwisającego podbródka',
          'uniesienie opadających górnych powiek',
          'poprawa krążenia krwi',
          'poprawa napięcia policzków',
          'napięcie zwiotczeń',
          'poprawa owalu twarzy, tak zwanych „chomików”',
          'spłycenie głębokich zmarszczek',
          'zmniejszenie „worków” pod oczami i „kurzych łapek”',
          'odbudowa kolagenu',
          'terapia zapobiegająca starzeniu, profilaktyka',
          'zmniejszenie przebarwień',
          'redukcja rozszerzonych porów',
          'poprawa jędrności szyi i dekoltu',
        ],
      ],
      [
        'lista',
        'Wskazania',
        [
          'lifting okolic oczu',
          'lifting twarzy',
          'lifting szyi i dekoltu',
          'poprawa kondycji zwiotczałej skóry',
          'zmniejszanie widocznych zmarszczek na czole',
          'zmarszczki na szyi i dekolcie',
        ],
      ],
    ],
  },
  {
    tytul: 'Ultradźwięki i sonoforeza',
    tresc: [
      [
        'p',
        'Fale ultradźwiękowe o niskiej częstotliwości przenikają przez warstwę ochronną naskórka, dzięki wykorzystaniu czerwonego światła LED transportują głębiej składniki odżywcze oraz powodują mikromasaż skóry, zostaje wzmożona produkcja kolagenu i elastyny, których brak jest jednym z podstawowych czynników starzenia się skóry. Terapia ultradźwiękami jest łagodna i nieinwazyjna. Za pomocą ultradźwięków można zadziałać na potrzeby każdego typu cery. Zabieg zaleca się także rozszerzyć o szyję i dekolt.',
      ],
      ['p', 'Sonoforeza w zabiegu to także wykorzystanie ultradźwięków.'],
      [
        'p',
        'Przy ultradźwiękach wskazane jest przeprowadzenie serii 5 zabiegów co 2 tygodnie, w celu wtłoczenia składników odżywczych w głąb skóry, dla przedłużenia działania zabiegów.',
      ],
      [
        'lista',
        'Efekty zabiegowe',
        [
          'dotlenienie i głębokie nawilżenie skóry',
          'rozjaśnienie przebarwień i plam',
          'stymulacja syntezy kolagenu, elastyny, kwasu hialuronowego',
          'zwiększenie penetracji kosmetyków',
          'poprawa gęstości skóry',
          'powstrzymanie powstawania przebarwień i plam',
          'uszczelnienie i obkurczenie naczyń krwionośnych',
          'dzięki efektowi cieplnemu zwiększa się poziom metabolizmu komórkowego i przyswajania przez komórki substancji odżywczych, przyspiesza się proces odnowy i regeneracji skóry oraz eliminacji zmarszczek',
          'możliwość bezinwazyjnego wprowadzania w głąb skóry substancji leczniczych i pielęgnacyjnych',
        ],
      ],
    ],
  },
]

// Akapit, który klientka kazała dopisać „po ostatnim zdaniu”, czyli za opisami
// zabiegów, a przed „Przeciwwskazaniami”.
const AKAPIT_OGOLNY =
  'Każdy zabieg może być wykonywany przez cały rok, pod warunkiem zachowania ' +
  'odpowiednich procedur pozabiegowych. Długotrwałe efekty uzyskuje się po ' +
  'przeprowadzeniu serii. Można poszerzać obszar zabiegu o pielęgnację szyi ' +
  'i dekoltu. Zabiegi rozpoczynam peelingiem i kończę maską.'

// --- budowanie bloków ------------------------------------------------------
let licznik = 0
const klucz = () => `tw${++licznik}`

const blok = (styl, tekst, marks = []) => {
  const k = klucz()
  return {
    _key: k,
    _type: 'block',
    style: styl,
    markDefs: [],
    children: [{ _key: `${k}s`, _type: 'span', marks, text: tekst }],
  }
}
const punkt = (tekst) => {
  const k = klucz()
  return {
    _key: k,
    _type: 'block',
    style: 'normal',
    listItem: 'bullet',
    level: 1,
    markDefs: [],
    children: [{ _key: `${k}s`, _type: 'span', marks: [], text: tekst }],
  }
}

function zbudujOpis(wstep, przeciwwskazania) {
  const bloki = [wstep]
  for (const z of ZABIEGI) {
    bloki.push(blok('h3', z.tytul))
    for (const el of z.tresc) {
      if (el[0] === 'p') bloki.push(blok('normal', el[1]))
      else {
        // Etykieta listy jako wytłuszczony akapit, nie nagłówek: nagłówek
        // konkurowałby wizualnie z nazwą zabiegu, która stoi wyżej.
        bloki.push(blok('normal', el[1], ['strong']))
        for (const p of el[2]) bloki.push(punkt(p))
      }
    }
  }
  bloki.push(blok('normal', AKAPIT_OGOLNY))
  bloki.push(...przeciwwskazania)
  return bloki
}

// --- odczyt stanu ----------------------------------------------------------
const [ustawienia, voucher, cennik, twarz] = await Promise.all([
  pytaj('*[_id=="siteSettings"][0]{contactNotes,promoText,galleryHeading}'),
  pytaj('*[_id=="voucherPage"][0]{bullets,body}'),
  pytaj('*[_id=="pricelist"][0]{groups}'),
  pytaj('*[_id=="service-twarz"][0]{description}'),
])
sprawdz(ustawienia, 'Brak dokumentu siteSettings')
sprawdz(voucher, 'Brak dokumentu voucherPage')
sprawdz(cennik, 'Brak dokumentu pricelist')
sprawdz(twarz, 'Brak dokumentu service-twarz')

// --- 3. wskazówki dojazdu --------------------------------------------------
const wskazowki = (ustawienia?.contactNotes || []).map((n) =>
  n === WSKAZOWKA_STARA ? WSKAZOWKA_NOWA : n
)
sprawdz(
  wskazowki.includes(WSKAZOWKA_NOWA),
  `Nie znalazłem wskazówki „${WSKAZOWKA_STARA}” do poprawienia`
)

// --- 4. vouchery -----------------------------------------------------------
const punkty = (voucher?.bullets || []).map((b) => {
  const trafienie = VOUCHER_PUNKTY_ZAMIANA.find(([prefiks]) => b.startsWith(prefiks))
  return trafienie ? trafienie[1] : b
})
for (const [prefiks, docelowy] of VOUCHER_PUNKTY_ZAMIANA) {
  sprawdz(punkty.includes(docelowy), `Nie znalazłem punktu zaczynającego się od „${prefiks}”`)
}

const cialoVouchera = (voucher?.body || []).map((b) => b)
const indeksPo = (naglowek) => {
  const i = cialoVouchera.findIndex(
    (b) => b.style === 'h3' && (b.children || []).map((c) => c.text).join('') === naglowek
  )
  return i === -1 ? -1 : i + 1
}
const iKupic = indeksPo('Jak kupić')
const iWykorzystac = indeksPo('Jak wykorzystać')
sprawdz(iKupic > 0, 'Nie znalazłem akapitu pod nagłówkiem „Jak kupić”')
sprawdz(iWykorzystac > 0, 'Nie znalazłem akapitu pod nagłówkiem „Jak wykorzystać”')
const podmienAkapit = (i, tekst) => {
  if (i <= 0) return
  const b = cialoVouchera[i]
  cialoVouchera[i] = {
    ...b,
    children: [{ ...(b.children?.[0] || { _key: `${b._key}s`, _type: 'span', marks: [] }), text: tekst }],
  }
}
podmienAkapit(iKupic, VOUCHER_JAK_KUPIC)
podmienAkapit(iWykorzystac, VOUCHER_JAK_WYKORZYSTAC)

// --- 5. cennik -------------------------------------------------------------
const grupy = (cennik?.groups || []).map((g) => g)
const iTwarz = grupy.findIndex((g) => g.anchor === 'pielegnacja-twarzy')
sprawdz(iTwarz !== -1, 'Brak grupy cennika „pielegnacja-twarzy”')

let pozycje = []
if (iTwarz !== -1) {
  pozycje = (grupy[iTwarz].items || []).map((it) => {
    const zmiana = CENNIK_ZMIANY.find(([stara]) => stara === it.name)
    if (!zmiana) return it
    const nowa = { ...it }
    if (zmiana[1]) nowa.name = zmiana[1]
    if (zmiana[2]) nowa.note = zmiana[2]
    return nowa
  })
  for (const [stara, nowa] of CENNIK_ZMIANY) {
    const docelowa = nowa || stara
    sprawdz(
      pozycje.some((it) => it.name === docelowa),
      `Cennik: nie znalazłem pozycji „${stara}”`
    )
  }
  // „Usuwanie prosaków” wchodzi bezpośrednio pod „Oczyszczanie manualne”.
  const iManualne = pozycje.findIndex((it) => it.name === 'Oczyszczanie manualne')
  sprawdz(iManualne !== -1, 'Cennik: nie znalazłem pozycji „Oczyszczanie manualne”')
  if (iManualne !== -1 && !pozycje.some((it) => it.name === PROSAKI.name)) {
    pozycje.splice(iManualne + 1, 0, {
      _key: 'group-2-item-prosaki',
      _type: 'item',
      ...PROSAKI,
    })
  }
}

// --- 6. pełny opis pielęgnacji twarzy --------------------------------------
const opisStary = twarz?.description || []
const tekstBloku = (b) => (b.children || []).map((c) => c.text).join('')
const wstep = opisStary[0]
sprawdz(
  wstep && wstep.style === 'normal',
  'Pierwszy blok opisu nie jest akapitem wstępu — sprawdź strukturę'
)
const iPrzeciw = opisStary.findIndex(
  (b) => b.style === 'h3' && tekstBloku(b) === 'Przeciwwskazania'
)
sprawdz(iPrzeciw !== -1, 'Nie znalazłem nagłówka „Przeciwwskazania” do zachowania')
const przeciwwskazania = iPrzeciw === -1 ? [] : opisStary.slice(iPrzeciw)
const opisNowy = wstep ? zbudujOpis(wstep, przeciwwskazania) : []

// --- zapis -----------------------------------------------------------------
if (bledy.length) {
  console.error('Nie zapisuję, bo treść w panelu nie wygląda tak, jak zakładam:')
  bledy.forEach((b) => console.error('  •', b))
  process.exit(1)
}

const mutacje = [
  {
    patch: {
      id: 'siteSettings',
      set: {
        promoText: PASEK,
        galleryHeading: NAGLOWEK_GALERII,
        contactNotes: wskazowki,
      },
    },
  },
  {
    patch: {
      id: 'voucherPage',
      set: {
        bullets: punkty,
        body: cialoVouchera,
        image: {
          _type: 'image',
          asset: { _type: 'reference', _ref: VOUCHER_ZDJECIE },
        },
      },
    },
  },
  {
    patch: {
      id: 'pricelist',
      set: { [`groups[_key=="${grupy[iTwarz]?._key}"].items`]: pozycje },
    },
  },
  { patch: { id: 'service-twarz', set: { description: opisNowy } } },
]

if (DRY) {
  console.log('PRÓBA (nic nie zapisuję).\n')
  console.log('Pasek promocji:', PASEK)
  console.log('Nagłówek galerii:', NAGLOWEK_GALERII)
  console.log('Wskazówki dojazdu:', wskazowki)
  console.log('\nPunkty vouchera:')
  punkty.forEach((p) => console.log('  •', p))
  console.log('\nCennik, pielęgnacja twarzy —', pozycje.length, 'pozycji:')
  pozycje.forEach((it) =>
    console.log(`  ${it.name} | ${it.price}${it.note ? ' | ' + it.note : ''}`)
  )
  console.log('\nPełny opis:', opisStary.length, '→', opisNowy.length, 'bloków')
  console.log('Pierwsze bloki:')
  opisNowy.slice(0, 6).forEach((b) => console.log(`  [${b.listItem || b.style}] ${tekstBloku(b).slice(0, 90)}`))
  console.log('Ostatnie bloki:')
  opisNowy.slice(-4).forEach((b) => console.log(`  [${b.listItem || b.style}] ${tekstBloku(b).slice(0, 90)}`))
  process.exit(0)
}

const odp = await fetch(`${BAZA}/mutate/production`, {
  method: 'POST',
  headers: naglowki,
  body: JSON.stringify({ mutations: mutacje }),
})
const wynik = await odp.json()
if (!odp.ok) {
  console.error('Błąd zapisu:', JSON.stringify(wynik, null, 2))
  process.exit(1)
}
console.log(`Zapisano ${wynik.results?.length ?? 0} zmian.`)
