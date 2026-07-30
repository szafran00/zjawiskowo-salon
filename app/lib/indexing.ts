// Czy strona może trafić do wyszukiwarki.
//
// Dopóki stoi na adresie roboczym i ma treść przykładową (wymyślone opinie,
// regulamin oznaczony jako roboczy, zdjęcia ze stocka), nie powinna być
// indeksowana — zaindeksowanie takiej wersji pod marką klientki jest trudne
// do szybkiego cofnięcia.
//
// Przed publikacją ustawić w hostingu: NEXT_PUBLIC_ALLOW_INDEXING=true
export const indexingAllowed = process.env.NEXT_PUBLIC_ALLOW_INDEXING === 'true'
