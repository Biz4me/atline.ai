import type { GlobalConfig } from 'payload'

export const AtlasConfig: GlobalConfig = {
  slug: 'atlas-config',
  label: 'Atlas — Configuration',
  admin: {
    group: 'Configuration agents',
  },
  access: {
    read: ({ req }) => !!(req.user as any)?.isAdmin,
    update: ({ req }) => !!(req.user as any)?.isAdmin,
  },
  fields: [
    {
      name: 'systemPrompt',
      type: 'textarea',
      label: 'System Prompt',
    },
    {
      name: 'temperature',
      type: 'number',
      label: 'Température (0–1)',
      min: 0,
      max: 1,
      defaultValue: 0.7,
    },
    {
      name: 'maxTokens',
      type: 'number',
      label: 'Max tokens',
      defaultValue: 2048,
    },
  ],
}
