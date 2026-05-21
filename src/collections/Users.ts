import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  access: {
    create: ({ req }) => !req.user, // only unauthenticated users can register
    read: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
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
      name: 'phone',
      type: 'text',
    },
    {
      name: 'avatarUrl',
      type: 'text',
      admin: {
        description: 'URL publique Vercel Blob de la photo de profil',
      },
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
      name: 'xp',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'XP total accumulé (mis à jour par Atlas)' },
    },
    {
      name: 'streak',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Jours consécutifs d\'activité' },
    },
    {
      name: 'modulesCompleted',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Modules formation complétés (sur 8)' },
    },
    {
      name: 'lastSimScore',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Score dernière simulation (/10)' },
    },
    {
      name: 'userMemory',
      type: 'json',
      admin: {
        description: 'Mémoire persistante Atlas — JSON structuré mis à jour après chaque session',
      },
    },
    {
      name: 'experienceLevel',
      type: 'select',
      options: [
        { label: 'Débutant — moins de 3 mois', value: 'beginner' },
        { label: 'En développement — 3 à 12 mois', value: 'developing' },
        { label: 'Expérimenté — plus d\'1 an', value: 'experienced' },
      ],
    },
    {
      name: 'financialGoal',
      type: 'text',
    },
    {
      name: 'weeklyHours',
      type: 'select',
      options: [
        { label: 'Moins de 5h', value: 'lt5' },
        { label: '5-10h', value: '5to10' },
        { label: 'Plus de 10h', value: 'gt10' },
        { label: 'Temps plein', value: 'fulltime' },
      ],
    },
    {
      name: 'socialPlatforms',
      type: 'json',
    },
    {
      name: 'hasProspectList',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'onboardingCompleted',
      type: 'checkbox',
      defaultValue: false,
      saveToJWT: true,
    },
  ],
}
