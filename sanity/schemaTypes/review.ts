import { defineType, defineField } from 'sanity'

export const review = defineType({
  name: 'review',
  title: 'Opinia',
  type: 'document',
  fields: [
    defineField({
      name: 'quote',
      title: 'Treść opinii',
      type: 'text',
      rows: 3,
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'author',
      title: 'Autorka (imię i inicjał)',
      type: 'string',
    }),
    defineField({
      name: 'rating',
      title: 'Ocena (gwiazdki)',
      type: 'number',
      initialValue: 5,
      validation: (r) => r.min(1).max(5),
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
    select: { title: 'author', subtitle: 'quote' },
  },
})
