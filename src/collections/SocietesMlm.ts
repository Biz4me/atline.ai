import type { CollectionConfig } from 'payload'

export const SocietesMlm: CollectionConfig = {
  slug: 'societes-mlm',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'sector', 'active'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'sector',
      type: 'select',
      options: [
        { label: 'Santé & Nutrition', value: 'sante' },
        { label: 'Bien-être & Beauté', value: 'bien-etre' },
        { label: 'Finance & Assurance', value: 'finance' },
        { label: 'Énergie', value: 'energie' },
        { label: 'Technologie', value: 'technologie' },
        { label: 'Autre', value: 'autre' },
      ],
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'website',
      type: 'text',
    },
    {
      name: 'compensationPlan',
      type: 'textarea',
      admin: { description: 'Résumé du plan de compensation' },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
