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
      name: 'introKicker',
      title: 'Nadtytuł bloku z punktami',
      type: 'string',
      initialValue: 'Jak to działa',
    }),
    defineField({
      name: 'introHeading',
      title: 'Nagłówek bloku z punktami',
      type: 'string',
      initialValue: 'Prezent, który sprawia radość',
    }),
    defineField({
      name: 'termsKicker',
      title: 'Nadtytuł sekcji z treścią',
      type: 'string',
      initialValue: 'Warunki',
    }),
    defineField({
      name: 'termsHeading',
      title: 'Nagłówek sekcji z treścią',
      type: 'string',
      initialValue: 'Dobrze wiedzieć',
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
    defineField({
      name: 'ctaKicker',
      title: 'Nadtytuł sekcji z telefonem',
      type: 'string',
      initialValue: 'Zamów voucher',
    }),
    defineField({
      name: 'ctaHeading',
      title: 'Nagłówek sekcji z telefonem',
      type: 'string',
      initialValue: 'Zadzwoń, przygotuję go dla Ciebie',
    }),
    defineField({
      name: 'ctaLead',
      title: 'Opis sekcji z telefonem',
      type: 'text',
      rows: 2,
      initialValue:
        'Ustalimy kwotę albo zabieg, a voucher przygotuję do odbioru w salonie.',
    }),
  ],
  preview: { prepare: () => ({ title: 'Vouchery' }) },
})
