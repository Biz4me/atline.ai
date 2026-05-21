"use client"

import { useMemo } from "react"

interface QuickPromptsProps {
  onSelect: (prompt: string) => void
}

const ALL_PROMPTS = [
  "Génère un script d'invitation WhatsApp",
  "Comment surmonter l'objection 'c'est une pyramide' ?",
  "Crée mon plan d'action pour cette semaine",
  "Comment recruter mon premier distributeur ?",
  "Analyse mon pitch de présentation",
  "Script pour relancer un prospect froid",
  "Comment motiver mon équipe ?",
  "Stratégie pour ma prochaine présentation",
  "Comment présenter l'opportunité en 2 minutes ?",
  "Aide-moi à gérer le rejet",
  "Quelles habitudes adopter pour réussir en MLM ?",
  "Comment trouver des prospects qualifiés ?",
]

function pickRandom(arr: string[], n: number): string[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, n)
}

export function QuickPrompts({ onSelect }: QuickPromptsProps) {
  const prompts = useMemo(() => pickRandom(ALL_PROMPTS, 3), [])

  return (
    <div className="flex gap-2">
      {prompts.map((prompt) => (
        <button
          key={prompt}
          onClick={() => onSelect(prompt)}
          className="flex-1 truncate rounded-full border border-border bg-transparent px-4 py-2 text-[13px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
        >
          {prompt}
        </button>
      ))}
    </div>
  )
}
