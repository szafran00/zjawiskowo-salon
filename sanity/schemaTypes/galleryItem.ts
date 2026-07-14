import { defineType, defineField } from 'sanity'

export const galleryItem = defineType({
  name: 'galleryItem',
  title: 'Zdjęcie w galerii',
  type: 'document',
  fields: [
    defineField({
      name: 'image',
      title: 'Zdjęcie',
      type: 'image',
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Podpis (opcjonalny)',
      type: 'string',
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
    select: { title: 'caption', media: 'image' },
    prepare: ({ title, media }) => ({ title: title || 'Zdjęcie', media }),
  },
})
