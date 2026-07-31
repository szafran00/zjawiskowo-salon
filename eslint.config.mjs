import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, globalIgnores } from "eslint/config";
import { FlatCompat } from "@eslint/eslintrc";

// eslint-config-next w wersji 15 to nadal konfiguracja w starym formacie:
// `core-web-vitals` i `typescript` eksportują zwykłe obiekty z polem `extends`,
// a nie tablice reguł. Poprzednia wersja tego pliku importowała je tak, jakby
// były tablicami płaskiej konfiguracji, przez co `npm run lint` w ogóle się nie
// uruchamiał (najpierw ERR_MODULE_NOT_FOUND, po dodaniu rozszerzenia
// „nextVitals is not iterable"). FlatCompat tłumaczy stary format na nowy.
const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
});

const eslintConfig = defineConfig([
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Rozpakowany projekt graficzny: wygenerowany kod cudzego narzędzia,
    // trzymany jako materiał źródłowy. Nie jest budowany ani serwowany,
    // a jego ostrzeżenia zagłuszały wynik dla kodu strony.
    "design/**",
  ]),
]);

export default eslintConfig;
