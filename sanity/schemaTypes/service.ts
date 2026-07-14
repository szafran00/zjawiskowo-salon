import { defineType, defineField } from 'sanity'

export const service = defineType({
  name: 'service',
  title: 'Usługa (filar)',
  type: 'document',
  fields: [
    defineField({
      name: 'kicker',
      title: 'Nadtytuł (mała etykieta)',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'title',
      title: 'Tytuł sekcji',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'anchor',
      title: 'Kotwica (do menu)',
      type: 'slug',
      options: { source: 'kicker' },
      description: 'Np. „laser" albo „twarz" — używane w linkach menu.',
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
      title: 'Pełny opis (opcjonalny)',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'reverse',
      title: 'Zdjęcie po prawej stronie',
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
    select: { title: 'title', subtitle: 'kicker' },
  },
})
