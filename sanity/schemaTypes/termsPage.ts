import { defineType, defineField } from 'sanity'

export const termsPage = defineType({
  name: 'termsPage',
  title: 'Regulamin',
  type: 'document',
  fields: [
    defineField({
      name: 'kicker',
      title: 'Nadtytuł',
      type: 'string',
      initialValue: 'Informacje prawne',
    }),
    defineField({
      name: 'heading',
      title: 'Nagłówek',
      type: 'string',
      initialValue: 'Regulamin salonu',
    }),
    defineField({
      name: 'lead',
      title: 'Wprowadzenie',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'notice',
      title: 'Adnotacja robocza (widoczna nad treścią)',
      type: 'string',
      description:
        'Np. informacja, że dokument jest wersją roboczą do weryfikacji prawnej. Puste pole ukrywa adnotację.',
    }),
    defineField({
      name: 'body',
      title: 'Treść regulaminu',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'privacyIntro',
      title: 'Polityka prywatności — wprowadzenie',
      type: 'text',
      rows: 3,
      description:
        'Krótki akapit nad odnośnikiem do pełnej polityki prywatności i cookies.',
    }),
    defineField({
      name: 'updatedAt',
      title: 'Data ostatniej aktualizacji',
      type: 'string',
      description: 'Np. „lipiec 2026”.',
    }),
  ],
  preview: { prepare: () => ({ title: 'Regulamin' }) },
})
