import { defineType, defineField } from 'sanity'

export const galleryItem = defineType({
  name: 'galleryItem',
  title: 'Zdjęcie lub film w galerii',
  type: 'document',
  fields: [
    defineField({
      name: 'image',
      title: 'Zdjęcie',
      description:
        'Przy filmie z YouTube lub Vimeo zdjęcie służy jako miniatura (opcjonalnie).',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'videoUrl',
      title: 'Film (adres z YouTube lub Vimeo)',
      description:
        'Wklej adres filmu. Gdy pole jest wypełnione, zamiast zdjęcia pokaże się odtwarzacz.',
      type: 'url',
    }),
    defineField({
      name: 'caption',
      title: 'Podpis (opcjonalny)',
      type: 'string',
    }),
    defineField({
      name: 'order',
      title: 'Kolejność',
      type: 'number',
      initialValue: 0,
    }),
  ],
  orderings: [
    { title: 'Kolejność', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'caption', media: 'image', videoUrl: 'videoUrl' },
    prepare: ({ title, media, videoUrl }) => ({
      title: title || (videoUrl ? 'Film' : 'Zdjęcie'),
      subtitle: videoUrl || undefined,
      media,
    }),
  },
})
