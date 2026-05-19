import type { CollectionConfig } from 'payload'

export const Prospects: CollectionConfig = {
  slug: 'prospects',
  admin: {
    useAsTitle: 'firstName',
    defaultColumns: ['firstName', 'lastName', 'status', 'score', 'owner'],
  },
  access: {
    read: ({ req }) => {
      if (!req.user) return false
      return { owner: { equals: req.user.id } }
    },
  },
  fields: [
    {
      name: 'firstName',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'email',
      type: 'email',
    },
    {
      name: 'source',
      type: 'select',
      options: [
        { label: 'Instagram', value: 'instagram' },
        { label: 'Facebook', value: 'facebook' },
        { label: 'LinkedIn', value: 'linkedin' },
        { label: 'TikTok', value: 'tiktok' },
        { label: 'Recommandation', value: 'recommandation' },
        { label: 'Événement', value: 'evenement' },
        { label: 'Autre', value: 'autre' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'nouveau',
      options: [
        { label: 'Nouveau', value: 'nouveau' },
        { label: 'Contacté', value: 'contacte' },
        { label: 'Intéressé', value: 'interesse' },
        { label: 'Présentation faite', value: 'presentation' },
        { label: 'En réflexion', value: 'reflexion' },
        { label: 'Converti', value: 'converti' },
        { label: 'Non intéressé', value: 'non-interesse' },
      ],
    },
    {
      name: 'score',
      type: 'number',
      min: 0,
      max: 10,
      admin: { description: 'Score de chaleur (0-10)' },
    },
    {
      name: 'notes',
      type: 'textarea',
    },
    {
      name: 'nextFollowUp',
      type: 'date',
      admin: { description: 'Date du prochain suivi' },
    },
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'users',
      admin: { description: 'Utilisateur propriétaire de ce prospect' },
    },
  ],
}
