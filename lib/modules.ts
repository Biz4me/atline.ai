export interface AtlasModule {
  id: string
  label: string
  subtitle: string
  color: string
  bg: string
  welcome: string
}

export const ATLAS_MODULES: AtlasModule[] = [
  {
    id: "mental",
    label: "Mental",
    subtitle: "Mindset & Motivation",
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.12)",
    welcome:
      "Bienvenue dans ton espace **Mindset & Motivation**. Je suis là pour t'aider à renforcer ta mentalité, surmonter les blocages et rester motivé(e) quoi qu'il arrive. Qu'est-ce qui te pèse en ce moment, ou sur quoi veux-tu travailler ?",
  },
  {
    id: "identifier",
    label: "Identifier",
    subtitle: "Prospection & Liste",
    color: "#10B981",
    bg: "rgba(16,185,129,0.12)",
    welcome:
      "Bienvenue dans ton espace **Prospection & Liste**. Ensemble on va construire et affiner ta liste de prospects, identifier les profils idéaux et définir ta stratégie de ciblage. Par où veux-tu commencer ?",
  },
  {
    id: "approcher",
    label: "Approcher",
    subtitle: "Invitation & Scripts",
    color: "#06B6D4",
    bg: "rgba(6,182,212,0.12)",
    welcome:
      "Bienvenue dans ton espace **Invitation & Scripts**. Je vais t'aider à rédiger des approches qui fonctionnent, travailler tes scripts d'invitation et pratiquer les premières prises de contact. Quel type de prospect veux-tu approcher ?",
  },
  {
    id: "convaincre",
    label: "Convaincre",
    subtitle: "Présentation & Pitch",
    color: "#7C6FE8",
    bg: "rgba(124,111,232,0.12)",
    welcome:
      "Bienvenue dans ton espace **Présentation & Pitch**. On va travailler ta présentation du plan, ton pitch business et ta façon de mettre en valeur l'opportunité. Sur quel aspect veux-tu progresser ?",
  },
  {
    id: "repondre",
    label: "Répondre",
    subtitle: "Gestion Objections",
    color: "#EF4444",
    bg: "rgba(239,68,68,0.12)",
    welcome:
      "Bienvenue dans ton espace **Gestion Objections**. Je suis là pour t'aider à transformer les \"non\" en opportunités. Dis-moi l'objection qui te bloque le plus souvent et on va construire ta réponse parfaite.",
  },
  {
    id: "relancer",
    label: "Relancer",
    subtitle: "Suivi & Relance",
    color: "#8B5CF6",
    bg: "rgba(139,92,246,0.12)",
    welcome:
      "Bienvenue dans ton espace **Suivi & Relance**. Sans suivi, pas de résultats. On va mettre en place ton système de relance, tes templates de messages et ta cadence de contact. Combien de prospects attendent ta relance ?",
  },
  {
    id: "developper",
    label: "Développer",
    subtitle: "Recrutement & Duplication",
    color: "#F97316",
    bg: "rgba(249,115,22,0.12)",
    welcome:
      "Bienvenue dans ton espace **Recrutement & Duplication**. Construire une équipe qui performe, c'est l'art du MLM. Je vais t'aider à recruter les bons profils et à dupliquer ton succès. Où en est ton équipe aujourd'hui ?",
  },
  {
    id: "piloter",
    label: "Piloter",
    subtitle: "Stratégie & Planification",
    color: "#14B8A6",
    bg: "rgba(20,184,166,0.12)",
    welcome:
      "Bienvenue dans ton espace **Stratégie & Planification**. Ici on prend de la hauteur — objectifs, KPIs, planification hebdomadaire et mensuelle. Quel est ton prochain cap à atteindre ?",
  },
]

export function getModule(id: string): AtlasModule | undefined {
  return ATLAS_MODULES.find((m) => m.id === id)
}
