// projectId i dataset są publiczne (trafiają do bundla klienta), więc mają
// bezpieczne wartości domyślne — dzięki temu deploy działa też bez zmiennych env.
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-10-01'

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'kleyi1aa'
