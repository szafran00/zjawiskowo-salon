import { defineType, defineField } from 'sanity'

export const faqItem = defineType({
  name: 'faqItem',
  title: 'Pytanie FAQ',
  type: 'document',
  fields: [
    defineField({
      name: 'question',
      title: 'Pytanie',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'answer',
      title: 'Odpowiedź',
      type: 'text',
      rows: 3,
      validation: (r) => r.required(),
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
    select: { title: 'question' },
  },
})
