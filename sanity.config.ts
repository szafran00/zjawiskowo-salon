'use client'

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { apiVersion, dataset, projectId } from './sanity/env'
import { schemaTypes } from './sanity/schemaTypes'

export default defineConfig({
  name: 'zjawiskowo',
  title: 'ZJAWISKOWO — panel treści',
  basePath: '/studio',
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
  },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Treść strony')
          .items([
            S.listItem()
              .title('Ustawienia salonu')
              .id('siteSettings')
              .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
            S.listItem()
              .title('O salonie')
              .id('aboutPage')
              .child(S.document().schemaType('aboutPage').documentId('aboutPage')),
            S.listItem()
              .title('Cennik')
              .id('pricelist')
              .child(S.document().schemaType('pricelist').documentId('pricelist')),
            S.divider(),
            S.documentTypeListItem('service').title('Zabiegi'),
            S.documentTypeListItem('trustBadge').title('Odznaki zaufania'),
            S.documentTypeListItem('review').title('Opinie'),
            S.documentTypeListItem('faqItem').title('FAQ'),
            S.documentTypeListItem('galleryItem').title('Galeria'),
          ]),
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
})
