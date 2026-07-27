import { defineType, defineField } from 'sanity'

export const pricelist = defineType({
  name: 'pricelist',
  title: 'Cennik',
  type: 'document',
  fields: [
    defineField({
      name: 'intro',
      title: 'Wstęp (opcjonalny)',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'groups',
      title: 'Grupy usług',
      type: 'array',
      of: [
        defineField({
          name: 'group',
          title: 'Grupa',
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Nazwa grupy', type: 'string' }),
            defineField({
              name: 'anchor',
              title: 'Identyfikator sekcji (do menu)',
              type: 'string',
              description:
                'Bez spacji i polskich znaków, np. „depilacja-laserowa”. Pozwala wejść prosto w tę część cennika z rozwijanego menu „Cennik”.',
            }),
            defineField({
              name: 'showInMenu',
              title: 'Pokaż w rozwijanym menu „Cennik”',
              type: 'boolean',
              initialValue: true,
            }),
            defineField({
              name: 'note',
              title: 'Adnotacja pod nazwą grupy',
              type: 'text',
              rows: 2,
              description: 'Np. informacja o promocji na serię zabiegów.',
            }),
            defineField({
              name: 'items',
              title: 'Pozycje',
              type: 'array',
              of: [
                defineField({
                  name: 'item',
                  title: 'Pozycja',
                  type: 'object',
                  fields: [
                    defineField({ name: 'name', title: 'Nazwa', type: 'string' }),
                    defineField({ name: 'price', title: 'Cena', type: 'string' }),
                    defineField({ name: 'note', title: 'Uwaga (opcjonalnie)', type: 'string' }),
                  ],
                  preview: { select: { title: 'name', subtitle: 'price' } },
                }),
              ],
            }),
          ],
          preview: { select: { title: 'title', subtitle: 'anchor' } },
        }),
      ],
    }),
    defineField({
      name: 'outro',
      title: 'Nota pod cennikiem',
      type: 'text',
      rows: 3,
      description: 'Np. informacja, że ceny mają charakter orientacyjny.',
    }),
  ],
  preview: { prepare: () => ({ title: 'Cennik' }) },
})
