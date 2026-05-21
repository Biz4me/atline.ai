export type ModuleSource = "atlas" | "proline" | "markline"

export interface AtlasModule {
  id: string
  label: string
  subtitle: string
  color: string
  bg: string
  welcome: string
  source: ModuleSource
  moduleContext: string
  specialized?: boolean
}

export const ATLAS_MODULES: AtlasModule[] = [
  // ── 8 modules core ──────────────────────────────────────────
  {
    id: "mental",
    label: "Mental",
    subtitle: "Mindset & Motivation",
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.12)",
    source: "atlas",
    moduleContext:
      "Focus : psychologie MLM, gestion du rejet, confiance en soi et construction d'une identité entrepreneuriale forte. Aide l'utilisateur à rester motivé face aux doutes et aux « non ».",
    welcome:
      "Bienvenue dans ton espace **Mindset & Motivation**. Je suis là pour t'aider à renforcer ta mentalité, surmonter les blocages et rester motivé(e) quoi qu'il arrive. Qu'est-ce qui te pèse en ce moment, ou sur quoi veux-tu travailler ?",
  },
  {
    id: "identifier",
    label: "Identifier",
    subtitle: "Prospection & Liste",
    color: "#10B981",
    bg: "rgba(16,185,129,0.12)",
    source: "atlas",
    moduleContext:
      "Focus : construction et qualification de la liste de noms, critères de ciblage, profils idéaux et outils de pipeline. Aide l'utilisateur à transformer ses contacts en prospects qualifiés.",
    welcome:
      "Bienvenue dans ton espace **Prospection & Liste**. Ensemble on va construire et affiner ta liste de prospects, identifier les profils idéaux et définir ta stratégie de ciblage. Par où veux-tu commencer ?",
  },
  {
    id: "approcher",
    label: "Approcher",
    subtitle: "Invitation & Scripts",
    color: "#06B6D4",
    bg: "rgba(6,182,212,0.12)",
    source: "atlas",
    moduleContext:
      "Focus : techniques d'approche, scripts d'invitation personnalisés, prise de contact initiale (message, appel, réseaux sociaux) et gestion des premières réponses.",
    welcome:
      "Bienvenue dans ton espace **Invitation & Scripts**. Je vais t'aider à rédiger des approches qui fonctionnent, travailler tes scripts d'invitation et pratiquer les premières prises de contact. Quel type de prospect veux-tu approcher ?",
  },
  {
    id: "convaincre",
    label: "Convaincre",
    subtitle: "Présentation & Pitch",
    color: "#7C6FE8",
    bg: "rgba(124,111,232,0.12)",
    source: "atlas",
    moduleContext:
      "Focus : présentation de l'opportunité MLM, formats de pitch (1-to-1, réunion, Zoom), storytelling personnel et mise en valeur de la liberté financière. Aide à structurer une présentation convaincante.",
    welcome:
      "Bienvenue dans ton espace **Présentation & Pitch**. On va travailler ta présentation du plan, ton pitch business et ta façon de mettre en valeur l'opportunité. Sur quel aspect veux-tu progresser ?",
  },
  {
    id: "repondre",
    label: "Répondre",
    subtitle: "Gestion Objections",
    color: "#EF4444",
    bg: "rgba(239,68,68,0.12)",
    source: "atlas",
    moduleContext:
      "Focus : traitement des objections MLM (\"pas le temps\", \"trop cher\", \"c'est une pyramide\"), méthode Feel-Felt-Found, recadrage positif et transformation du doute en curiosité.",
    welcome:
      "Bienvenue dans ton espace **Gestion Objections**. Je suis là pour t'aider à transformer les \"non\" en opportunités. Dis-moi l'objection qui te bloque le plus souvent et on va construire ta réponse parfaite.",
  },
  {
    id: "relancer",
    label: "Relancer",
    subtitle: "Suivi & Relance",
    color: "#8B5CF6",
    bg: "rgba(139,92,246,0.12)",
    source: "atlas",
    moduleContext:
      "Focus : systèmes de suivi prospects, templates de messages de relance, cadence de contact optimale et gestion du pipeline sans paraître insistant.",
    welcome:
      "Bienvenue dans ton espace **Suivi & Relance**. Sans suivi, pas de résultats. On va mettre en place ton système de relance, tes templates de messages et ta cadence de contact. Combien de prospects attendent ta relance ?",
  },
  {
    id: "developper",
    label: "Développer",
    subtitle: "Recrutement & Duplication",
    color: "#F97316",
    bg: "rgba(249,115,22,0.12)",
    source: "atlas",
    moduleContext:
      "Focus : recrutement de nouveaux membres, onboarding efficace, duplication des méthodes gagnantes et développement du leadership d'équipe.",
    welcome:
      "Bienvenue dans ton espace **Recrutement & Duplication**. Construire une équipe qui performe, c'est l'art du MLM. Je vais t'aider à recruter les bons profils et à dupliquer ton succès. Où en est ton équipe aujourd'hui ?",
  },
  {
    id: "piloter",
    label: "Piloter",
    subtitle: "Stratégie & Planification",
    color: "#14B8A6",
    bg: "rgba(20,184,166,0.12)",
    source: "atlas",
    moduleContext:
      "Focus : stratégie globale MLM, KPIs à suivre, planification hebdomadaire et mensuelle, vision long terme et pilotage de la croissance.",
    welcome:
      "Bienvenue dans ton espace **Stratégie & Planification**. Ici on prend de la hauteur — objectifs, KPIs, planification hebdomadaire et mensuelle. Quel est ton prochain cap à atteindre ?",
  },

  // ── 3 modules spécialisés ────────────────────────────────────
  {
    id: "produit",
    label: "Produit",
    subtitle: "Connaissance Produit",
    color: "#3B82F6",
    bg: "rgba(59,130,246,0.12)",
    source: "proline",
    specialized: true,
    moduleContext:
      "Tu puises en PRIORITÉ dans la base Proline pour répondre sur les caractéristiques, bénéfices, ingrédients et positionnement des produits. Aide l'utilisateur à maîtriser son catalogue produit pour convaincre ses clients et prospects.",
    welcome:
      "Bienvenue dans ton espace **Connaissance Produit**. Je m'appuie sur la documentation Proline pour t'aider à maîtriser ton catalogue : ingrédients, bénéfices, arguments de vente. Quel produit veux-tu approfondir ?",
  },
  {
    id: "vendre",
    label: "Vendre",
    subtitle: "Vente Produit & Client",
    color: "#EC4899",
    bg: "rgba(236,72,153,0.12)",
    source: "markline",
    specialized: true,
    moduleContext:
      "Tu puises en PRIORITÉ dans la base Markline pour accompagner la vente directe, la création de contenu orienté client et la stratégie réseaux sociaux pour vendre les produits.",
    welcome:
      "Bienvenue dans ton espace **Vente Produit & Client**. Je m'appuie sur les ressources Markline pour t'aider à vendre plus efficacement : contenu, arguments clients, stratégie réseaux. Par où commences-tu ?",
  },
  {
    id: "financer",
    label: "Financer",
    subtitle: "Plan de Compensation",
    color: "#22C55E",
    bg: "rgba(34,197,94,0.12)",
    source: "proline",
    specialized: true,
    moduleContext:
      "Tu puises en PRIORITÉ dans la base Proline pour expliquer le plan de compensation : niveaux de qualification, bonus, commissions et stratégies de maximisation des revenus MLM.",
    welcome:
      "Bienvenue dans ton espace **Plan de Compensation**. Je m'appuie sur la documentation Proline pour t'aider à comprendre et optimiser tes revenus : niveaux, bonus, stratégies de qualification. Qu'est-ce que tu veux éclaircir ?",
  },
]

export function getModule(id: string): AtlasModule | undefined {
  return ATLAS_MODULES.find((m) => m.id === id)
}

export const CORE_MODULES = ATLAS_MODULES.filter((m) => !m.specialized)
export const SPECIALIZED_MODULES = ATLAS_MODULES.filter((m) => m.specialized)
