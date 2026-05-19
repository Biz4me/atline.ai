import type { CollectionConfig } from 'payload'

export const Modules: CollectionConfig = {
  slug: 'modules',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'order', 'published'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Invitation', value: 'invitation' },
        { label: 'Présentation', value: 'presentation' },
        { label: 'Suivi', value: 'suivi' },
        { label: 'Closing', value: 'closing' },
        { label: 'Leadership', value: 'leadership' },
        { label: 'Mindset', value: 'mindset' },
        { label: 'Réseaux sociaux', value: 'reseaux-sociaux' },
      ],
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Ordre d\'affichage (0 = premier)' },
    },
    {
      name: 'duration',
      type: 'text',
      admin: { description: 'Durée estimée (ex: "45 min")' },
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}
