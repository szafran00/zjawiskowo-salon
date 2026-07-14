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
          preview: { select: { title: 'title' } },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: 'Cennik' }) },
})
