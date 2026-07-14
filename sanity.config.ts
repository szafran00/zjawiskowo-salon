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
            S.divider(),
            S.documentTypeListItem('service').title('Usługi (filary)'),
            S.documentTypeListItem('trustBadge').title('Odznaki zaufania'),
            S.documentTypeListItem('review').title('Opinie'),
            S.documentTypeListItem('faqItem').title('FAQ'),
            S.documentTypeListItem('galleryItem').title('Galeria'),
          ]),
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
})
