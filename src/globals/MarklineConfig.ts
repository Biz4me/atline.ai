import type { GlobalConfig } from 'payload'

export const MarklineConfig: GlobalConfig = {
  slug: 'markline-config',
  label: 'Markline — Configuration',
  admin: {
    group: 'Configuration agents',
  },
  access: {
    read: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
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
