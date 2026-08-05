import { defineType, defineField } from 'sanity'

export const pricelist = defineType({
  name: 'pricelist',
  title: 'Cennik',
  type: 'document',
  fields: [
    defineField({
      name: 'pageKicker',
      title: 'Nadtytuł strony',
      type: 'string',
      initialValue: 'Cennik',
    }),
    defineField({
      name: 'pageHeading',
      title: 'Nagłówek strony',
      type: 'string',
      initialValue: 'Cennik zabiegów',
    }),
    defineField({
      name: 'intro',
      title: 'Wstęp (opcjonalny)',
      type: 'text',
      rows: 2,
      description: 'Widoczny pod nagłówkiem strony oraz w skrócie cennika na stronie głównej.',
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
              name: 'noteAfter',
              title: 'Adnotacja pod pozycjami grupy',
              type: 'text',
              rows: 2,
              description:
                'To samo co wyżej, tylko na końcu grupy, pod ostatnią ceną. Do zdań, które mają domykać listę, a nie ją zapowiadać (np. „Gratis maska i peeling przy każdym zabiegu”).',
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
                    defineField({
                      name: 'oldPrice',
                      title: 'Cena przed obniżką',
                      type: 'string',
                      description:
                        'Np. „600 zł”. Pokaże się przekreślona obok ceny. Puste pole = bez przekreślenia.',
                    }),
                    defineField({
                      name: 'saving',
                      title: 'Oszczędność',
                      type: 'string',
                      description:
                        'Np. „1200 zł”. Pokaże się złotym drukiem po prawej stronie wiersza.',
                    }),
                    defineField({
                      name: 'gratis',
                      title: 'Gratis',
                      type: 'string',
                      description:
                        'Np. „pachy gratis”. Pokaże się złotą wersalikową linijką pod nazwą.',
                    }),
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
    defineField({
      name: 'ctaKicker',
      title: 'Nadtytuł sekcji z telefonem',
      type: 'string',
      initialValue: 'Masz pytania o ceny?',
    }),
    defineField({
      name: 'ctaHeading',
      title: 'Nagłówek sekcji z telefonem',
      type: 'string',
      initialValue: 'Zadzwoń — dobierzemy pakiet',
    }),
  ],
  preview: { prepare: () => ({ title: 'Cennik' }) },
})
