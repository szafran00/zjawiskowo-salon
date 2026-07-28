import { defineType, defineField } from 'sanity'

export const service = defineType({
  name: 'service',
  title: 'Zabieg',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Nazwa zabiegu',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'kicker',
      title: 'Nadtytuł / kategoria',
      type: 'string',
    }),
    defineField({
      name: 'navLabel',
      title: 'Nazwa w menu',
      type: 'string',
      description:
        'Krótka nazwa w rozwijanym menu „Zabiegi”, np. „Depilacja laserowa”. Puste pole = użyta zostanie kategoria, a w dalszej kolejności nazwa zabiegu.',
    }),
    defineField({
      name: 'slug',
      title: 'Adres podstrony (slug)',
      type: 'slug',
      options: { source: 'title' },
      validation: (r) => r.required(),
      description: 'Np. „depilacja-laserowa” → /zabiegi/depilacja-laserowa',
    }),
    defineField({
      name: 'excerpt',
      title: 'Krótki opis (na kartę)',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'image',
      title: 'Zdjęcie',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'atuty',
      title: 'Atuty (lista punktów)',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'introHeading',
      title: 'Nagłówek bloku z atutami',
      type: 'string',
      initialValue: 'Na czym polega',
    }),
    defineField({
      name: 'description',
      title: 'Pełny opis',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'detailsKicker',
      title: 'Nadtytuł sekcji z pełnym opisem',
      type: 'string',
      initialValue: 'Szczegóły',
    }),
    defineField({
      name: 'detailsHeading',
      title: 'Nagłówek sekcji z pełnym opisem',
      type: 'string',
      initialValue: 'Więcej o zabiegu',
    }),
    defineField({
      name: 'pricelistAnchor',
      title: 'Odnośnik do sekcji cennika',
      type: 'string',
      description:
        'Identyfikator grupy w cenniku, np. „depilacja-laserowa”. Dodaje na podstronie przycisk prowadzący prosto do właściwej części cennika.',
    }),
    defineField({
      name: 'featured',
      title: 'Wyróżniony na stronie głównej',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Tekst przycisku',
      type: 'string',
      initialValue: 'Umów wizytę',
    }),
    defineField({
      name: 'ctaKicker',
      title: 'Nadtytuł sekcji z telefonem',
      type: 'string',
      initialValue: 'Pierwszy krok jest bezpłatny',
    }),
    defineField({
      name: 'ctaHeading',
      title: 'Nagłówek sekcji z telefonem',
      type: 'string',
      initialValue: 'Umów konsultację',
    }),
    defineField({
      name: 'order',
      title: 'Kolejność',
      type: 'number',
      initialValue: 0,
    }),
  ],
  orderings: [
    { title: 'Kolejność', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'title', subtitle: 'kicker', media: 'image' },
  },
})
