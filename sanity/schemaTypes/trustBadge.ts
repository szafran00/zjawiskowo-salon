import { defineType, defineField } from 'sanity'

export const trustBadge = defineType({
  name: 'trustBadge',
  title: 'Odznaka zaufania',
  type: 'document',
  fields: [
    defineField({
      name: 'text',
      title: 'Treść',
      type: 'string',
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
    select: { title: 'text' },
  },
})
