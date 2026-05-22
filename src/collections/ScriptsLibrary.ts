import type { CollectionConfig } from 'payload'

export const ScriptsLibrary: CollectionConfig = {
  slug: 'scripts-library',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'useCount', 'owner'],
  },
  access: {
    read: ({ req }) => {
      if (!req.user) return false
      return { owner: { equals: req.user.id } }
    },
    create: ({ req }) => !!req.user,
    update: ({ req }) => {
      if (!req.user) return false
      return { owner: { equals: req.user.id } }
    },
    delete: ({ req }) => {
      if (!req.user) return false
      return { owner: { equals: req.user.id } }
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      defaultValue: 'invitation',
      options: [
        { label: 'Invitation', value: 'invitation' },
        { label: 'Objection', value: 'objection' },
        { label: 'Closing', value: 'closing' },
        { label: 'Suivi', value: 'suivi' },
      ],
    },
    {
      name: 'useCount',
      type: 'number',
      defaultValue: 0,
      admin: { readOnly: true },
    },
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: false,
    },
  ],
}
