import { defineType, defineField } from 'sanity'

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'O mnie',
  type: 'document',
  fields: [
    defineField({
      name: 'kicker',
      title: 'Nadtytuł',
      type: 'string',
      initialValue: 'Salon',
    }),
    defineField({
      name: 'heading',
      title: 'Nagłówek',
      type: 'string',
      initialValue: 'O mnie',
    }),
    defineField({
      name: 'lead',
      title: 'Wprowadzenie',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'introKicker',
      title: 'Nadtytuł bloku z treścią',
      type: 'string',
      initialValue: 'Kilka słów',
    }),
    defineField({
      name: 'introHeading',
      title: 'Nagłówek bloku z treścią',
      type: 'string',
      initialValue: 'Piękno zaczyna się tutaj',
    }),
    defineField({
      name: 'body',
      title: 'Treść',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'atuty',
      title: 'Punkty wyróżniające (lista)',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'whyHeading',
      title: 'Nagłówek nad punktami wyróżniającymi',
      type: 'string',
      initialValue: 'Co mnie wyróżnia',
    }),
    defineField({
      name: 'image',
      title: 'Zdjęcie',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'ctaKicker',
      title: 'Nadtytuł sekcji z telefonem',
      type: 'string',
      initialValue: 'Poznajmy się',
    }),
    defineField({
      name: 'ctaHeading',
      title: 'Nagłówek sekcji z telefonem',
      type: 'string',
      initialValue: 'Zapraszam na bezpłatną konsultację',
    }),
  ],
  preview: { prepare: () => ({ title: 'O mnie' }) },
})
