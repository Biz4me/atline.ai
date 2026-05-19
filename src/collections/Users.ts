import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  access: {
    create: () => true,
  },
  fields: [
    {
      name: 'firstName',
      type: 'text',
    },
    {
      name: 'lastName',
      type: 'text',
    },
    {
      name: 'mlmCompany',
      type: 'text',
    },
    {
      name: 'mlmLevel',
      type: 'select',
      options: [
        { label: 'Débutant', value: 'debutant' },
        { label: 'Intermédiaire', value: 'intermediaire' },
        { label: 'Senior', value: 'senior' },
        { label: 'Expert', value: 'expert' },
      ],
    },
    {
      name: 'plan',
      type: 'select',
      defaultValue: 'free',
      options: [
        { label: 'Gratuit', value: 'free' },
        { label: 'Pro', value: 'pro' },
      ],
    },
    {
      name: 'isAdmin',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Accès admin — upload de documents RAG',
      },
    },
    {
      name: 'userMemory',
      type: 'json',
      admin: {
        description: 'Mémoire persistante Atlas — JSON structuré mis à jour après chaque session',
      },
    },
  ],
}
