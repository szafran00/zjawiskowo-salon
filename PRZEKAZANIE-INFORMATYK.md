# Strona ZJAWISKOWO — co trzeba zrobić po Waszej stronie

Dokument dla informatyka prowadzącego serwer klientki.

Stan na **6 sierpnia 2026**, gałąź `redesign-2026-07-28`. Cała ścieżka opisana
niżej (świeży `git clone`, `npm ci`, build z flagą indeksowania, `npm start`)
została tego dnia przejechana od zera na czystym katalogu, na Node 20.15:
strona wstaje, `robots.txt` wychodzi bez `Disallow: /`, panel `/studio`
odpowiada, a testy treści przechodzą tak samo jak na wdrożeniu podglądowym.

## W skrócie

Strona to aplikacja **Next.js**, więc potrzebuje **działającego procesu Node**.
Nie da się jej wrzucić jako pliki na FTP. Panel do edycji treści (Sanity) jest
usługą zewnętrzną i **nie wymaga od Was niczego** — ani bazy, ani tokenu.

## Kod

```
git clone -b redesign-2026-07-28 https://github.com/szafran00/zjawiskowo-salon.git
```

Gałąź podajemy jawnie. Samo `git clone` da `main`, czyli wersję sprzed
przebudowy strony. Repozytorium jest publiczne, nie trzeba zaproszenia.

## Uruchomienie

Wymagany **Node 20 LTS lub 22 LTS**. Na Node 18 build nie przejdzie.

```
npm ci
NEXT_PUBLIC_ALLOW_INDEXING=true npm run build
npm start
```

Trzy uwagi, każda z nich potrafi kosztować godzinę:

1. **`npm ci`, nie `npm install`.** Instalacja bez pliku blokującego podbija
   wersję Next i strona może się zachować inaczej niż testowana.
2. **`NEXT_PUBLIC_ALLOW_INDEXING=true` musi być ustawione przed `npm run build`**,
   nie przed `npm start`. Bez tego strona serwuje `robots.txt` z `Disallow: /`
   i Google nigdy jej nie zaindeksuje. Plik ten powstaje w czasie budowania,
   więc dorzucenie zmiennej później nic nie da.
   Sprawdzenie po wdrożeniu: `curl https://zjawiskowo.com.pl/robots.txt` — ma
   NIE być tam `Disallow: /`.
3. `npm start` nasłuchuje na porcie **3000**. Zmiana: `PORT=3001 npm start`.

Build zjada około 2 GB pamięci. Jeśli maszyna ma mało RAM, warto zbudować gdzie
indziej i skopiować katalog `.next`.

Proces musi wstawać po restarcie — `pm2` albo usługa systemd z `Restart=always`.

## Serwer WWW

Pod `zjawiskowo.com.pl` stoi dziś **Apache/2.4.68 (Debian)** na `5.63.186.12`,
ten sam, na którym działa `krzeszowice.net.pl`. Serwuje zaślepkę z 17 stycznia.

**Nie instalujcie nginx obok** — zajmie te same porty. Wystarczy vhost Apache:

```apache
a2enmod proxy proxy_http
```

```apache
<VirtualHost *:443>
    ServerName zjawiskowo.com.pl
    ServerAlias www.zjawiskowo.com.pl
    ProxyPreserveHost On
    ProxyPass        / http://127.0.0.1:3000/
    ProxyPassReverse / http://127.0.0.1:3000/
</VirtualHost>
```

## HTTPS jest konieczne, a dziś go nie ma

Sprawdzone: `https://zjawiskowo.com.pl` nie odpowiada, certyfikatu nie ma.
`krzeszowice.net.pl` na tej samej maszynie ma TLS, więc certbot jest pod ręką.

To nie jest kosmetyka. **Bez ważnego certyfikatu panel `/studio` się nie
zaloguje** — Sanity odrzuca połączenia po zwykłym HTTP. Certyfikat musi być
wystawiony, zanim strona trafi do klientki.

Warto też włączyć `certbot.timer` i raz sprawdzić `certbot renew --dry-run`.

## Poczta: uwaga na kolejność ruchów

Domena ma rekord **MX wskazujący na samą siebie**, a SPF brzmi `v=spf1 mx a ~all`,
czyli autoryzuje dokładnie ten adres IP.

Dopóki strona zostaje na `5.63.186.12`, **nie ruszamy nic w DNS**. Gdyby jednak
strona miała pójść na inną maszynę, najpierw trzeba wydzielić pocztę na osobny
host i poprawić SPF, a dopiero potem przestawiać rekord A. Odwrotna kolejność
kasuje pocztę w domenie.

## Panel treści (Sanity) — co po Waszej stronie

**Nic.** Konkretnie:

- Strona czyta treść z publicznego zbioru danych, **bez żadnego tokenu**.
- Nie ma bazy do postawienia, nie ma migracji, nie ma kopii do wgrania.
- Panel jedzie razem ze stroną, pod adresem `/studio`. Nie wymaga osobnego
  wdrożenia.
- Klientka loguje się tam swoim kontem Google.

Jedyna rzecz do zrobienia jest **po stronie wykonawcy, nie Waszej**: dopisanie
docelowej domeny do listy dozwolonych źródeł w projekcie Sanity. Bez tego strona
będzie działać normalnie, ale panel `/studio` z nowej domeny nie zaloguje się.
Dajcie znać, gdy domena i certyfikat będą gotowe.

## Czego nie potrzebujecie

- Tokenu zapisu do Sanity. Zostaje u wykonawcy.
- Katalogu `scripts/` — to jednorazowe narzędzia do wgrywania treści.
  **Nie uruchamiajcie ich.** Kilka z nich nadpisuje treść w panelu i cofnęłoby
  poprawki klientki.
- Bazy danych, PHP, cron-ów do działania strony.

## Kopie zapasowe

Cała treść (cennik, opinie, FAQ, teksty) żyje wyłącznie w Sanity. Dziś **nikt
nie robi jej kopii**. Jeśli chcecie to przejąć, wystarczy zadanie cykliczne:

```
npx sanity dataset export production kopia-$(date +%F).tar.gz
```

Wymaga tokenu odczytu — poprosicie o osobny, wystawiony dla Was.

## Czego strona nie ma

Analityki, Search Console i mapy witryny. Nie blokuje to uruchomienia, ale po
publikacji nikt nie będzie wiedział, ilu ludzi wchodzi na stronę. Do ustalenia
z klientką, czy chce.

## Kontrola po wdrożeniu

```
curl -I https://zjawiskowo.com.pl/           # ma być 200 po HTTPS
curl  https://zjawiskowo.com.pl/robots.txt   # NIE ma być Disallow: /
```

Panel: `https://zjawiskowo.com.pl/studio` — ma wpuścić po zalogowaniu Google.
