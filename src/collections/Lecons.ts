import type { CollectionConfig } from 'payload'

export const Lecons: CollectionConfig = {
  slug: 'lecons',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'module', 'order', 'type'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'module',
      type: 'relationship',
      relationTo: 'modules',
      required: true,
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Vidéo', value: 'video' },
        { label: 'Texte', value: 'text' },
        { label: 'Quiz', value: 'quiz' },
        { label: 'Audio', value: 'audio' },
      ],
      defaultValue: 'video',
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'videoUrl',
      type: 'text',
      admin: { description: 'URL YouTube ou Loom' },
    },
    {
      name: 'duration',
      type: 'text',
      admin: { description: 'Ex: "12 min"' },
    },
    {
      name: 'keyPoints',
      type: 'array',
      fields: [
        { name: 'point', type: 'text' },
      ],
      admin: { description: 'Points clés de la leçon' },
    },
  ],
}
