import type { CollectionConfig } from 'payload'

export const Conversations: CollectionConfig = {
  slug: 'conversations',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'agent', 'user', 'createdAt'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      admin: { description: 'Résumé auto-généré de la conversation' },
    },
    {
      name: 'agent',
      type: 'select',
      defaultValue: 'atlas',
      options: [
        { label: 'Atlas', value: 'atlas' },
        { label: 'Markline', value: 'markline' },
        { label: 'Proline', value: 'proline' },
      ],
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'messages',
      type: 'array',
      fields: [
        {
          name: 'role',
          type: 'select',
          options: [
            { label: 'Utilisateur', value: 'user' },
            { label: 'Assistant', value: 'assistant' },
          ],
        },
        {
          name: 'content',
          type: 'textarea',
        },
        {
          name: 'timestamp',
          type: 'date',
        },
      ],
    },
    {
      name: 'moduleId',
      type: 'text',
      admin: { description: 'ID du module formation lié (ex: invitation, closing...)' },
    },
    {
      name: 'messagesJson',
      type: 'json',
      admin: { description: 'Messages de la conversation [{id,role,content,createdAt}]' },
    },
    {
      name: 'flowiseSessionId',
      type: 'text',
      admin: { description: 'ID de session Flowise pour la continuité mémoire' },
    },
  ],
}
