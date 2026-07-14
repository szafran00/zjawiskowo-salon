import { defineType, defineField } from 'sanity'

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'O salonie',
  type: 'document',
  fields: [
    defineField({
      name: 'heading',
      title: 'Nagłówek',
      type: 'string',
      initialValue: 'O salonie',
    }),
    defineField({
      name: 'lead',
      title: 'Wprowadzenie',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'body',
      title: 'Treść',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'image',
      title: 'Zdjęcie',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
  preview: { prepare: () => ({ title: 'O salonie' }) },
})
