// Teksty „Jak pracuję" i „Dlaczego Krzeszowice" nadesłane przez klientkę.
// Wchodzą w miejsce dwóch placeholderów „[Do uzupełnienia przez Martę: …]".
//
//   node scripts/tresci-o-mnie-2026-07-30.mjs --dry
//   node scripts/tresci-o-mnie-2026-07-30.mjs
//
// Treść przepisana dosłownie, razem z jej interpunkcją i myślnikami. Jedyna
// ingerencja to podział na akapity w miejscach, gdzie sama łamała wiersz —
// jeden blok tekstu na całą stronę byłby nie do przeczytania.
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

const JAK_PRACUJE = [
  'Perfekcyjnie przygotowana – to było moje założenie. Buduję swoją markę od 2022 roku. Najpierw studia w zakresie administracji w sektorze prywatnym, które dały solidne podstawy do prowadzenia firmy. Kolejny krok to edukacja w Akademii Sztuki Piękności - mocne fundamenty do pracy w moim salonie. Dyplomy z zakresu kosmetyki praktycznej, henny, laminacji brwi i rzęs, farbki, wizażu i stylizacji – makijaż, przedłużania rzęs pozwoliły uzyskać odpowiednie kompetencje i umiejętności. Ciągłe pragnienie rozwoju osobistego nie pozwala mi stać w miejscu. Dlatego w następnym etapie znalazły się szkolenia z zakresu stylizacji paznokci. I moja wisienka na torcie – szkolenia z zakresu depilacji laserowej. Rozwój zawodowy poprzez ciągłe podnoszenie kwalifikacji, z każdym dniem przenosi moją pracę na inny - wyższy poziom.',
  'Praca daje mi ogromną satysfakcję. Szczególnie uśmiech Klientki/Klienta kiedy po zabiegu spojrzy w lustro i z niedowierzaniem dotyka swojej skóry. Albo kolejna wizyta depilacyjna, gdy słyszę, że włosków jest coraz mniej na maszynce, nie wrastają i skóra nie jest podrażniona po goleniu. Czerpię pełnymi garściami to co wnosi Klientka/Klient do mojego życia, jestem wdzięczna za każdy promyk szczęścia, każdy smutek – to wszystko o czym rozmawiamy to dla mnie ogromna wartość, która wzbogaca moje życie na wielu poziomach.',
  'Misją mojego salonu jest tworzenie strefy komfortu, oazy spokoju - która będzie wzbudzać pozytywne emocje i wyciszenie, dzięki poprawie wyglądu, urody i samopoczucia.',
  'To, co nadal będzie zapewnione dla moich Klientek/Klientów to przede wszystkim: profesjonalizm w wykonywaniu zabiegów, szeroka gama usług dostępnych w jednym miejscu, certyfikowany sprzęt, profesjonalne kosmetyki, porady dotyczące domowej pielęgnacji oraz atmosfera sprzyjająca relaksacji.',
  'Kieruję słowa podziękowania dla moich Klientek/Klientów,',
  'Dziękuję za obecność, zaufanie, wspaniałe opinie (100 % pozytywnych opinii). Zawsze czytając opinie, jestem szczerze wzruszona ogromem ciepłych słów, bo nie są to tylko gwiazdki, ale opisane pozytywne wrażenia z wizyty. To sprawia, że moja praca ma sens i moje zaangażowanie jest docenione. Mam nadzieję, że każda osoba czuje się w pełni bezpieczna i zaopiekowana. Tworzenie tej przestrzeni dla Was jest dla mnie ogromnym przywilejem.',
  'Dziękuję!',
]

const DLACZEGO = [
  'Rynek usług kosmetycznych musi sprostać wymaganiom odbiorców. Dzisiejsze realia, postęp technologiczny i narzucane trendy powodują, że wzrasta świadomość odnośnie zdrowego stylu życia, zadbanego wyglądu, lepszego samopoczucia, czy poprawy wizerunku. Prowadząc własną działalność, skupiam się głównie na usługach, jakich nie ma w ofercie pobliskich gabinetów. W zamyśle było stworzenie oferty usług skierowanych nie tylko do kobiet, ale i do mężczyzn, gdyż badając rynek okazało się, że wzrasta świadomość mężczyzn odnośnie pielęgnacji, a w środowisku lokalnym nie zawsze mogą znaleźć oni oferty dla siebie lub dostosowane do swoich potrzeb.',
  'Dzisiejszy odbiorca oczekuje otrzymać usługę na wysokim poziomie. W ZJAWISKOWO jest to osiągalne. Istnieje jedno stanowisko pracy, co zapewnia wykonywanie zabiegów na twarz lub ciało z zachowaniem pełnego komfortu, wyciszenia i relaksacji. Brak hałasu związanego z rozmowami lub wykonywaniem zabiegu na innym stanowisku. Dużym atutem jest też oddzielna poczekalnia, bezpłatny parking, bliski dostęp do centrum miasta, dworca PKP i przystanku autobusowego.',
  'Mieszkańcy Krzeszowic i okolic nie muszą dojeżdżać do Krakowa, co daje oszczędność czasu, mniejsze koszty transportu i minimalizuje stres związany z korkami i płatnymi parkingami. Można swobodnie zaplanować dzień, wplatając wizytę pomiędzy obowiązki. Często po zabiegach nie zaleca się nakładania kolorowych kosmetyków, mając więc salon blisko miejsca zamieszkania można wrócić do domu bez makijażu, zmniejszając też ryzyko podrażnień. Kolejnym plusem jest szybki dostęp, w przypadku zwolnienia się terminu. W moim salonie każdej osobie zapewniam odpowiednią ilość czasu, co przekłada się na wzajemne zaufanie, poczucie bezpieczeństwa, znajomość potrzeb skóry i dobranie najlepszych efektów zabiegowych.',
]

const blok = (id, i, text) => ({
  _type: 'block',
  _key: `${id}-${i}`,
  style: 'normal',
  markDefs: [],
  children: [{ _type: 'span', _key: `${id}-${i}-s`, text, marks: [] }],
})

const res = await fetch(
  `https://${PROJECT}.api.sanity.io/v${APIV}/data/query/${DATASET}?query=${encodeURIComponent('*[_type=="aboutPage"][0]')}`
)
const doc = (await res.json()).result
if (!doc?.body) {
  console.error('Brak dokumentu „O mnie" albo pustej treści')
  process.exit(1)
}

const tekst = (b) =>
  (b.children || []).map((c) => c.text || '').join('')

const body = []
let zamienione = 0
for (const b of doc.body) {
  const t = tekst(b)
  if (b.style === 'normal' && /Do uzupełnienia przez Mart/i.test(t)) {
    const droga = /drodze zawodowej|szkoleniach/i.test(t)
    const zrodlo = droga ? JAK_PRACUJE : DLACZEGO
    const id = droga ? 'jak' : 'krz'
    console.log(`\n  zamieniam placeholder (${id}): „${t.slice(0, 70)}…"`)
    console.log(`  na ${zrodlo.length} akapitów, pierwszy: „${zrodlo[0].slice(0, 70)}…"`)
    zrodlo.forEach((p, i) => body.push(blok(id, i, p)))
    zamienione++
    continue
  }
  body.push(b)
}

console.log(`\nZamienionych placeholderów: ${zamienione} (spodziewane 2)`)
console.log(`Bloków w treści: ${doc.body.length} → ${body.length}`)
if (zamienione !== 2) {
  console.error('Nie znaleziono obu placeholderów — przerywam, żeby niczego nie nadpisać.')
  process.exit(1)
}

if (DRY) {
  console.log('(--dry: nic nie zapisano)')
  process.exit(0)
}

const zapis = await fetch(
  `https://${PROJECT}.api.sanity.io/v${APIV}/data/mutate/${DATASET}?returnIds=true`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ mutations: [{ patch: { id: doc._id, set: { body } } }] }),
  }
)
const out = await zapis.json()
if (!zapis.ok) {
  console.error('BŁĄD zapisu:', JSON.stringify(out, null, 2))
  process.exit(1)
}
console.log('Zapisano treść „O mnie".')
