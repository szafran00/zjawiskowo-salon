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
      name: 'slug',
      title: 'Adres podstrony (slug)',
      type: 'slug',
      options: { source: 'title' },
      validation: (r) => r.required(),
      description: 'Np. „laser" → /zabiegi/laser',
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
      name: 'description',
      title: 'Pełny opis',
      type: 'array',
      of: [{ type: 'block' }],
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
