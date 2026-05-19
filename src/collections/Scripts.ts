import type { CollectionConfig } from 'payload'

export const Scripts: CollectionConfig = {
  slug: 'scripts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'platform', 'published'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Invitation', value: 'invitation' },
        { label: 'Suivi', value: 'suivi' },
        { label: 'Relance', value: 'relance' },
        { label: 'Closing', value: 'closing' },
        { label: 'Recrutement équipe', value: 'recrutement' },
      ],
    },
    {
      name: 'platform',
      type: 'select',
      defaultValue: 'whatsapp',
      options: [
        { label: 'WhatsApp', value: 'whatsapp' },
        { label: 'Instagram DM', value: 'instagram' },
        { label: 'SMS', value: 'sms' },
        { label: 'Email', value: 'email' },
      ],
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
      admin: { description: 'Texte du script. Utilise {{prenom}}, {{produit}} pour les variables.' },
    },
    {
      name: 'tags',
      type: 'array',
      fields: [{ name: 'tag', type: 'text' }],
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
