import type { CollectionConfig } from 'payload'

export const RagDocuments: CollectionConfig = {
  slug: 'rag-documents',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'agent', 'docType', 'status', 'chunksCount', 'createdAt'],
    group: 'RAG',
  },
  access: {
    read: ({ req }) => !!req.user,
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'fileName', type: 'text', admin: { readOnly: true } },
    {
      name: 'agent',
      type: 'select',
      required: true,
      options: [
        { label: 'Atlas', value: 'atlas' },
        { label: 'Markline', value: 'markline' },
        { label: 'Proline', value: 'proline' },
      ],
    },
    {
      name: 'docType',
      type: 'select',
      required: true,
      label: 'Type',
      options: [
        { label: 'Livre', value: 'livre' },
        { label: 'Formation', value: 'formation' },
        { label: 'Script de vente', value: 'script' },
        { label: 'Plan de compensation', value: 'plan_comp' },
        { label: 'Technique', value: 'technique' },
        { label: 'Autre', value: 'autre' },
      ],
    },
    {
      name: 'language',
      type: 'select',
      options: [
        { label: 'Français', value: 'fr' },
        { label: 'Anglais', value: 'en' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'indexed',
      options: [
        { label: 'Indexé', value: 'indexed' },
        { label: 'Erreur', value: 'error' },
      ],
    },
    {
      name: 'chunksCount',
      type: 'number',
      label: 'Chunks',
      admin: { readOnly: true },
    },
    {
      name: 'theme',
      type: 'relationship',
      relationTo: 'rag-tags',
      label: 'Thème',
    },
    {
      name: 'uploadedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: { readOnly: true },
    },
  ],
}
