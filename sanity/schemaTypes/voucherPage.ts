import { defineType, defineField } from 'sanity'

export const voucherPage = defineType({
  name: 'voucherPage',
  title: 'Vouchery',
  type: 'document',
  fields: [
    defineField({
      name: 'kicker',
      title: 'Nadtytuł',
      type: 'string',
      initialValue: 'Prezent',
    }),
    defineField({
      name: 'heading',
      title: 'Nagłówek',
      type: 'string',
      initialValue: 'Vouchery podarunkowe',
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
      name: 'bullets',
      title: 'Punkty (lista)',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Krótkie informacje praktyczne, np. termin ważności, sposób zakupu.',
    }),
    defineField({
      name: 'image',
      title: 'Zdjęcie',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Tekst przycisku',
      type: 'string',
      initialValue: 'Zapytaj o voucher',
    }),
    defineField({
      name: 'showOnHome',
      title: 'Pokaż sekcję voucherów na stronie głównej',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: { prepare: () => ({ title: 'Vouchery' }) },
})
