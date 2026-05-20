import type { CollectionConfig } from 'payload'

export const RagTags: CollectionConfig = {
  slug: 'rag-tags',
  admin: {
    useAsTitle: 'name',
    group: 'RAG',
  },
  access: {
    read: ({ req }) => !!req.user,
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  fields: [
    { name: 'name', type: 'text', required: true, unique: true },
  ],
}
